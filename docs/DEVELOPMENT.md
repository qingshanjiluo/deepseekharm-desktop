# 开发指南

## 项目架构

```
deepseekharm-desktop/
├── electron/                    # Electron 主进程
│   ├── main.ts                 # 主进程入口，初始化所有模块
│   ├── preload.ts              # 预加载脚本，暴露API给渲染进程
│   ├── backend/                # 后端集成层
│   │   ├── cordis-runtime.ts   # Cordis运行时，管理LLM、工具等
│   │   └── ipc-handler.ts     # IPC处理器，注册所有IPC通道
│   ├── native/                 # 原生功能
│   │   ├── window-manager.ts   # 窗口管理
│   │   ├── tray.ts             # 系统托盘
│   │   └── auto-updater.ts    # 自动更新
│   └── security/               # 安全模块
│       └── index.ts            # 安全配置
├── src/                        # 渲染进程（React应用）
│   ├── main.tsx                # React入口
│   ├── App.tsx                 # 主应用组件
│   ├── App.css                 # 应用样式
│   └── index.css               # 全局样式
├── config/                     # 环境配置
│   ├── development.json        # 开发环境配置
│   └── production.json         # 生产环境配置
├── resources/                  # 应用资源
│   ├── icon.ico                # Windows图标
│   └── tray-icon.png          # 托盘图标
└── scripts/                    # 工具脚本
    └── create-icons.js         # 图标生成脚本
```

## 核心模块

### 1. 主进程 (electron/main.ts)
- 应用生命周期管理
- 初始化所有原生模块
- 管理应用状态

### 2. 预加载脚本 (electron/preload.ts)
- 使用`contextBridge`暴露安全的API
- 定义完整的类型定义
- 提供窗口控制、LLM、工具、会话等API

### 3. 后端运行时 (electron/backend/cordis-runtime.ts)
- 管理LLM服务（DeepSeek API）
- 执行工具调用
- 管理会话状态
- 沙箱环境

### 4. IPC处理器 (electron/backend/ipc-handler.ts)
- 注册所有IPC通道
- 处理渲染进程的请求
- 与后端运行时通信

### 5. 原生模块
- **WindowManager**: 创建和管理应用窗口
- **TrayManager**: 系统托盘图标和菜单
- **AutoUpdater**: 自动更新功能

### 6. 安全模块 (electron/security/index.ts)
- 内容安全策略(CSP)
- 权限管理
- 窗口创建控制

## 开发流程

### 启动开发服务器
```bash
pnpm dev
```
这会同时启动：
- Vite开发服务器 (端口5173)
- Electron主进程

### 构建应用
```bash
pnpm build          # 构建生产版本
pnpm package        # 打包Windows安装程序
```

### 代码检查
```bash
pnpm lint           # ESLint检查
pnpm typecheck      # TypeScript类型检查
```

## 添加新功能

### 添加新的IPC通道
1. 在`preload.ts`中添加类型定义和API方法
2. 在`ipc-handler.ts`中添加处理器
3. 在渲染进程中使用`window.deepSeek.xxx`调用

### 添加新的原生功能
1. 在`native/`目录下创建新模块
2. 在`main.ts`中初始化模块
3. 通过IPC暴露给渲染进程

### 修改LLM配置
编辑`config/development.json`或`config/production.json`:
```json
{
  "llm": {
    "provider": "deepseek",
    "model": "deepseek-chat"
  }
}
```

## 调试技巧

### 主进程调试
- 使用`console.log`输出到终端
- 可以使用`--inspect`参数启动调试器

### 渲染进程调试
- 使用Chrome DevTools (F12)
- 查看控制台输出

### IPC通信调试
- 在`ipc-handler.ts`中添加日志
- 使用`--inspect`参数调试主进程

## 常见问题

### 1. 依赖安装失败
检查网络连接，尝试使用镜像源：
```bash
pnpm install --registry=https://registry.npmmirror.com
```

### 2. 构建失败
确保Node.js版本>=20，尝试清理后重新构建：
```bash
pnpm clean
pnpm build
```

### 3. 窗口不显示
检查`window-manager.ts`中的窗口创建逻辑，确保所有依赖正确初始化。

## 性能优化

1. **懒加载**: 使用React.lazy和Suspense
2. **代码分割**: Vite会自动处理
3. **缓存**: 使用electron-store持久化配置
4. **批量IPC调用**: 减少进程间通信次数

## 测试

### 单元测试
```bash
pnpm test
```

### 端到端测试
```bash
pnpm test:e2e
```

## 部署

### Windows
```bash
pnpm package
```
生成的安装程序在`release/`目录下。

### 其他平台
修改`package.json`中的构建配置，添加对应平台的构建脚本。
