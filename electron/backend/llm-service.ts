/**
 * DeepSeek API 客户端
 * 支持流式响应、多模型切换
 */

export interface LlmMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface LlmStreamOptions {
  provider: string
  model: string
  messages: LlmMessage[]
  system?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  stop?: string[]
  stream?: boolean
}

export interface LlmStreamChunk {
  type: 'text-delta' | 'reasoning-delta' | 'tool-call-delta' | 'block-end' | 'usage' | 'finish'
  delta?: string
  toolCall?: { id: string; name: string; arguments: string }
  usage?: { inputTokens: number; outputTokens: number }
  finishReason?: string
}

export interface LlmConfig {
  provider: string
  apiKey: string
  baseUrl: string
  model: string
}

// 提供商配置
const PROVIDER_CONFIGS: Record<string, { baseUrl: string; models: string[] }> = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com',
    models: ['deepseek-chat', 'deepseek-reasoner'],
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
  },
  anthropic: {
    baseUrl: 'https://api.anthropic.com',
    models: ['claude-sonnet-4-20250514', 'claude-3-5-haiku-20241022'],
  },
  custom: {
    baseUrl: '',
    models: [],
  },
}

export class LlmService {
  private config: LlmConfig = {
    provider: 'deepseek',
    apiKey: '',
    baseUrl: 'https://api.deepseek.com',
    model: 'deepseek-chat',
  }

  private abortControllers: Map<string, AbortController> = new Map()

  getConfig(): LlmConfig {
    return { ...this.config }
  }

  updateConfig(updates: Partial<LlmConfig>): void {
    this.config = { ...this.config, ...updates }
    
    // 如果切换了提供商，更新 baseUrl
    if (updates.provider && updates.provider !== 'custom') {
      const providerConfig = PROVIDER_CONFIGS[updates.provider]
      if (providerConfig) {
        this.config.baseUrl = providerConfig.baseUrl
      }
    }
  }

  setProvider(provider: string): void {
    this.config.provider = provider
    const providerConfig = PROVIDER_CONFIGS[provider]
    if (providerConfig) {
      this.config.baseUrl = providerConfig.baseUrl
      if (providerConfig.models.length > 0) {
        this.config.model = providerConfig.models[0]
      }
    }
  }

  listModels(): Array<{ id: string; name: string; provider: string }> {
    const models: Array<{ id: string; name: string; provider: string }> = []
    
    Object.entries(PROVIDER_CONFIGS).forEach(([provider, config]) => {
      config.models.forEach(modelId => {
        models.push({
          id: modelId,
          name: modelId,
          provider,
        })
      })
    })
    
    return models
  }

  /**
   * 流式调用 LLM
   */
  async *stream(options: LlmStreamOptions): AsyncGenerator<LlmStreamChunk> {
    const rpcId = crypto.randomUUID()
    const controller = new AbortController()
    this.abortControllers.set(rpcId, controller)

    try {
      const baseUrl = options.provider === 'custom' 
        ? this.config.baseUrl 
        : PROVIDER_CONFIGS[options.provider]?.baseUrl || this.config.baseUrl

      // 构建请求消息
      const messages: LlmMessage[] = []
      if (options.system) {
        messages.push({ role: 'system', content: options.system })
      }
      messages.push(...options.messages)

      // DeepSeek 使用 OpenAI 兼容格式
      const response = await fetch(`${baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
        },
        body: JSON.stringify({
          model: options.model,
          messages,
          stream: true,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.maxTokens ?? 4096,
          top_p: options.topP,
          frequency_penalty: options.frequencyPenalty,
          presence_penalty: options.presencePenalty,
          stop: options.stop,
        }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`API error ${response.status}: ${error}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue

          const data = trimmed.slice(6)
          if (data === '[DONE]') {
            yield { type: 'finish', finishReason: 'stop' }
            return
          }

          try {
            const parsed = JSON.parse(data)
            const choice = parsed.choices?.[0]
            if (!choice) continue

            // 处理增量内容
            if (choice.delta?.content) {
              yield { type: 'text-delta', delta: choice.delta.content }
            }

            // 处理推理内容（DeepSeek Reasoner）
            if (choice.delta?.reasoning_content) {
              yield { type: 'reasoning-delta', delta: choice.delta.reasoning_content }
            }

            // 处理工具调用
            if (choice.delta?.tool_calls) {
              for (const toolCall of choice.delta.tool_calls) {
                yield {
                  type: 'tool-call-delta',
                  toolCall: {
                    id: toolCall.id || '',
                    name: toolCall.function?.name || '',
                    arguments: toolCall.function?.arguments || '',
                  },
                }
              }
            }

            // 处理使用量
            if (parsed.usage) {
              yield {
                type: 'usage',
                usage: {
                  inputTokens: parsed.usage.prompt_tokens,
                  outputTokens: parsed.usage.completion_tokens,
                },
              }
            }

            // 处理结束
            if (choice.finish_reason) {
              yield { type: 'finish', finishReason: choice.finish_reason }
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        yield { type: 'finish', finishReason: 'abort' }
      } else {
        throw error
      }
    } finally {
      this.abortControllers.delete(rpcId)
    }
  }

  /**
   * 取消流式请求
   */
  cancelStream(rpcId: string): void {
    const controller = this.abortControllers.get(rpcId)
    if (controller) {
      controller.abort()
      this.abortControllers.delete(rpcId)
    }
  }

  /**
   * 取消所有流式请求
   */
  cancelAllStreams(): void {
    this.abortControllers.forEach(controller => controller.abort())
    this.abortControllers.clear()
  }
}

// 单例导出
export const llmService = new LlmService()
