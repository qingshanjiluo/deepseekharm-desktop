# DeepSeek Harness Desktop

DeepSeek Harness 的桌面应用程序版本，基于 Electron 构建。

## 功能特性

- 🖥️ **完整的桌面应用体验** - 原生窗口控制和系统托盘
- 💬 **AI 对话** - 支持 DeepSeek 全系列模型
- 🔧 **工具执行** - Bash 命令、文件操作、网页访问等
- 🛡️ **安全沙箱** - 进程隔离和权限管理
- 🔄 **自动更新** - 支持静默更新和增量更新
- 📁 **文件管理** - 原生文件对话框和文件系统访问

## 技术栈

- **框架**: Electron 30+
- **前端**: React 18 + TypeScript
- **构建**: electron-vite + electron-builder
- **状态管理**: Zustand
- **样式**: CSS Modules

## 开发环境要求

- Node.js 20+
- pnpm 8+
- Windows 10/11 (x64)

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

```bash
pnpm dev
```

### 构建应用

```bash
pnpm build
```

### 打包 Windows 安装程序

```bash
pnpm package
```

## 项目结构

```
deepseekharm-desktop/
├── electron/                    # Electron 主进程
│   ├── main.ts                 # 主进程入口
│   ├── preload.ts              # 预加载脚本
│   ├── backend/                # 后端集成层
│   │   ├── cordis-runtime.ts   # Cordis 运行时管理
│   │   └── ipc-handler.ts     # IPC 处理器
│   ├── native/                 # 原生功能
│   │   ├── window-manager.ts   # 窗口管理
│   │   ├── tray.ts             # 系统托盘
│   │   └── auto-updater.ts    # 自动更新
│   └── security/               # 安全模块
│       └── index.ts            # 安全配置
├── src/                        # 渲染进程（React 应用）
│   ├── main.tsx                # React 入口
│   ├── App.tsx                 # 主应用组件
│   ├── App.css                 # 应用样式
│   └── index.css               # 全局样式
├── resources/                  # 应用资源
│   ├── icon.ico                # Windows 图标
│   └── tray-icon.png          # 托盘图标
├── electron.vite.config.ts     # Vite 配置
├── package.json                # 依赖配置
└── tsconfig.json               # TypeScript 配置
```

## IPC 通信

应用使用 Electron 的 IPC 机制进行主进程和渲染进程之间的通信：

### 暴露的 API

```typescript
window.deepSeek = {
  // 窗口控制
  window: {
    minimize(),
    maximize(),
    close(),
    isMaximized()
  },
  
  // LLM 相关
  llm: {
    stream(options),      // 流式响应
    listModels(),         // 获取模型列表
    setProvider(provider),// 设置提供商
    getConfig(),          // 获取配置
    updateConfig(config)  // 更新配置
  },
  
  // 工具相关
  tools: {
    execute(name, args),  // 执行工具
    list()                // 获取工具列表
  },
  
  // 会话管理
  sessions: {
    create(name?),        // 创建会话
    load(id),             // 加载会话
    save(session),        // 保存会话
    delete(id),           // 删除会话
    list()                // 获取会话列表
  },
  
  // 文件系统
  fs: {
    readFile(path),       // 读取文件
    writeFile(path, content), // 写入文件
    readDir(path),        // 读取目录
    pickDirectory(),      // 选择目录
    pickFile(options),    // 选择文件
    exists(path),         // 检查文件是否存在
    stat(path)            // 获取文件信息
  },
  
  // 系统信息
  system: {
    getPlatform(),        // 获取平台
    getVersion(),         // 获取版本
    getHomeDir(),         // 获取用户目录
    getTempDir()          // 获取临时目录
  },
  
  // 事件监听
  on: {
    updateAvailable(callback),   // 更新可用
    updateDownloaded(callback),  // 更新已下载
    updateProgress(callback),    // 更新进度
    notification(callback)       // 通知
  }
}
```

## 安全特性

- **内容安全策略 (CSP)** - 限制可执行的脚本和样式
- **沙箱模式** - 隔离渲染进程
- **上下文隔离** - 防止原型链污染
- **权限管理** - 控制访问权限

## 构建产物

构建完成后会在 `release` 目录生成以下文件：

- `DeepSeek Harness Setup x.x.x.exe` - NSIS 安装程序
- `DeepSeek Harness x.x.x.exe` - 便携版
- `win-unpacked/` - 解压版

## 开发说明

### 添加新的 IPC 通道

1. 在 `electron/preload.ts` 中添加类型定义和 API 方法
2. 在 `electron/backend/ipc-handler.ts` 中添加处理器
3. 在渲染进程中使用 `window.deepSeek.xxx` 调用

### 添加新的原生功能

1. 在 `electron/native/` 中创建新模块
2. 在 `electron/main.ts` 中初始化模块
3. 通过 IPC 暴露给渲染进程

## 许可证

MIT License
