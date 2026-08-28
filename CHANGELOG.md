# 更新日志

所有重要更改都将记录在此文件中。

格式基于[Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且此项目遵循[语义版本控制](https://semver.org/lang/zh-CN/)。

## [1.0.0] - 2024-12-XX

### 新增
- 项目初始版本
- Electron主进程架构
- 预加载脚本和IPC通信
- Cordis运行时管理器
- 窗口管理模块
- 系统托盘支持
- 自动更新功能
- 安全模块和CSP配置
- React前端界面
- TypeScript配置
- ESLint配置
- GitHub Actions工作流
- 项目文档和API文档

### 技术栈
- Electron 30+
- React 18
- TypeScript 5.3+
- Vite 5
- electron-vite
- electron-builder

## [未发布]

### 计划中
- [ ] 完整的LLM集成
- [ ] 工具执行系统
- [ ] 沙箱环境
- [ ] 会话管理系统
- [ ] 文件系统访问
- [ ] 主题系统
- [ ] 快捷键支持
- [ ] 多语言支持
- [ ] 插件系统
- [ ] 性能优化
- [ ] 单元测试
- [ ] 端到端测试

## 版本说明

### 版本号格式
- **主版本号**: 不兼容的API修改
- **次版本号**: 向后兼容的功能性新增
- **修订号**: 向后兼容的问题修正

### 分支说明
- **main**: 稳定发布版本
- **develop**: 开发中的功能
- **feature/***: 新功能分支
- **fix/***: 问题修复分支
- **docs/***: 文档更新分支

## 发布流程

1. 更新版本号
2. 更新CHANGELOG
3. 创建Git标签
4. 推送到GitHub
5. GitHub Actions自动构建和发布
