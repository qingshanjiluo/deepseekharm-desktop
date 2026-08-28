import React, { useState, useRef, useEffect } from 'react'
import { knowledgeService, KnowledgeDocument, SearchResult } from '../../backend/knowledge-service'
import { useTranslation } from '../../i18n'
import './KnowledgePanel.css'

interface KnowledgePanelProps {
  isOpen: boolean
  onClose: () => void
  onInsertContext?: (context: string) => void
}

export function KnowledgePanel({ isOpen, onClose, onInsertContext }: KnowledgePanelProps) {
  const { t } = useTranslation()
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isOpen) {
      setDocuments(knowledgeService.getDocuments())
    }
  }, [isOpen])

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return

    for (const file of Array.from(files)) {
      const content = await file.text()
      knowledgeService.addDocument({
        name: file.name,
        type: file.type.startsWith('image/') ? 'file' : 
              file.name.match(/\.(js|ts|py|java|c|cpp|rs|go)$/) ? 'code' : 'file',
        content,
        size: file.size,
        tags: [],
      })
    }

    setDocuments(knowledgeService.getDocuments())
  }

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    const results = knowledgeService.search(searchQuery)
    setSearchResults(results)
    setIsSearching(false)
  }

  const handleInsertContext = (result: SearchResult) => {
    if (onInsertContext) {
      onInsertContext(result.highlightedContent)
    }
  }

  const handleDeleteDoc = (id: string) => {
    knowledgeService.removeDocument(id)
    setDocuments(knowledgeService.getDocuments())
    if (selectedDoc?.id === id) {
      setSelectedDoc(null)
    }
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (!isOpen) return null

  return (
    <div className="knowledge-overlay" onClick={onClose}>
      <div className="knowledge-modal" onClick={(e) => e.stopPropagation()}>
        {/* 头部 */}
        <div className="knowledge-header">
          <h2 className="knowledge-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            知识库
          </h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="knowledge-body">
          {/* 搜索栏 */}
          <div className="knowledge-search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索知识库..."
              className="search-input"
            />
            <button className="search-btn" onClick={handleSearch}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </div>

          {/* 操作栏 */}
          <div className="knowledge-actions">
            <button 
              className="action-btn primary"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17 8 12 3 7 8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
              上传文件
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".txt,.md,.js,.ts,.py,.java,.c,.cpp,.rs,.go,.json,.yaml,.yml,.csv"
              style={{ display: 'none' }}
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <span className="doc-count">{documents.length} 个文档</span>
          </div>

          {/* 内容区 */}
          <div className="knowledge-content">
            {/* 搜索结果 */}
            {searchResults.length > 0 && (
              <div className="search-results">
                <h4>搜索结果 ({searchResults.length})</h4>
                {searchResults.map((result) => (
                  <div key={result.chunk.id} className="result-item">
                    <div className="result-header">
                      <span className="result-doc">{result.document.name}</span>
                      <span className="result-score">相关度: {(result.score * 100).toFixed(0)}%</span>
                    </div>
                    <div className="result-content">
                      {result.highlightedContent.slice(0, 300)}
                      {result.highlightedContent.length > 300 && '...'}
                    </div>
                    <div className="result-actions">
                      <button 
                        className="result-btn"
                        onClick={() => handleInsertContext(result)}
                      >
                        插入到对话
                      </button>
                      <button 
                        className="result-btn"
                        onClick={() => setSelectedDoc(result.document)}
                      >
                        查看文档
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 文档列表 */}
            {searchResults.length === 0 && (
              <div className="document-list">
                {documents.length === 0 ? (
                  <div className="empty-knowledge">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14 2 14 8 20 8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                      <polyline points="10 9 9 9 8 9"/>
                    </svg>
                    <p>知识库为空</p>
                    <span>上传文件以开始使用知识库功能</span>
                  </div>
                ) : (
                  documents.map((doc) => (
                    <div 
                      key={doc.id} 
                      className={`document-item ${selectedDoc?.id === doc.id ? 'selected' : ''}`}
                      onClick={() => setSelectedDoc(doc)}
                    >
                      <div className="doc-icon">
                        {doc.type === 'code' ? (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="16 18 22 12 16 6"/>
                            <polyline points="8 6 2 12 8 18"/>
                          </svg>
                        ) : (
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                          </svg>
                        )}
                      </div>
                      <div className="doc-info">
                        <span className="doc-name">{doc.name}</span>
                        <span className="doc-meta">{formatSize(doc.size)}</span>
                      </div>
                      <button 
                        className="doc-delete"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteDoc(doc.id)
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 文档预览 */}
            {selectedDoc && (
              <div className="document-preview">
                <div className="preview-header">
                  <h4>{selectedDoc.name}</h4>
                  <button onClick={() => setSelectedDoc(null)}>关闭</button>
                </div>
                <pre className="preview-content">
                  {selectedDoc.content.slice(0, 5000)}
                  {selectedDoc.content.length > 5000 && '\n\n... (内容已截断)'}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
