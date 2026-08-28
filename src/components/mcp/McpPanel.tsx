import React, { useState, useEffect } from 'react'
import { mcpService, McpServer, McpTool } from '../../backend/mcp-service'
import './McpPanel.css'

interface McpPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function McpPanel({ isOpen, onClose }: McpPanelProps) {
  const [servers, setServers] = useState<McpServer[]>([])
  const [tools, setTools] = useState<McpTool[]>([])
  const [selectedServer, setSelectedServer] = useState<McpServer | null>(null)
  const [isAdding, setIsAdding] = useState(false)
  const [newServer, setNewServer] = useState({
    name: '',
    transport: 'stdio' as const,
    command: '',
    args: '',
    url: '',
  })

  useEffect(() => {
    if (isOpen) {
      setServers(mcpService.getServers())
      setTools(mcpService.getTools())
    }
  }, [isOpen])

  const handleAddServer = () => {
    if (!newServer.name) return

    mcpService.addServer({
      name: newServer.name,
      description: '',
      transport: newServer.transport,
      command: newServer.transport === 'stdio' ? newServer.command : undefined,
      args: newServer.transport === 'stdio' ? newServer.args.split(' ').filter(Boolean) : undefined,
      url: newServer.transport !== 'stdio' ? newServer.url : undefined,
      enabled: true,
      autoStart: false,
    })

    setServers(mcpService.getServers())
    setIsAdding(false)
    setNewServer({ name: '', transport: 'stdio', command: '', args: '', url: '' })
  }

  const handleConnect = async (server: McpServer) => {
    try {
      await mcpService.connectServer(server.id)
      setServers(mcpService.getServers())
    } catch (error) {
      console.error('Failed to connect:', error)
    }
  }

  const handleDisconnect = async (server: McpServer) => {
    try {
      await mcpService.disconnectServer(server.id)
      setServers(mcpService.getServers())
    } catch (error) {
      console.error('Failed to disconnect:', error)
    }
  }

  const handleDelete = (server: McpServer) => {
    mcpService.removeServer(server.id)
    setServers(mcpService.getServers())
    setTools(mcpService.getTools())
    if (selectedServer?.id === server.id) {
      setSelectedServer(null)
    }
  }

  const handleToggle = (server: McpServer) => {
    mcpService.updateServer(server.id, { enabled: !server.enabled })
    setServers(mcpService.getServers())
  }

  if (!isOpen) return null

  return (
    <div className="mcp-overlay" onClick={onClose}>
      <div className="mcp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mcp-header">
          <h2 className="mcp-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
              <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
              <line x1="6" y1="6" x2="6.01" y2="6"/>
              <line x1="6" y1="18" x2="6.01" y2="18"/>
            </svg>
            MCP 服务器管理
          </h2>
          <button className="close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div className="mcp-body">
          {/* 服务器列表 */}
          <div className="mcp-sidebar">
            <div className="sidebar-header">
              <span className="sidebar-title">服务器 ({servers.length})</span>
              <button className="add-btn" onClick={() => setIsAdding(true)}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
            </div>

            {/* 添加服务器表单 */}
            {isAdding && (
              <div className="add-server-form">
                <input
                  type="text"
                  value={newServer.name}
                  onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                  placeholder="服务器名称"
                  className="form-input"
                />
                <select
                  value={newServer.transport}
                  onChange={(e) => setNewServer({ ...newServer, transport: e.target.value as any })}
                  className="form-select"
                >
                  <option value="stdio">Stdio</option>
                  <option value="sse">SSE</option>
                  <option value="streamable-http">Streamable HTTP</option>
                </select>
                {newServer.transport === 'stdio' ? (
                  <>
                    <input
                      type="text"
                      value={newServer.command}
                      onChange={(e) => setNewServer({ ...newServer, command: e.target.value })}
                      placeholder="命令 (如: npx)"
                      className="form-input"
                    />
                    <input
                      type="text"
                      value={newServer.args}
                      onChange={(e) => setNewServer({ ...newServer, args: e.target.value })}
                      placeholder="参数 (空格分隔)"
                      className="form-input"
                    />
                  </>
                ) : (
                  <input
                    type="text"
                    value={newServer.url}
                    onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                    placeholder="服务器 URL"
                    className="form-input"
                  />
                )}
                <div className="form-actions">
                  <button className="btn-cancel" onClick={() => setIsAdding(false)}>取消</button>
                  <button className="btn-save" onClick={handleAddServer}>添加</button>
                </div>
              </div>
            )}

            {/* 服务器列表 */}
            <div className="server-list">
              {servers.map((server) => (
                <div
                  key={server.id}
                  className={`server-item ${selectedServer?.id === server.id ? 'selected' : ''}`}
                  onClick={() => setSelectedServer(server)}
                >
                  <div className="server-status">
                    <span className={`status-dot ${server.status}`} />
                  </div>
                  <div className="server-info">
                    <span className="server-name">{server.name}</span>
                    <span className="server-transport">{server.transport}</span>
                  </div>
                  <div className="server-actions">
                    <button
                      className="toggle-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggle(server)
                      }}
                      title={server.enabled ? '禁用' : '启用'}
                    >
                      {server.enabled ? '✓' : '○'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 服务器详情 */}
          <div className="mcp-content">
            {selectedServer ? (
              <div className="server-detail">
                <div className="detail-header">
                  <h3>{selectedServer.name}</h3>
                  <div className="detail-actions">
                    {selectedServer.status === 'connected' ? (
                      <button className="btn-disconnect" onClick={() => handleDisconnect(selectedServer)}>
                        断开连接
                      </button>
                    ) : (
                      <button className="btn-connect" onClick={() => handleConnect(selectedServer)}>
                        连接
                      </button>
                    )}
                    <button className="btn-delete" onClick={() => handleDelete(selectedServer)}>
                      删除
                    </button>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>配置</h4>
                  <div className="config-item">
                    <span className="config-label">传输方式:</span>
                    <span className="config-value">{selectedServer.transport}</span>
                  </div>
                  {selectedServer.command && (
                    <div className="config-item">
                      <span className="config-label">命令:</span>
                      <code className="config-value">{selectedServer.command} {(selectedServer.args || []).join(' ')}</code>
                    </div>
                  )}
                  {selectedServer.url && (
                    <div className="config-item">
                      <span className="config-label">URL:</span>
                      <code className="config-value">{selectedServer.url}</code>
                    </div>
                  )}
                  {selectedServer.lastConnected && (
                    <div className="config-item">
                      <span className="config-label">上次连接:</span>
                      <span className="config-value">
                        {new Date(selectedServer.lastConnected).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedServer.error && (
                    <div className="config-item error">
                      <span className="config-label">错误:</span>
                      <span className="config-value">{selectedServer.error}</span>
                    </div>
                  )}
                </div>

                {/* 服务器工具 */}
                <div className="detail-section">
                  <h4>工具 ({tools.filter(t => t.serverId === selectedServer.id).length})</h4>
                  <div className="tools-list">
                    {tools
                      .filter(t => t.serverId === selectedServer.id)
                      .map((tool) => (
                        <div key={tool.name} className="tool-item">
                          <span className="tool-name">{tool.name}</span>
                          <span className="tool-desc">{tool.description}</span>
                        </div>
                      ))}
                    {tools.filter(t => t.serverId === selectedServer.id).length === 0 && (
                      <div className="empty-tools">
                        {selectedServer.status === 'connected' 
                          ? '未发现工具' 
                          : '请先连接服务器以获取工具列表'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="empty-detail">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="2" width="20" height="8" rx="2" ry="2"/>
                  <rect x="2" y="14" width="20" height="8" rx="2" ry="2"/>
                  <line x1="6" y1="6" x2="6.01" y2="6"/>
                  <line x1="6" y1="18" x2="6.01" y2="18"/>
                </svg>
                <p>选择服务器查看详情</p>
                <span>MCP 服务器提供工具和资源，扩展 AI 助手的能力</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
