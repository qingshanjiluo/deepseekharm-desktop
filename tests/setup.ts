import '@testing-library/jest-dom'

// Mock window.deepSeek
Object.defineProperty(window, 'deepSeek', {
  value: {
    window: {
      minimize: vi.fn(),
      maximize: vi.fn(),
      close: vi.fn(),
      isMaximized: vi.fn().mockResolvedValue(false),
    },
    llm: {
      stream: vi.fn(),
      listModels: vi.fn().mockResolvedValue([]),
      setProvider: vi.fn(),
      getConfig: vi.fn().mockResolvedValue({}),
      updateConfig: vi.fn(),
    },
    fs: {
      readFile: vi.fn(),
      writeFile: vi.fn(),
      readDir: vi.fn().mockResolvedValue([]),
      mkdir: vi.fn(),
      unlink: vi.fn(),
      pickDirectory: vi.fn(),
      pickFile: vi.fn(),
      exists: vi.fn().mockResolvedValue(false),
      stat: vi.fn(),
    },
    dialog: {
      save: vi.fn().mockResolvedValue({ canceled: true }),
      open: vi.fn().mockResolvedValue({ canceled: true, filePaths: [] }),
    },
    system: {
      getPlatform: vi.fn().mockResolvedValue('win32'),
      getVersion: vi.fn().mockResolvedValue('1.0.0'),
      getHomeDir: vi.fn().mockResolvedValue('/home/test'),
      getTempDir: vi.fn().mockResolvedValue('/tmp'),
    },
    on: {
      updateAvailable: vi.fn().mockReturnValue(() => {}),
      updateDownloaded: vi.fn().mockReturnValue(() => {}),
      updateProgress: vi.fn().mockReturnValue(() => {}),
      notification: vi.fn().mockReturnValue(() => {}),
    },
  },
  writable: true,
})

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()
Object.defineProperty(window, 'localStorage', { value: localStorageMock })
