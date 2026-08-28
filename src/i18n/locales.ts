export type Locale = 'zh-CN' | 'en-US' | 'ja-JP'

export interface TranslationKeys {
  // 通用
  common: {
    confirm: string
    cancel: string
    save: string
    delete: string
    edit: string
    copy: string
    paste: string
    undo: string
    redo: string
    search: string
    loading: string
    success: string
    error: string
    warning: string
    info: string
    yes: string
    no: string
    ok: string
    close: string
    back: string
    next: string
    finish: string
    apply: string
    reset: string
    clear: string
    export: string
    import: string
    upload: string
    download: string
  }
  // 菜单
  menu: {
    file: string
    edit: string
    view: string
    help: string
    about: string
    settings: string
    exit: string
    newWindow: string
    closeWindow: string
  }
  // 侧边栏
  sidebar: {
    newSession: string
    searchSessions: string
    sessions: string
    noSessions: string
    untitledSession: string
    deleteSession: string
    renameSession: string
    exportSession: string
    clearSession: string
  }
  // 聊天
  chat: {
    inputPlaceholder: string
    send: string
    sendWithEnter: string
    stopGeneration: string
    regenerate: string
    editMessage: string
    copyMessage: string
    deleteMessage: string
    thinking: string
    typing: string
    tokensUsed: string
    messageCount: string
    noMessages: string
    startConversation: string
    dragDropFiles: string
    attachments: string
    removeAttachment: string
    turns: string
    you: string
    suggestionCrawler: string
    suggestionClosure: string
    suggestionOptimize: string
  }
  // 斜杠命令
  slashCommands: {
    title: string
    clearChat: string
    clearChatDesc: string
    exportChat: string
    exportChatDesc: string
    switchModel: string
    switchModelDesc: string
    codeMode: string
    codeModeDesc: string
    explainCode: string
    explainCodeDesc: string
    reviewCode: string
    reviewCodeDesc: string
    generateTests: string
    generateTestsDesc: string
    searchFiles: string
    searchFilesDesc: string
    editFile: string
    editFileDesc: string
    runCommand: string
    runCommandDesc: string
  }
  // 设置
  settings: {
    title: string
    general: string
    appearance: string
    models: string
    shortcuts: string
    language: string
    languageDesc: string
    theme: string
    themeDesc: string
    darkTheme: string
    lightTheme: string
    systemTheme: string
    enterToSend: string
    enterToSendDesc: string
    showTokenCount: string
    showTokenCountDesc: string
    compactMode: string
    compactModeDesc: string
    fontSize: string
    fontFamily: string
    autoSave: string
    autoSaveDesc: string
    sandboxMode: string
    sandboxModeDesc: string
    apiKey: string
    apiKeyDesc: string
    apiEndpoint: string
    apiEndpointDesc: string
    defaultModel: string
    defaultModelDesc: string
    resetSettings: string
    resetSettingsDesc: string
    keyboardShortcuts: string
    newChat: string
    toggleSidebar: string
    toggleDetails: string
    focusInput: string
    sendMessage: string
    stopGeneration: string
    search: string
    commandPalette: string
  }
  // 详情面板
  details: {
    title: string
    sessionInfo: string
    createdAt: string
    updatedAt: string
    messageStats: string
    userMessages: string
    assistantMessages: string
    totalMessages: string
    tokenUsage: string
    promptTokens: string
    completionTokens: string
    totalTokens: string
    quickActions: string
    exportMarkdown: string
    exportJSON: string
    clearHistory: string
    deleteSession: string
  }
  // 模型
  model: {
    selectModel: string
    searchModels: string
    manageModels: string
    contextWindow: string
    maxTokens: string
    recommended: string
    fast: string
    powerful: string
    lightweight: string
    multimodal: string
    reasoning: string
    coding: string
  }
  // 错误消息
  errors: {
    networkError: string
    apiError: string
    unknownError: string
    fileNotFound: string
    permissionDenied: string
    quotaExceeded: string
    invalidApiKey: string
    modelNotAvailable: string
  }
}

const zhCN: TranslationKeys = {
  common: {
    confirm: '确认',
    cancel: '取消',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    copy: '复制',
    paste: '粘贴',
    undo: '撤销',
    redo: '重做',
    search: '搜索',
    loading: '加载中...',
    success: '成功',
    error: '错误',
    warning: '警告',
    info: '信息',
    yes: '是',
    no: '否',
    ok: '确定',
    close: '关闭',
    back: '返回',
    next: '下一步',
    finish: '完成',
    apply: '应用',
    reset: '重置',
    clear: '清空',
    export: '导出',
    import: '导入',
    upload: '上传',
    download: '下载',
  },
  menu: {
    file: '文件',
    edit: '编辑',
    view: '视图',
    help: '帮助',
    about: '关于',
    settings: '设置',
    exit: '退出',
    newWindow: '新建窗口',
    closeWindow: '关闭窗口',
  },
  sidebar: {
    newSession: '新建会话',
    searchSessions: '搜索会话...',
    sessions: '会话列表',
    noSessions: '暂无会话',
    untitledSession: '未命名会话',
    deleteSession: '删除会话',
    renameSession: '重命名会话',
    exportSession: '导出会话',
    clearSession: '清空会话',
  },
  chat: {
    inputPlaceholder: '输入消息... (Enter 发送, Shift+Enter 换行, / 斜杠命令)',
    send: '发送',
    sendWithEnter: 'Enter 发送',
    stopGeneration: '停止生成',
    regenerate: '重新生成',
    editMessage: '编辑消息',
    copyMessage: '复制消息',
    deleteMessage: '删除消息',
    thinking: '思考中...',
    typing: '正在输入...',
    tokensUsed: '已用 Token',
    messageCount: '条消息',
    noMessages: '暂无消息',
    startConversation: '开始新的对话',
    dragDropFiles: '拖放文件到此处',
    attachments: '附件',
    removeAttachment: '移除附件',
    turns: '轮对话',
    you: '你',
    suggestionCrawler: '写一个 Python 爬虫',
    suggestionClosure: '解释 JavaScript 闭包',
    suggestionOptimize: '优化代码性能',
  },
  slashCommands: {
    title: '斜杠命令',
    clearChat: '清空对话',
    clearChatDesc: '清空当前会话的所有消息',
    exportChat: '导出会话',
    exportChatDesc: '将对话导出为 Markdown 文件',
    switchModel: '切换模型',
    switchModelDesc: '切换当前使用的 AI 模型',
    codeMode: '代码模式',
    codeModeDesc: '以代码格式回复',
    explainCode: '解释代码',
    explainCodeDesc: '解释选中的代码片段',
    reviewCode: '代码审查',
    reviewCodeDesc: '审查代码质量和潜在问题',
    generateTests: '生成测试',
    generateTestsDesc: '为代码生成单元测试',
    searchFiles: '搜索文件',
    searchFilesDesc: '在项目中搜索文件',
    editFile: '编辑文件',
    editFileDesc: '编辑指定文件内容',
    runCommand: '运行命令',
    runCommandDesc: '执行终端命令',
  },
  settings: {
    title: '设置',
    general: '通用',
    appearance: '外观',
    models: '模型',
    shortcuts: '快捷键',
    language: '语言',
    languageDesc: '选择界面显示语言',
    theme: '主题',
    themeDesc: '选择界面主题',
    darkTheme: '深色主题',
    lightTheme: '浅色主题',
    systemTheme: '跟随系统',
    enterToSend: 'Enter 发送消息',
    enterToSendDesc: '按 Enter 键直接发送消息',
    showTokenCount: '显示 Token 计数',
    showTokenCountDesc: '在消息中显示 Token 使用量',
    compactMode: '紧凑模式',
    compactModeDesc: '减少界面间距以显示更多内容',
    fontSize: '字体大小',
    fontFamily: '字体系列',
    autoSave: '自动保存',
    autoSaveDesc: '自动保存会话历史',
    sandboxMode: '沙箱模式',
    sandboxModeDesc: '限制文件系统访问以提高安全性',
    apiKey: 'API 密钥',
    apiKeyDesc: '用于身份验证的 API 密钥',
    apiEndpoint: 'API 端点',
    apiEndpointDesc: '自定义 API 请求地址',
    defaultModel: '默认模型',
    defaultModelDesc: '新建会话使用的默认模型',
    resetSettings: '重置设置',
    resetSettingsDesc: '将所有设置恢复为默认值',
    keyboardShortcuts: '键盘快捷键',
    newChat: '新建对话',
    toggleSidebar: '切换侧边栏',
    toggleDetails: '切换详情面板',
    focusInput: '聚焦输入框',
    sendMessage: '发送消息',
    stopGeneration: '停止生成',
    search: '搜索',
    commandPalette: '命令面板',
  },
  details: {
    title: '详情',
    sessionInfo: '会话信息',
    createdAt: '创建时间',
    updatedAt: '更新时间',
    messageStats: '消息统计',
    userMessages: '用户消息',
    assistantMessages: '助手消息',
    totalMessages: '总消息数',
    tokenUsage: 'Token 使用量',
    promptTokens: '提示词 Token',
    completionTokens: '回复 Token',
    totalTokens: '总 Token',
    quickActions: '快捷操作',
    exportMarkdown: '导出为 Markdown',
    exportJSON: '导出为 JSON',
    clearHistory: '清空历史',
    deleteSession: '删除会话',
  },
  model: {
    selectModel: '选择模型',
    searchModels: '搜索模型...',
    manageModels: '管理模型...',
    contextWindow: '上下文窗口',
    maxTokens: '最大 Token',
    recommended: '推荐',
    fast: '快速',
    powerful: '强大',
    lightweight: '轻量',
    multimodal: '多模态',
    reasoning: '推理',
    coding: '代码',
  },
  errors: {
    networkError: '网络连接错误，请检查网络设置',
    apiError: 'API 请求失败，请稍后重试',
    unknownError: '发生未知错误',
    fileNotFound: '文件未找到',
    permissionDenied: '权限不足',
    quotaExceeded: '配额已用完',
    invalidApiKey: 'API 密钥无效',
    modelNotAvailable: '模型不可用',
  },
}

const enUS: TranslationKeys = {
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    copy: 'Copy',
    paste: 'Paste',
    undo: 'Undo',
    redo: 'Redo',
    search: 'Search',
    loading: 'Loading...',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    finish: 'Finish',
    apply: 'Apply',
    reset: 'Reset',
    clear: 'Clear',
    export: 'Export',
    import: 'Import',
    upload: 'Upload',
    download: 'Download',
  },
  menu: {
    file: 'File',
    edit: 'Edit',
    view: 'View',
    help: 'Help',
    about: 'About',
    settings: 'Settings',
    exit: 'Exit',
    newWindow: 'New Window',
    closeWindow: 'Close Window',
  },
  sidebar: {
    newSession: 'New Session',
    searchSessions: 'Search sessions...',
    sessions: 'Sessions',
    noSessions: 'No sessions',
    untitledSession: 'Untitled Session',
    deleteSession: 'Delete session',
    renameSession: 'Rename session',
    exportSession: 'Export session',
    clearSession: 'Clear session',
  },
  chat: {
    inputPlaceholder: 'Type a message... (Enter to send, Shift+Enter for new line, / for commands)',
    send: 'Send',
    sendWithEnter: 'Enter to send',
    stopGeneration: 'Stop generation',
    regenerate: 'Regenerate',
    editMessage: 'Edit message',
    copyMessage: 'Copy message',
    deleteMessage: 'Delete message',
    thinking: 'Thinking...',
    typing: 'Typing...',
    tokensUsed: 'Tokens used',
    messageCount: 'messages',
    noMessages: 'No messages',
    startConversation: 'Start a new conversation',
    dragDropFiles: 'Drag and drop files here',
    attachments: 'Attachments',
    removeAttachment: 'Remove attachment',
    turns: 'turns',
    you: 'You',
    suggestionCrawler: 'Write a Python crawler',
    suggestionClosure: 'Explain JavaScript closures',
    suggestionOptimize: 'Optimize code performance',
  },
  slashCommands: {
    title: 'Slash Commands',
    clearChat: 'Clear Chat',
    clearChatDesc: 'Clear all messages in current session',
    exportChat: 'Export Chat',
    exportChatDesc: 'Export conversation as Markdown file',
    switchModel: 'Switch Model',
    switchModelDesc: 'Switch current AI model',
    codeMode: 'Code Mode',
    codeModeDesc: 'Respond in code format',
    explainCode: 'Explain Code',
    explainCodeDesc: 'Explain selected code snippet',
    reviewCode: 'Review Code',
    reviewCodeDesc: 'Review code quality and potential issues',
    generateTests: 'Generate Tests',
    generateTestsDesc: 'Generate unit tests for code',
    searchFiles: 'Search Files',
    searchFilesDesc: 'Search files in project',
    editFile: 'Edit File',
    editFileDesc: 'Edit specified file content',
    runCommand: 'Run Command',
    runCommandDesc: 'Execute terminal command',
  },
  settings: {
    title: 'Settings',
    general: 'General',
    appearance: 'Appearance',
    models: 'Models',
    shortcuts: 'Shortcuts',
    language: 'Language',
    languageDesc: 'Select interface language',
    theme: 'Theme',
    themeDesc: 'Select interface theme',
    darkTheme: 'Dark Theme',
    lightTheme: 'Light Theme',
    systemTheme: 'System Theme',
    enterToSend: 'Enter to send message',
    enterToSendDesc: 'Press Enter key to send message directly',
    showTokenCount: 'Show token count',
    showTokenCountDesc: 'Display token usage in messages',
    compactMode: 'Compact mode',
    compactModeDesc: 'Reduce spacing to show more content',
    fontSize: 'Font size',
    fontFamily: 'Font family',
    autoSave: 'Auto save',
    autoSaveDesc: 'Automatically save session history',
    sandboxMode: 'Sandbox mode',
    sandboxModeDesc: 'Limit file system access for security',
    apiKey: 'API Key',
    apiKeyDesc: 'API key for authentication',
    apiEndpoint: 'API Endpoint',
    apiEndpointDesc: 'Custom API request URL',
    defaultModel: 'Default model',
    defaultModelDesc: 'Default model for new sessions',
    resetSettings: 'Reset settings',
    resetSettingsDesc: 'Restore all settings to defaults',
    keyboardShortcuts: 'Keyboard Shortcuts',
    newChat: 'New Chat',
    toggleSidebar: 'Toggle sidebar',
    toggleDetails: 'Toggle details panel',
    focusInput: 'Focus input',
    sendMessage: 'Send message',
    stopGeneration: 'Stop generation',
    search: 'Search',
    commandPalette: 'Command palette',
  },
  details: {
    title: 'Details',
    sessionInfo: 'Session Info',
    createdAt: 'Created',
    updatedAt: 'Updated',
    messageStats: 'Message Stats',
    userMessages: 'User messages',
    assistantMessages: 'Assistant messages',
    totalMessages: 'Total messages',
    tokenUsage: 'Token Usage',
    promptTokens: 'Prompt tokens',
    completionTokens: 'Completion tokens',
    totalTokens: 'Total tokens',
    quickActions: 'Quick Actions',
    exportMarkdown: 'Export as Markdown',
    exportJSON: 'Export as JSON',
    clearHistory: 'Clear history',
    deleteSession: 'Delete session',
  },
  model: {
    selectModel: 'Select Model',
    searchModels: 'Search models...',
    manageModels: 'Manage models...',
    contextWindow: 'Context window',
    maxTokens: 'Max tokens',
    recommended: 'Recommended',
    fast: 'Fast',
    powerful: 'Powerful',
    lightweight: 'Lightweight',
    multimodal: 'Multimodal',
    reasoning: 'Reasoning',
    coding: 'Coding',
  },
  errors: {
    networkError: 'Network connection error, please check your network settings',
    apiError: 'API request failed, please try again later',
    unknownError: 'An unknown error occurred',
    fileNotFound: 'File not found',
    permissionDenied: 'Permission denied',
    quotaExceeded: 'Quota exceeded',
    invalidApiKey: 'Invalid API key',
    modelNotAvailable: 'Model not available',
  },
}

const jaJP: TranslationKeys = {
  common: {
    confirm: '確認',
    cancel: 'キャンセル',
    save: '保存',
    delete: '削除',
    edit: '編集',
    copy: 'コピー',
    paste: '貼り付け',
    undo: '取り消し',
    redo: 'やり直し',
    search: '検索',
    loading: '読み込み中...',
    success: '成功',
    error: 'エラー',
    warning: '警告',
    info: '情報',
    yes: 'はい',
    no: 'いいえ',
    ok: 'OK',
    close: '閉じる',
    back: '戻る',
    next: '次へ',
    finish: '完了',
    apply: '適用',
    reset: 'リセット',
    clear: 'クリア',
    export: 'エクスポート',
    import: 'インポート',
    upload: 'アップロード',
    download: 'ダウンロード',
  },
  menu: {
    file: 'ファイル',
    edit: '編集',
    view: '表示',
    help: 'ヘルプ',
    about: 'バージョン情報',
    settings: '設定',
    exit: '終了',
    newWindow: '新しいウィンドウ',
    closeWindow: 'ウィンドウを閉じる',
  },
  sidebar: {
    newSession: '新しいセッション',
    searchSessions: 'セッションを検索...',
    sessions: 'セッション',
    noSessions: 'セッションなし',
    untitledSession: '無題のセッション',
    deleteSession: 'セッションを削除',
    renameSession: 'セッション名を変更',
    exportSession: 'セッションをエクスポート',
    clearSession: 'セッションをクリア',
  },
  chat: {
    inputPlaceholder: 'メッセージを入力... (Enterで送信、Shift+Enterで改行、/でコマンド)',
    send: '送信',
    sendWithEnter: 'Enterで送信',
    stopGeneration: '生成を停止',
    regenerate: '再生成',
    editMessage: 'メッセージを編集',
    copyMessage: 'メッセージをコピー',
    deleteMessage: 'メッセージを削除',
    thinking: '思考中...',
    typing: '入力中...',
    tokensUsed: '使用トークン',
    messageCount: '件のメッセージ',
    noMessages: 'メッセージなし',
    startConversation: '新しい会話を開始',
    dragDropFiles: 'ファイルをここにドラッグ＆ドロップ',
    attachments: '添付ファイル',
    removeAttachment: '添付ファイルを削除',
    turns: 'ターン',
    you: 'あなた',
    suggestionCrawler: 'Pythonクローラーを作成',
    suggestionClosure: 'JavaScriptのクロージャを説明',
    suggestionOptimize: 'コードのパフォーマンスを最適化',
  },
  slashCommands: {
    title: 'スラッシュコマンド',
    clearChat: 'チャットをクリア',
    clearChatDesc: '現在のセッションの全メッセージをクリア',
    exportChat: 'チャットをエクスポート',
    exportChatDesc: '会話をMarkdownファイルとしてエクスポート',
    switchModel: 'モデルを切替',
    switchModelDesc: '現在のAIモデルを切り替え',
    codeMode: 'コードモード',
    codeModeDesc: 'コード形式で応答',
    explainCode: 'コードを説明',
    explainCodeDesc: '選択したコードスニペットを説明',
    reviewCode: 'コードレビュー',
    reviewCodeDesc: 'コードの品質と潜在的な問題をレビュー',
    generateTests: 'テストを生成',
    generateTestsDesc: 'コードのユニットテストを生成',
    searchFiles: 'ファイルを検索',
    searchFilesDesc: 'プロジェクト内のファイルを検索',
    editFile: 'ファイルを編集',
    editFileDesc: '指定したファイルの内容を編集',
    runCommand: 'コマンドを実行',
    runCommandDesc: 'ターミナルコマンドを実行',
  },
  settings: {
    title: '設定',
    general: '一般',
    appearance: '外観',
    models: 'モデル',
    shortcuts: 'ショートカット',
    language: '言語',
    languageDesc: 'インターフェースの言語を選択',
    theme: 'テーマ',
    themeDesc: 'インターフェースのテーマを選択',
    darkTheme: 'ダークテーマ',
    lightTheme: 'ライトテーマ',
    systemTheme: 'システムに合わせる',
    enterToSend: 'Enterでメッセージを送信',
    enterToSendDesc: 'Enterキーで直接メッセージを送信',
    showTokenCount: 'トークン数を表示',
    showTokenCountDesc: 'メッセージにトークン使用量を表示',
    compactMode: 'コンパクトモード',
    compactModeDesc: '余白を減らしてより多くのコンテンツを表示',
    fontSize: 'フォントサイズ',
    fontFamily: 'フォントファミリー',
    autoSave: '自動保存',
    autoSaveDesc: 'セッション履歴を自動保存',
    sandboxMode: 'サンドボックスモード',
    sandboxModeDesc: 'セキュリティ向上のためファイルシステムアクセスを制限',
    apiKey: 'APIキー',
    apiKeyDesc: '認証用のAPIキー',
    apiEndpoint: 'APIエンドポイント',
    apiEndpointDesc: 'カスタムAPIリクエストURL',
    defaultModel: 'デフォルトモデル',
    defaultModelDesc: '新しいセッションのデフォルトモデル',
    resetSettings: '設定をリセット',
    resetSettingsDesc: 'すべての設定をデフォルトに戻す',
    keyboardShortcuts: 'キーボードショートカット',
    newChat: '新しいチャット',
    toggleDetails: '詳細パネルを切替',
    focusInput: '入力にフォーカス',
    sendMessage: 'メッセージを送信',
    stopGeneration: '生成を停止',
    search: '検索',
    commandPalette: 'コマンドパレット',
  },
  details: {
    title: '詳細',
    sessionInfo: 'セッション情報',
    createdAt: '作成日時',
    updatedAt: '更新日時',
    messageStats: 'メッセージ統計',
    userMessages: 'ユーザーメッセージ',
    assistantMessages: 'アシスタントメッセージ',
    totalMessages: '合計メッセージ',
    tokenUsage: 'トークン使用量',
    promptTokens: 'プロンプトトークン',
    completionTokens: '完了トークン',
    totalTokens: '合計トークン',
    quickActions: 'クイックアクション',
    exportMarkdown: 'Markdownとしてエクスポート',
    exportJSON: 'JSONとしてエクスポート',
    clearHistory: '履歴をクリア',
    deleteSession: 'セッションを削除',
  },
  model: {
    selectModel: 'モデルを選択',
    searchModels: 'モデルを検索...',
    manageModels: 'モデルを管理...',
    contextWindow: 'コンテキストウィンドウ',
    maxTokens: '最大トークン',
    recommended: '推奨',
    fast: '高速',
    powerful: '高性能',
    lightweight: '軽量',
    multimodal: 'マルチモーダル',
    reasoning: '推論',
    coding: 'コーディング',
  },
  errors: {
    networkError: 'ネットワーク接続エラー。ネットワーク設定を確認してください',
    apiError: 'APIリクエストに失敗しました。後でもう一度お試しください',
    unknownError: '不明なエラーが発生しました',
    fileNotFound: 'ファイルが見つかりません',
    permissionDenied: '権限がありません',
    quotaExceeded: 'クォータが上限に達しました',
    invalidApiKey: 'APIキーが無効です',
    modelNotAvailable: 'モデルが利用できません',
  },
}

export const translations: Record<Locale, TranslationKeys> = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ja-JP': jaJP,
}

export const localeNames: Record<Locale, string> = {
  'zh-CN': '简体中文',
  'en-US': 'English',
  'ja-JP': '日本語',
}

export function getTranslation(locale: Locale): TranslationKeys {
  return translations[locale] || translations['zh-CN']
}
