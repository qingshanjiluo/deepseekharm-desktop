import React, { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import 'highlight.js/styles/github-dark.css'
import 'katex/dist/katex.min.css'
import './MarkdownText.css'

interface MarkdownTextProps {
  content: string
  className?: string
}

export function MarkdownText({ content, className = '' }: MarkdownTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // 复制代码功能
  useEffect(() => {
    if (!containerRef.current) return

    const handleCopyCode = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('copy-code-btn')) {
        const codeBlock = target.closest('.code-block-wrapper')
        const code = codeBlock?.querySelector('code')?.textContent
        if (code) {
          navigator.clipboard.writeText(code)
          target.textContent = '已复制!'
          setTimeout(() => {
            target.textContent = '复制'
          }, 2000)
        }
      }
    }

    containerRef.current.addEventListener('click', handleCopyCode)
    return () => {
      containerRef.current?.removeEventListener('click', handleCopyCode)
    }
  }, [content])

  return (
    <div ref={containerRef} className={`markdown-text ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight, rehypeKatex]}
        components={{
          // 代码块组件
          pre({ children, ...props }) {
            const codeElement = React.Children.toArray(children).find(
              child => React.isValidElement(child) && child.type === 'code'
            ) as React.ReactElement<{ className?: string; children?: React.ReactNode }> | undefined
            
            const className = codeElement?.props?.className || ''
            const match = /language-(\w+)/.exec(className)
            const language = match ? match[1] : ''
            
            return (
              <div className="code-block-wrapper">
                {language && (
                  <div className="code-block-header">
                    <span className="code-language">{language}</span>
                    <button className="copy-code-btn">复制</button>
                  </div>
                )}
                <pre className={className} {...props}>
                  {children}
                </pre>
              </div>
            )
          },
          // 行内代码
          code({ className, children, ...props }) {
            const isInline = !className
            if (isInline) {
              return (
                <code className="inline-code" {...props}>
                  {children}
                </code>
              )
            }
            return (
              <code className={className} {...props}>
                {children}
              </code>
            )
          },
          // 链接
          a({ href, children, ...props }) {
            return (
              <a 
                href={href} 
                target="_blank" 
                rel="noopener noreferrer"
                className="markdown-link"
                {...props}
              >
                {children}
              </a>
            )
          },
          // 表格
          table({ children, ...props }) {
            return (
              <div className="table-wrapper">
                <table {...props}>{children}</table>
              </div>
            )
          },
          // 引用块
          blockquote({ children, ...props }) {
            return (
              <blockquote className="markdown-blockquote" {...props}>
                {children}
              </blockquote>
            )
          },
          // 列表
          ul({ children, ...props }) {
            return <ul className="markdown-list" {...props}>{children}</ul>
          },
          ol({ children, ...props }) {
            return <ol className="markdown-list" {...props}>{children}</ol>
          },
          // 标题
          h1({ children, ...props }) {
            return <h1 className="markdown-h1" {...props}>{children}</h1>
          },
          h2({ children, ...props }) {
            return <h2 className="markdown-h2" {...props}>{children}</h2>
          },
          h3({ children, ...props }) {
            return <h3 className="markdown-h3" {...props}>{children}</h3>
          },
          // 分割线
          hr(props) {
            return <hr className="markdown-hr" {...props} />
          },
          // 图片
          img({ src, alt, ...props }) {
            return (
              <img 
                src={src} 
                alt={alt} 
                className="markdown-image"
                loading="lazy"
                {...props}
              />
            )
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
