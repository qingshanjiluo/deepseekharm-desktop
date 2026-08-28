import React, { useState } from 'react'
import './OnboardingDialog.css'

interface OnboardingDialogProps {
  isOpen: boolean
  onComplete: (config: { apiKey: string; model: string }) => void
  onSkip: () => void
}

type Step = 'welcome' | 'api_key' | 'model' | 'done'

const MODELS = [
  { id: 'deepseek-chat', name: 'DeepSeek Chat', desc: '通用对话模型' },
  { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', desc: '推理增强模型' },
  { id: 'gpt-4o', name: 'GPT-4o', desc: 'OpenAI 多模态模型' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', desc: 'OpenAI 轻量模型' },
  { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', desc: 'Anthropic 平衡模型' },
]

export function OnboardingDialog({ isOpen, onComplete, onSkip }: OnboardingDialogProps) {
  const [step, setStep] = useState<Step>('welcome')
  const [apiKey, setApiKey] = useState('')
  const [selectedModel, setSelectedModel] = useState('deepseek-chat')

  if (!isOpen) return null

  const handleComplete = () => {
    onComplete({ apiKey, model: selectedModel })
  }

  return (
    <div className="onboarding-overlay">
      <div className="onboarding-dialog">
        {step === 'welcome' && (
          <div className="onboarding-step">
            <div className="step-icon welcome">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h2>欢迎使用 DeepSeek Harness</h2>
            <p>让我们快速配置您的 AI 助手</p>
            <div className="step-actions">
              <button className="primary-btn" onClick={() => setStep('api_key')}>
                开始配置
              </button>
              <button className="skip-btn" onClick={onSkip}>
                跳过，稍后配置
              </button>
            </div>
          </div>
        )}

        {step === 'api_key' && (
          <div className="onboarding-step">
            <div className="step-icon api">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2>配置 API Key</h2>
            <p>输入您的 DeepSeek API Key</p>
            <div className="input-group">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="onboarding-input"
                autoFocus
              />
              <span className="input-hint">API Key 会安全存储在本地</span>
            </div>
            <div className="step-actions">
              <button className="secondary-btn" onClick={() => setStep('welcome')}>
                返回
              </button>
              <button 
                className="primary-btn" 
                onClick={() => setStep('model')}
                disabled={!apiKey.trim()}
              >
                下一步
              </button>
            </div>
          </div>
        )}

        {step === 'model' && (
          <div className="onboarding-step">
            <div className="step-icon model">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
              </svg>
            </div>
            <h2>选择模型</h2>
            <p>选择您要使用的 AI 模型</p>
            <div className="model-options">
              {MODELS.map(model => (
                <button
                  key={model.id}
                  className={`model-option ${selectedModel === model.id ? 'selected' : ''}`}
                  onClick={() => setSelectedModel(model.id)}
                >
                  <span className="option-name">{model.name}</span>
                  <span className="option-desc">{model.desc}</span>
                </button>
              ))}
            </div>
            <div className="step-actions">
              <button className="secondary-btn" onClick={() => setStep('api_key')}>
                返回
              </button>
              <button className="primary-btn" onClick={() => setStep('done')}>
                完成
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="onboarding-step">
            <div className="step-icon done">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <h2>配置完成！</h2>
            <p>您已准备好开始使用 DeepSeek Harness</p>
            <div className="step-actions">
              <button className="primary-btn" onClick={handleComplete}>
                开始使用
              </button>
            </div>
          </div>
        )}

        <div className="step-indicator">
          {['welcome', 'api_key', 'model', 'done'].map((s, i) => (
            <div key={s} className={`dot ${step === s ? 'active' : ''} ${['welcome', 'api_key', 'model', 'done'].indexOf(step) > i ? 'completed' : ''}`} />
          ))}
        </div>
      </div>
    </div>
  )
}
