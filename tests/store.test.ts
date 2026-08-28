import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore } from '../src/store'

describe('AppStore', () => {
  beforeEach(() => {
    // 重置 store
    useAppStore.setState({
      sessions: [],
      currentSessionId: null,
      isStreaming: false,
      currentModel: 'deepseek-chat',
    })
  })

  describe('createSession', () => {
    it('should create a new session', () => {
      const session = useAppStore.getState().createSession('测试会话')
      
      expect(session).toBeDefined()
      expect(session.id).toBeTruthy()
      expect(session.name).toBe('测试会话')
      expect(session.messages).toEqual([])
      expect(session.model).toBe('deepseek-chat')
    })

    it('should set current session to newly created', () => {
      const session = useAppStore.getState().createSession()
      const currentId = useAppStore.getState().currentSessionId
      
      expect(currentId).toBe(session.id)
    })

    it('should use default name if not provided', () => {
      const session = useAppStore.getState().createSession()
      
      expect(session.name).toContain('新会话')
    })
  })

  describe('deleteSession', () => {
    it('should delete a session', () => {
      const session = useAppStore.getState().createSession()
      useAppStore.getState().deleteSession(session.id)
      
      const sessions = useAppStore.getState().sessions
      expect(sessions.find(s => s.id === session.id)).toBeUndefined()
    })

    it('should update current session if deleted session was current', () => {
      const session1 = useAppStore.getState().createSession()
      const session2 = useAppStore.getState().createSession()
      
      useAppStore.getState().deleteSession(session2.id)
      
      const currentId = useAppStore.getState().currentSessionId
      expect(currentId).toBe(session1.id)
    })
  })

  describe('addMessage', () => {
    it('should add message to session', () => {
      const session = useAppStore.getState().createSession()
      const message = useAppStore.getState().addMessage(session.id, {
        role: 'user',
        content: 'Hello',
      })
      
      expect(message).toBeDefined()
      expect(message.id).toBeTruthy()
      expect(message.content).toBe('Hello')
      expect(message.timestamp).toBeGreaterThan(0)
    })

    it('should add message to correct session', () => {
      const session1 = useAppStore.getState().createSession()
      const session2 = useAppStore.getState().createSession()
      
      useAppStore.getState().addMessage(session1.id, { role: 'user', content: 'Msg1' })
      useAppStore.getState().addMessage(session2.id, { role: 'user', content: 'Msg2' })
      
      const s1 = useAppStore.getState().sessions.find(s => s.id === session1.id)
      const s2 = useAppStore.getState().sessions.find(s => s.id === session2.id)
      
      expect(s1?.messages).toHaveLength(1)
      expect(s1?.messages[0].content).toBe('Msg1')
      expect(s2?.messages).toHaveLength(1)
      expect(s2?.messages[0].content).toBe('Msg2')
    })
  })

  describe('updateSettings', () => {
    it('should update settings', () => {
      useAppStore.getState().updateSettings({ theme: 'light' })
      
      const theme = useAppStore.getState().settings.theme
      expect(theme).toBe('light')
    })

    it('should merge settings', () => {
      useAppStore.getState().updateSettings({ fontSize: 16, locale: 'en-US' })
      
      const settings = useAppStore.getState().settings
      expect(settings.fontSize).toBe(16)
      expect(settings.locale).toBe('en-US')
    })
  })
})
