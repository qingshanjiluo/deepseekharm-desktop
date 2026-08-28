/**
 * 知识库管理器
 * 支持文件上传、文本索引、上下文检索
 */

export interface KnowledgeDocument {
  id: string
  name: string
  type: 'file' | 'text' | 'code'
  content: string
  size: number
  path?: string
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface KnowledgeChunk {
  id: string
  documentId: string
  content: string
  index: number
  startChar: number
  endChar: number
}

export interface SearchResult {
  document: KnowledgeDocument
  chunk: KnowledgeChunk
  score: number
  highlightedContent: string
}

const CHUNK_SIZE = 1000
const CHUNK_OVERLAP = 200

/**
 * 知识库服务
 */
export class KnowledgeService {
  private documents: Map<string, KnowledgeDocument> = new Map()
  private chunks: Map<string, KnowledgeChunk[]> = new Map()
  private storageKey = 'deepseek-knowledge-base'

  constructor() {
    this.loadFromStorage()
  }

  /**
   * 从本地存储加载
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.storageKey)
      if (data) {
        const parsed = JSON.parse(data)
        parsed.documents.forEach((doc: KnowledgeDocument) => {
          this.documents.set(doc.id, doc)
        })
        parsed.chunks.forEach((item: { docId: string; chunks: KnowledgeChunk[] }) => {
          this.chunks.set(item.docId, item.chunks)
        })
      }
    } catch (error) {
      console.error('Failed to load knowledge base:', error)
    }
  }

  /**
   * 保存到本地存储
   */
  private saveToStorage(): void {
    try {
      const documents = Array.from(this.documents.values())
      const chunks = Array.from(this.chunks.entries()).map(([docId, chunks]) => ({
        docId,
        chunks,
      }))
      localStorage.setItem(this.storageKey, JSON.stringify({ documents, chunks }))
    } catch (error) {
      console.error('Failed to save knowledge base:', error)
    }
  }

  /**
   * 添加文档
   */
  addDocument(doc: Omit<KnowledgeDocument, 'id' | 'createdAt' | 'updatedAt'>): KnowledgeDocument {
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `kb-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    this.documents.set(newDoc.id, newDoc)
    this.chunkDocument(newDoc)
    this.saveToStorage()

    return newDoc
  }

  /**
   * 删除文档
   */
  removeDocument(id: string): void {
    this.documents.delete(id)
    this.chunks.delete(id)
    this.saveToStorage()
  }

  /**
   * 获取所有文档
   */
  getDocuments(): KnowledgeDocument[] {
    return Array.from(this.documents.values())
  }

  /**
   * 获取文档
   */
  getDocument(id: string): KnowledgeDocument | undefined {
    return this.documents.get(id)
  }

  /**
   * 更新文档
   */
  updateDocument(id: string, updates: Partial<KnowledgeDocument>): void {
    const doc = this.documents.get(id)
    if (doc) {
      const updated = { ...doc, ...updates, updatedAt: Date.now() }
      this.documents.set(id, updated)
      this.chunkDocument(updated)
      this.saveToStorage()
    }
  }

  /**
   * 将文档分块
   */
  private chunkDocument(doc: KnowledgeDocument): void {
    const chunks: KnowledgeChunk[] = []
    const content = doc.content

    for (let i = 0; i < content.length; i += CHUNK_SIZE - CHUNK_OVERLAP) {
      const end = Math.min(i + CHUNK_SIZE, content.length)
      chunks.push({
        id: `${doc.id}-chunk-${chunks.length}`,
        documentId: doc.id,
        content: content.slice(i, end),
        index: chunks.length,
        startChar: i,
        endChar: end,
      })

      if (end === content.length) break
    }

    this.chunks.set(doc.id, chunks)
  }

  /**
   * 搜索文档
   */
  search(query: string, limit = 5): SearchResult[] {
    const queryLower = query.toLowerCase()
    const results: SearchResult[] = []

    this.chunks.forEach((docChunks, docId) => {
      const doc = this.documents.get(docId)
      if (!doc) return

      docChunks.forEach(chunk => {
        const contentLower = chunk.content.toLowerCase()
        const queryIndex = contentLower.indexOf(queryLower)

        if (queryIndex !== -1) {
          // 计算简单相关度分数
          let score = 0
          let lastIndex = 0
          let matchCount = 0

          while (lastIndex < contentLower.length) {
            const idx = contentLower.indexOf(queryLower, lastIndex)
            if (idx === -1) break
            matchCount++
            score += 1 / (1 + Math.abs(idx - queryIndex) / 100)
            lastIndex = idx + queryLower.length
          }

          // 基础分数 + 匹配次数加分
          score = (score + matchCount * 0.5) / (chunk.content.length / 100)

          // 高亮匹配内容
          const highlightedContent = chunk.content.replace(
            new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'),
            '**$1**'
          )

          results.push({
            document: doc,
            chunk,
            score,
            highlightedContent,
          })
        }
      })
    })

    // 按分数排序
    results.sort((a, b) => b.score - a.score)

    return results.slice(0, limit)
  }

  /**
   * 获取上下文（用于注入到 LLM 提示）
   */
  getContext(query: string, maxTokens = 2000): string {
    const results = this.search(query, 10)
    if (results.length === 0) return ''

    let context = '\n\n## 知识库参考\n\n'
    let totalLength = 0

    for (const result of results) {
      const chunkText = `\n### ${result.document.name}\n\n${result.chunk.content}\n`
      if (totalLength + chunkText.length > maxTokens * 4) break // 粗略估算 token
      context += chunkText
      totalLength += chunkText.length
    }

    return context
  }

  /**
   * 导出知识库
   */
  export(): string {
    return JSON.stringify({
      documents: Array.from(this.documents.values()),
      exportedAt: Date.now(),
    }, null, 2)
  }

  /**
   * 导入知识库
   */
  import(data: string): void {
    try {
      const parsed = JSON.parse(data)
      if (parsed.documents) {
        parsed.documents.forEach((doc: KnowledgeDocument) => {
          this.documents.set(doc.id, doc)
          this.chunkDocument(doc)
        })
        this.saveToStorage()
      }
    } catch (error) {
      console.error('Failed to import knowledge base:', error)
      throw error
    }
  }

  /**
   * 清空知识库
   */
  clear(): void {
    this.documents.clear()
    this.chunks.clear()
    this.saveToStorage()
  }
}

// 单例
export const knowledgeService = new KnowledgeService()
