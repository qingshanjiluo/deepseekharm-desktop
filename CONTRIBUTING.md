# 贡献指南

感谢你对DeepSeek Harness Desktop的兴趣！我们欢迎各种形式的贡献。

## 开始之前

1. Fork这个仓库
2. 克隆你的fork到本地
3. 创建一个新分支用于你的修改

## 开发环境设置

### 前置要求
- Node.js 20+
- pnpm 8+
- Git

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

## 开发规范

### 代码风格
- 使用TypeScript
- 遵循ESLint规则
- 使用有意义的变量和函数名
- 为复杂的逻辑添加注释

### Git提交规范
我们使用[Conventional Commits](https://www.conventionalcommits.org/)规范：

- `feat`: 新功能
- `fix`: Bug修复
- `docs`: 文档更新
- `style`: 代码格式（不影响代码运行的变动）
- `refactor`: 重构（既不修复bug也不增加功能）
- `perf`: 性能优化
- `test`: 增加测试
- `chore`: 构建过程或辅助工具的变动

示例：
```bash
git commit -m "feat: 添加新的工具模块"
git commit -m "fix: 修复会话加载问题"
git commit -m "docs: 更新README文档"
```

### 分支规范
- `main`: 主分支，保持稳定
- `develop`: 开发分支
- `feature/*`: 功能分支
- `fix/*`: 修复分支
- `docs/*`: 文档分支

## 提交Pull Request

1. 确保你的代码遵循项目规范
2. 更新相关文档（如适用）
3. 添加必要的测试（如适用）
4. 确保所有测试通过
5. 提交PR并填写必要的描述

## 问题反馈

- 使用[Issues](https://github.com/qingshanjiluo/deepseekharm-desktop/issues)报告bug
- 使用[Discussions](https://github.com/qingshanjiluo/deepseekharm-desktop/discussions)进行一般性讨论

## 许可证

贡献的代码将遵循MIT许可证。
