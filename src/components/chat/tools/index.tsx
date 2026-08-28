export { BashView } from './BashView'
export { FileEditView } from './FileEditView'
export { FileReadView } from './FileReadView'
export { SearchView } from './SearchView'
export { WebView } from './WebView'

import React from 'react'
import { ToolCall } from '../../../store'
import { BashView } from './BashView'
import { FileEditView } from './FileEditView'
import { FileReadView } from './FileReadView'
import { SearchView } from './SearchView'
import { WebView } from './WebView'

function parseToolArgs(args: string): Record<string, any> {
  try {
    return JSON.parse(args || '{}')
  } catch {
    return { raw: args }
  }
}

function getToolType(name: string): string {
  const n = name.toLowerCase()
  if (n.includes('bash') || n.includes('exec') || n.includes('run') || n.includes('terminal')) return 'bash'
  if (n.includes('write') || n.includes('edit') || n.includes('create') || n.includes('modify')) return 'file-edit'
  if (n.includes('read') || n.includes('view') || n.includes('open') || n.includes('cat')) return 'file-read'
  if (n.includes('search') || n.includes('grep') || n.includes('find') || n.includes('rg')) return 'search'
  if (n.includes('web') || n.includes('browse') || n.includes('fetch') || n.includes('http')) return 'web'
  return 'generic'
}

export function getToolView(tool: ToolCall): React.ReactNode {
  const args = parseToolArgs(tool.arguments)
  const type = getToolType(tool.name)

  switch (type) {
    case 'bash':
      return (
        <BashView
          command={args.command || args.cmd || tool.name}
          output={tool.result}
          exitCode={args.exit_code}
        />
      )
    case 'file-edit':
      return (
        <FileEditView
          filePath={args.file_path || args.path || args.filePath || '未知文件'}
          diff={args.diff}
          content={args.content}
        />
      )
    case 'file-read':
      return (
        <FileReadView
          filePath={args.file_path || args.path || args.filePath || '未知文件'}
          content={tool.result || args.content}
          lineCount={args.line_count}
          startLine={args.start_line || 1}
        />
      )
    case 'search':
      return (
        <SearchView
          query={args.query || args.pattern || args.keyword || ''}
          results={args.results}
          resultCount={args.result_count || (args.results as any[])?.length}
        />
      )
    case 'web':
      return (
        <WebView
          query={args.query || args.url || ''}
          results={args.results}
        />
      )
    default:
      return null
  }
}
