# DeepSeek Harness Desktop — 全面对齐开发推进书

> 文档版本：v1.0 | 编写日期：2026-08-28
> 目标：将桌面端功能与 UI 完全对齐网页端

---

## 第一章 项目现状分析

### 1.1 已完成的功能基线

截至当前版本（v1.0.0），桌面端已实现以下核心功能：

**已完成的基础设施：**
- Electron 30+ 主进程架构，支持 Windows x64
- electron-vite 构建系统，支持热重载开发
- IPC 通信层（contextBridge 暴露 `window.deepSeek` API）
- Zustand 状态管理 + persist 中间件
- i18n 国际化框架（zh-CN / en-US / ja-JP）
- 主题系统（dark / light / system 三模式）
- Vitest 单元测试框架
- ErrorBoundary 全局错误捕获
- Toast 通知系统

**已完成的 UI 组件：**
- 三面板布局（Sidebar + ChatView + DetailsPanel）
- 可拖拽调整面板宽度
- 自定义标题栏（Windows 平台）
- 侧边栏会话列表（按日期分组）
- 聊天视图（消息列表 + 输入区 + Turn 导航条）
- Markdown 渲染（react-markdown + remark-gfm + rehype-highlight + rehype-katex）
- 消息操作按钮（复制、编辑、点赞/点踩、重新生成、分享）
- 斜杠命令菜单（/clear, /export, /model 等 10 个命令）
- 设置模态框（通用、外观、模型、快捷键、数据管理 5 个标签页）
- 知识库面板（文档上传、文本搜索、上下文注入）
- MCP 服务器管理面板（添加/删除/连接/断开/工具发现）
- 轨迹视图模态框（消息、工具、Token、JSON 四个标签页）
- 附件按钮（文件选择、拖放、类型检测）
- 系统托盘（绿色圆形占位图标）
- 自动更新器框架
- 真实 LLM 流式响应（DeepSeek / OpenAI / Anthropic）
- 流式取消（AbortController）
- 会话导出（Markdown / JSON）
- 数据管理（导出/导入 JSON）

**桌面端独有功能（网页端没有）：**
- Electron 原生文件系统 API
- 原生文件对话框（打开/保存）
- 系统托盘集成
- 自动静默更新
- 知识库本地文档管理
- MCP 服务器完整管理 UI
- 全局键盘快捷键系统
- ErrorBoundary 防崩溃
- 自定义标题栏 + 窗口控制
- 沙箱模式设置
- 侧边栏/详情面板精确像素宽度控制

### 1.2 网页端功能差距总览

网页端基于 Cordis 插件系统构建，拥有约 93 个桌面端尚未实现的功能。这些功能分布在以下核心领域：

**核心对话系统（17 个缺失功能）：**
网页端采用 Slot 节点式消息渲染，每种消息类型有独立的视图组件（AssistantNodeView、CommandNodeView、CompactionItem 等）。桌面端目前使用单一的 MessageItem 组件渲染所有消息，缺少细粒度的消息类型识别和展示。

**工具系统（11 个缺失功能）：**
网页端为每种工具类型提供了专门的视图组件（BashSample、FileMutationRow、SearchRow、WebRow 等），并且有完整的工具审批工作流（ApprovalCommand）。桌面端虽然有 ToolCallTree.tsx 组件，但未接入实际的消息渲染流程。

**输入系统（6 个缺失功能）：**
网页端使用 ContentEditable 富文本输入，支持装饰器芯片（文件引用、参考链接等）。桌面端使用纯 textarea，功能相对简单。

**附件系统（5 个缺失功能）：**
网页端有完整的附件轨道（AttachmentRail）、拖放覆盖层（DropOverlay）、图片灯箱（ImageLightbox）。桌面端只有基本的 AttachmentButton。

**设置系统（22 个缺失功能）：**
网页端的设置系统非常丰富，包括自定义 Provider 配置、模型列表编辑器、插件配置、Bash 设置、Web 搜索设置等。桌面端的设置相对简单。

**其他系统：**
包括工作区浏览器、子代理可视化、TodoPanel、QueueDock、工作流运行面板、计划模式、权限系统、轨迹时间线等。

---

## 第二章 阶段 A — 核心体验对齐（优先级最高）

### 2.1 任务 A1：接入 ToolCallTree + 添加工具视图

**目标：** 将已存在的 ToolCallTree.tsx 组件接入 MessageItem 的消息渲染流程，并为常见工具类型添加专用视图。

**当前状态分析：**
- `ToolCallTree.tsx` 已存在于 `src/components/chat/` 目录
- `MessageItem.tsx` 第 150-164 行有简单的 toolCalls 内联渲染
- 需要替换为 ToolCallTree 组件

**技术方案：**

1. 修改 `MessageItem.tsx`，将 toolCalls 渲染从内联代码替换为 `<ToolCallTree calls={message.toolCalls} />`

2. 为 ToolCallTree 添加工具类型识别逻辑：
   - 解析 `tool.name` 字段，识别工具类型（bash、file_edit、file_read、search、web_search 等）
   - 根据类型选择对应的视图组件

3. 创建以下工具视图组件：
   - `BashView.tsx`：终端命令展示，语法高亮，可折叠输出
   - `FileEditView.tsx`：文件编辑展示，类似 git diff 的行级变更
   - `FileReadView.tsx`：文件读取结果展示，带行号
   - `SearchView.tsx`：搜索结果展示，带文件路径和行号
   - `WebView.tsx`：网页搜索结果展示，带标题和摘要

4. 每个工具视图需要：
   - 状态指示器（进行中/完成/失败）
   - 可折叠/展开的内容区
   - 复制按钮
   - 错误状态展示

**文件变更清单：**
- 修改：`src/components/chat/MessageItem.tsx`
- 修改：`src/components/chat/ToolCallTree.tsx`（增强）
- 新建：`src/components/chat/tools/BashView.tsx`
- 新建：`src/components/chat/tools/FileEditView.tsx`
- 新建：`src/components/chat/tools/FileReadView.tsx`
- 新建：`src/components/chat/tools/SearchView.tsx`
- 新建：`src/components/chat/tools/WebView.tsx`
- 新建：`src/components/chat/tools/ToolView.css`
- 新建：`src/components/chat/tools/index.ts`

**验收标准：**
- ToolCallTree 正确显示在 MessageItem 中
- 每种工具类型有对应的专用视图
- 工具状态（loading/complete/error）正确显示
- 输出内容可折叠/展开
- 复制功能正常工作

**预估工时：** 4-6 小时

---

### 2.2 任务 A2：添加 ContextMeter 上下文计量条

**目标：** 在聊天视图中添加可视化上下文窗口使用量计量条，帮助用户了解当前对话占用的上下文比例。

**当前状态分析：**
- 网页端有 `ui-conversation/ContextMeter.tsx` 组件
- 桌面端 Turn Navigator 条显示 Turn 统计，但没有上下文使用量可视化
- 消息的 `usage` 字段包含 `inputTokens` 和 `outputTokens`

**技术方案：**

1. 创建 `ContextMeter.tsx` 组件：
   - 水平进度条，显示当前上下文使用量
   - 颜色编码：绿色（<60%）、黄色（60-80%）、红色（>80%）
   - 显示数字：`{used} / {max} tokens`
   - 可选的详细信息展开（输入/输出/系统提示词各占多少）

2. 集成位置：
   - 方案一：ChatView 头部，Turn Navigator 条旁边
   - 方案二：输入区域上方
   - 推荐方案一，与 Turn Navigator 并排显示

3. 数据计算：
   - 累计当前会话所有消息的 `inputTokens`
   - 加上系统提示词估算值（约 500 tokens）
   - 除以模型最大上下文窗口（从 LLM 配置获取）

4. CSS 样式：
   - 使用 CSS 变量 `--color-success`、`--color-warning`、`--color-error`
   - 动画过渡效果
   - 紧凑模式和详细模式两种显示

**文件变更清单：**
- 新建：`src/components/chat/ContextMeter.tsx`
- 新建：`src/components/chat/ContextMeter.css`
- 修改：`src/components/chat/ChatView.tsx`（集成 ContextMeter）

**验收标准：**
- ContextMeter 正确显示在聊天视图中
- 颜色随使用量变化
- 数字准确反映实际 token 使用量
- 点击可展开/折叠详细信息

**预估工时：** 2-3 小时

---

### 2.3 任务 A3：添加 Compaction 压缩提示 + SystemPromptRow

**目标：** 实现上下文压缩指示器和系统提示词展示，帮助用户理解对话上下文管理状态。

**当前状态分析：**
- 网页端有 `CompactionItem.tsx` 和 `CompactionCommandCard.tsx` 展示压缩操作
- 网页端有 `SystemPromptRow.tsx` 展示系统提示词
- 桌面端完全没有这两个功能

**技术方案：**

**Compaction 压缩提示：**

1. 定义压缩事件数据结构：
```typescript
interface CompactionEvent {
  id: string
  timestamp: number
  beforeTokens: number
  afterTokens: number
  removedMessages: number
  summary?: string
}
```

2. 创建 `CompactionItem.tsx`：
   - 折叠式卡片，显示压缩操作摘要
   - 标题：「上下文已压缩」
   - 内容：压缩前后 token 数对比、移除的消息数
   - 可选：压缩摘要预览

3. 在消息流中插入压缩标记：
   - 检测消息序列中的压缩事件
   - 在压缩点插入 CompactionItem

**SystemPromptRow：**

1. 创建 `SystemPromptRow.tsx`：
   - 可折叠的行，显示系统提示词内容
   - 默认折叠，显示「系统提示词（{length} 字符）」
   - 展开后显示完整文本，带语法高亮

2. 数据来源：
   - 从 LLM 配置中获取系统提示词
   - 或从消息流中识别系统角色消息

**文件变更清单：**
- 新建：`src/components/chat/CompactionItem.tsx`
- 新建：`src/components/chat/CompactionItem.css`
- 新建：`src/components/chat/SystemPromptRow.tsx`
- 新建：`src/components/chat/SystemPromptRow.css`
- 修改：`src/components/chat/ChatView.tsx`（集成）

**验收标准：**
- CompactionItem 在压缩点正确显示
- SystemPromptRow 可折叠/展开系统提示词
- 两种组件样式与现有 UI 一致

**预估工时：** 3-4 小时

---

### 2.4 任务 A4：实现拖放文件覆盖层 DropOverlay

**目标：** 实现文件拖放到聊天区域时的视觉覆盖层，提供更好的拖放体验。

**当前状态分析：**
- 网页端有 `ui-attachment/DropOverlay.tsx`
- 桌面端 `AttachmentButton.tsx` 有基本的文件选择功能
- ChatView 有 `handleDrop` 和 `handleDragOver` 事件处理
- 缺少拖放时的视觉反馈

**技术方案：**

1. 创建 `DropOverlay.tsx`：
   - 全屏半透明覆盖层
   - 居中的拖放图标和提示文字
   - 动画效果（淡入/淡出）
   - 文件类型图标（根据拖入的文件类型显示不同图标）

2. 状态管理：
   - 使用 `useState` 跟踪 `isDragging` 状态
   - 在 `handleDragEnter` 时显示覆盖层
   - 在 `handleDragLeave` 时隐藏覆盖层
   - 在 `handleDrop` 时处理文件并隐藏覆盖层

3. CSS 样式：
   - 半透明背景（rgba 黑色 0.5）
   - 居中 flex 布局
   - 虚线边框
   - 文件图标动画

4. 文件处理：
   - 支持多文件拖放
   - 文件类型检测（代码、图片、文档）
   - 大小限制提示

**文件变更清单：**
- 新建：`src/components/chat/DropOverlay.tsx`
- 新建：`src/components/chat/DropOverlay.css`
- 修改：`src/components/chat/ChatView.tsx`（集成 DropOverlay）

**验收标准：**
- 拖放文件时覆盖层正确显示
- 覆盖层有清晰的视觉提示
- 释放文件后覆盖层消失
- 文件正确添加到附件列表

**预估工时：** 2-3 小时

---

## 第三章 阶段 B — 交互增强

### 3.1 任务 B1：富文本输入（ContentEditable + 参考芯片）

**目标：** 将 textarea 替换为 ContentEditable 富文本输入，支持文件引用芯片、@提及等装饰器功能。

**当前状态分析：**
- 网页端使用 `ComposerContentEditable.tsx` + `chip-node.tsx` + `ReferenceChip.tsx`
- 桌面端使用纯 `<textarea>`，功能简单
- 这是最大的 UI 差距之一

**技术方案：**

1. 技术选型：
   - 方案 A：使用 Slate.js（功能强大，学习曲线陡）
   - 方案 B：使用 TipTap（基于 ProseMirror，易于扩展）
   - 方案 C：使用 Draft.js（Facebook 出品，维护较少）
   - 推荐方案 B：TipTap，因为它对装饰器（Extension）支持好，且文档完善

2. 基础编辑器搭建：
   - 安装 `@tiptap/react`、`@tiptap/starter-kit`
   - 创建 `RichInput.tsx` 封装 TipTap 编辑器
   - 配置基础扩展：paragraph、text、hardBreak、history

3. 装饰器芯片系统：
   - 创建 `FileReferenceChip.tsx`：文件引用芯片
   - 创建 `ModelChip.tsx`：模型选择芯片
   - 使用 TipTap 的 `NodeViewRenderer` 渲染芯片

4. @提及功能：
   - 创建 `MentionExtension.tsx`：检测 @ 符号触发
   - 弹出菜单显示可用选项（模型、工具、文件等）
   - 选择后插入对应的芯片节点

5. 快捷键支持：
   - Enter 发送消息（可配置）
   - Shift+Enter 换行
   - / 触发斜杠命令
   - @ 触发提及菜单

6. 样式对齐：
   - 使用现有的 CSS 变量
   - 保持与现有 textarea 相同的高度/宽度
   - 自动调整高度

**文件变更清单：**
- 安装依赖：`@tiptap/react`、`@tiptap/starter-kit`、`@tiptap/extension-mention`
- 新建：`src/components/chat/RichInput.tsx`
- 新建：`src/components/chat/RichInput.css`
- 新建：`src/components/chat/chips/FileReferenceChip.tsx`
- 新建：`src/components/chat/chips/ModelChip.tsx`
- 新建：`src/components/chat/chips/index.ts`
- 新建：`src/components/chat/extensions/MentionExtension.ts`
- 修改：`src/components/chat/ChatView.tsx`（替换 textarea）

**验收标准：**
- RichInput 正确渲染，支持富文本
- 文件引用芯片可插入和显示
- @提及菜单正常弹出和选择
- 快捷键全部正常工作
- 输入高度自动调整
- 样式与现有 UI 一致

**预估工时：** 8-12 小时（含学习 TipTap）

---

### 3.2 任务 B2：工具审批工作流 ApprovalCommand

**目标：** 实现工具执行前的用户审批 UI，支持批准、拒绝、始终批准等操作。

**当前状态分析：**
- 网页端有 `ui-chat/ApprovalCommand.tsx`
- 桌面端完全没有审批流程
- 这是安全性相关的重要功能

**技术方案：**

1. 定义审批数据结构：
```typescript
interface ApprovalRequest {
  id: string
  toolName: string
  toolInput: Record<string, unknown>
  timestamp: number
  status: 'pending' | 'approved' | 'denied' | 'always'
}
```

2. 创建 `ApprovalCommand.tsx`：
   - 卡片式布局，显示工具名称和输入参数
   - 操作按钮：批准、拒绝、始终批准（对同类工具）
   - 倒计时（可选，安全考虑）
   - 参数高亮显示（危险参数标红）

3. 审批流程：
   - 工具调用前触发审批请求
   - 渲染 ApprovalCommand 组件
   - 等待用户操作
   - 根据操作结果继续或中止

4. 危险操作检测：
   - 文件删除操作
   - 系统命令执行
   - 网络请求
   - 根据危险程度显示不同级别的警告

**文件变更清单：**
- 新建：`src/components/chat/ApprovalCommand.tsx`
- 新建：`src/components/chat/ApprovalCommand.css`
- 修改：`src/components/chat/MessageItem.tsx`（集成审批）

**验收标准：**
- 工具审批请求正确显示
- 批准/拒绝操作正常工作
- 始终批准选项生效
- 危险操作正确标红

**预估工时：** 4-6 小时

---

### 3.3 任务 B3：权限选择器 PermissionSelect

**目标：** 实现内联的权限授予/拒绝 UI，用于文件访问、网络请求等权限控制。

**当前状态分析：**
- 网页端有 `ui-conversation/PermissionSelect.tsx`
- 桌面端没有权限系统 UI
- 与 ApprovalCommand 类似但更轻量

**技术方案：**

1. 创建 `PermissionSelect.tsx`：
   - 行内显示，不阻断对话流
   - 权限类型：文件读取、文件写入、网络请求、命令执行
   - 操作：允许、拒绝、始终允许（本次会话）

2. 样式：
   - 紧凑的行内布局
   - 图标 + 文字 + 操作按钮
   - 与消息内容对齐

**文件变更清单：**
- 新建：`src/components/chat/PermissionSelect.tsx`
- 新建：`src/components/chat/PermissionSelect.css`

**验收标准：**
- 权限请求正确显示在消息流中
- 操作按钮正常工作
- 样式与消息内容协调

**预估工时：** 3-4 小时

---

### 3.4 任务 B4：工具详情面板 ToolDetails

**目标：** 实现工具执行的详细视图面板，显示完整的输入输出、执行时间、错误信息等。

**当前状态分析：**
- 网页端有 `ui-tool/ToolDetails.tsx`
- 桌面端只有简单的工具调用展示
- 需要更详细的工具执行信息

**技术方案：**

1. 创建 `ToolDetails.tsx`：
   - 可展开/折叠的详情面板
   - 标签页：输入、输出、元数据
   - 语法高亮的 JSON/代码显示
   - 复制按钮
   - 执行时间显示

2. 集成方式：
   - 在 ToolCallTree 的每个工具调用中添加「查看详情」按钮
   - 点击后展开或弹出 ToolDetails

**文件变更清单：**
- 新建：`src/components/chat/ToolDetails.tsx`
- 新建：`src/components/chat/ToolDetails.css`
- 修改：`src/components/chat/ToolCallTree.tsx`（集成）

**验收标准：**
- ToolDetails 正确显示工具详情
- 输入输出格式化显示
- 复制功能正常

**预估工时：** 3-4 小时

---

## 第四章 阶段 C — 高级功能

### 4.1 任务 C1：计划模式 PlanModeControl

**目标：** 实现计划模式切换，允许用户在执行前查看和批准执行计划。

**技术方案：**

1. 创建 `PlanModeControl.tsx`：
   - 开关按钮，切换计划模式
   - 计划模式下，工具调用显示为计划项而非直接执行
   - 用户可逐项批准或修改计划

2. 状态管理：
   - 在 Settings 或会话级别添加 `planMode` 标志
   - LLM 请求时传递 `planMode` 参数
   - 工具调用前检查计划模式

**文件变更清单：**
- 新建：`src/components/chat/PlanModeControl.tsx`
- 新建：`src/components/chat/PlanModeControl.css`
- 修改：`src/store/index.ts`（添加 planMode 状态）

**预估工时：** 4-6 小时

---

### 4.2 任务 C2：子代理可视化 SubagentHeaderLineage

**目标：** 显示子代理的父子关系和执行状态。

**技术方案：**

1. 创建 `SubagentHeader.tsx`：
   - 显示父代理 → 子代理的关系链
   - 每个节点显示状态（运行中/完成/失败）
   - 可点击切换到对应代理的视图

2. 数据结构：
```typescript
interface SubagentInfo {
  id: string
  parentId?: string
  name: string
  status: 'running' | 'completed' | 'failed'
  model: string
}
```

**文件变更清单：**
- 新建：`src/components/chat/SubagentHeader.tsx`
- 新建：`src/components/chat/SubagentHeader.css`

**预估工时：** 3-4 小时

---

### 4.3 任务 C3：TodoPanel 任务列表面板

**目标：** 在对话中显示和管理任务列表。

**技术方案：**

1. 创建 `TodoPanel.tsx`：
   - 从对话中提取任务列表
   - 支持勾选完成
   - 支持手动添加任务
   - 进度统计

2. 集成位置：
   - DetailsPanel 中的新标签页
   - 或独立的浮动面板

**文件变更清单：**
- 新建：`src/components/chat/TodoPanel.tsx`
- 新建：`src/components/chat/TodoPanel.css`
- 修改：`src/components/layout/DetailsPanel.tsx`（添加 Todo 标签页）

**预估工时：** 3-4 小时

---

### 4.4 任务 C4：QueueDock 消息队列展示

**目标：** 显示等待处理的消息队列。

**技术方案：**

1. 创建 `QueueDock.tsx`：
   - 显示排队中的消息
   - 支持重新排序
   - 支持取消排队

2. 集成位置：
   - 输入区域下方
   - 或独立的折叠面板

**文件变更清单：**
- 新建：`src/components/chat/QueueDock.tsx`
- 新建：`src/components/chat/QueueDock.css`

**预估工时：** 2-3 小时

---

### 4.5 任务 C5：工作区浏览器 WorkspaceBrowser

**目标：** 实现多工作区支持，允许用户创建和切换不同的工作区。

**技术方案：**

1. 创建 `WorkspaceBrowser.tsx`：
   - 工作区列表（侧边栏顶部）
   - 创建新工作区
   - 重命名/删除工作区
   - 工作区间会话隔离

2. 数据结构：
```typescript
interface Workspace {
  id: string
  name: string
  createdAt: number
  sessionIds: string[]
}
```

3. 修改 Session 存储结构，关联到工作区

**文件变更清单：**
- 新建：`src/components/sidebar/WorkspaceBrowser.tsx`
- 新建：`src/components/sidebar/WorkspaceBrowser.css`
- 修改：`src/store/index.ts`（添加 workspace 状态）
- 修改：`src/components/layout/Sidebar.tsx`（集成 WorkspaceBrowser）

**预估工时：** 6-8 小时

---

### 4.6 任务 C6：轨迹时间线 TrajectoryTimeline

**目标：** 实现完整的轨迹时间线视图，替代当前的模态框版本。

**技术方案：**

1. 创建 `TrajectoryTimeline.tsx`：
   - 垂直时间线布局
   - 每个 Turn 一个节点
   - 节点显示：时间、Token 数、工具调用数
   - 可点击跳转到对应消息

2. 集成方式：
   - 替换当前的 TrajectoryView 模态框
   - 或作为 DetailsPanel 的新标签页

**文件变更清单：**
- 新建：`src/components/chat/TrajectoryTimeline.tsx`
- 新建：`src/components/chat/TrajectoryTimeline.css`
- 修改：`src/components/chat/TrajectoryView.tsx`（重构）

**预估工时：** 4-6 小时

---

## 第五章 阶段 D — 设置系统增强

### 5.1 任务 D1：自定义 Provider 配置

**目标：** 实现完整的 LLM Provider 配置编辑器。

**技术方案：**

1. 创建 `ProviderEditor.tsx`：
   - Provider 列表（添加/删除/编辑）
   - 每个 Provider 的配置：名称、API Key、Base URL、模型列表
   - 测试连接按钮
   - 导入/导出配置

2. 修改 SettingsModal，添加 Provider 配置标签页

**文件变更清单：**
- 新建：`src/components/settings/ProviderEditor.tsx`
- 新建：`src/components/settings/ProviderEditor.css`
- 修改：`src/components/settings/SettingsModal.tsx`

**预估工时：** 4-6 小时

---

### 5.2 任务 D2：模型列表编辑器 ModelListEditor

**目标：** 允许用户自定义模型列表、排序、启用/禁用。

**技术方案：**

1. 创建 `ModelListEditor.tsx`：
   - 模型列表（拖拽排序）
   - 每个模型：名称、上下文窗口、最大 Token
   - 启用/禁用开关
   - 添加自定义模型
   - 重置为默认

**文件变更清单：**
- 新建：`src/components/settings/ModelListEditor.tsx`
- 新建：`src/components/settings/ModelListEditor.css`

**预估工时：** 3-4 小时

---

### 5.3 任务 D3：首次运行引导 OnboardingDialog

**目标：** 实现首次运行时的设置引导流程。

**技术方案：**

1. 创建 `OnboardingDialog.tsx`：
   - 分步引导：选择语言 → 配置 API Key → 选择模型 → 完成
   - 每步有说明文字和输入框
   - 跳过按钮
   - 完成后保存设置

2. 检测首次运行：
   - 检查 localStorage 中的 `onboarding-completed` 标志
   - 未完成则显示引导

**文件变更清单：**
- 新建：`src/components/settings/OnboardingDialog.tsx`
- 新建：`src/components/settings/OnboardingDialog.css`
- 修改：`src/App.tsx`（检测首次运行）

**预估工时：** 3-4 小时

---

## 第六章 开发规范与质量保证

### 6.1 代码规范

**组件开发规范：**
- 每个组件一个文件，文件名与组件名一致
- 使用 TypeScript 严格类型
- 组件 props 必须定义 interface
- 使用函数组件 + Hooks
- 样式使用 CSS Modules 或全局 CSS（保持与现有代码一致）

**状态管理规范：**
- 全局状态使用 Zustand store
- 组件局部状态使用 useState/useReducer
- 避免 prop drilling，使用 Context 或 store

**测试规范：**
- 核心逻辑必须有单元测试
- 组件测试使用 @testing-library/react
- 测试文件与源文件同目录，后缀 `.test.tsx`

### 6.2 Git 工作流

- 每个任务一个分支（`feature/xxx` 或 `fix/xxx`）
- 提交信息格式：`type(scope): description`
- 类型：feat, fix, refactor, style, test, docs
- 合并前必须通过构建和测试

### 6.3 性能考虑

- 虚拟滚动：消息列表超过 100 条时使用虚拟滚动
- 懒加载：非首屏组件使用 React.lazy
- 图片优化：使用 WebP 格式，压缩大小
- 代码分割：按功能模块分割代码

---

## 第七章 时间线与里程碑

### 阶段 A（第 1-2 周）：核心体验对齐
- A1：ToolCallTree + 工具视图（4-6h）
- A2：ContextMeter（2-3h）
- A3：Compaction + SystemPromptRow（3-4h）
- A4：DropOverlay（2-3h）
- **总计：11-16 小时**

### 阶段 B（第 3-4 周）：交互增强
- B1：富文本输入（8-12h）
- B2：ApprovalCommand（4-6h）
- B3：PermissionSelect（3-4h）
- B4：ToolDetails（3-4h）
- **总计：18-26 小时**

### 阶段 C（第 5-6 周）：高级功能
- C1：PlanModeControl（4-6h）
- C2：SubagentHeader（3-4h）
- C3：TodoPanel（3-4h）
- C4：QueueDock（2-3h）
- C5：WorkspaceBrowser（6-8h）
- C6：TrajectoryTimeline（4-6h）
- **总计：22-31 小时**

### 阶段 D（第 7 周）：设置系统增强
- D1：ProviderEditor（4-6h）
- D2：ModelListEditor（3-4h）
- D3：OnboardingDialog（3-4h）
- **总计：10-14 小时**

### 总计预估
- **总工时：61-87 小时**
- **预计周期：7-8 周**

---

## 第八章 风险与依赖

### 8.1 技术风险

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| TipTap 学习曲线 | B1 延期 | 先做 POC 验证 |
| 工具系统复杂度 | A1 延期 | 分批实现，先支持核心工具 |
| 状态管理复杂度 | 整体延期 | 保持简单，避免过度设计 |

### 8.2 外部依赖

| 依赖 | 用途 | 备选方案 |
|------|------|---------|
| TipTap | 富文本输入 | Slate.js / Draft.js |
| react-syntax-highlighter | 代码高亮 | highlight.js（已使用） |
| react-diff-viewer | 文件差异展示 | 自定义实现 |

---

## 附录 A：文件变更汇总

### 阶段 A 新建文件
1. `src/components/chat/tools/BashView.tsx`
2. `src/components/chat/tools/FileEditView.tsx`
3. `src/components/chat/tools/FileReadView.tsx`
4. `src/components/chat/tools/SearchView.tsx`
5. `src/components/chat/tools/WebView.tsx`
6. `src/components/chat/tools/ToolView.css`
7. `src/components/chat/tools/index.ts`
8. `src/components/chat/ContextMeter.tsx`
9. `src/components/chat/ContextMeter.css`
10. `src/components/chat/CompactionItem.tsx`
11. `src/components/chat/CompactionItem.css`
12. `src/components/chat/SystemPromptRow.tsx`
13. `src/components/chat/SystemPromptRow.css`
14. `src/components/chat/DropOverlay.tsx`
15. `src/components/chat/DropOverlay.css`

### 阶段 B 新建文件
16. `src/components/chat/RichInput.tsx`
17. `src/components/chat/RichInput.css`
18. `src/components/chat/chips/FileReferenceChip.tsx`
19. `src/components/chat/chips/ModelChip.tsx`
20. `src/components/chat/chips/index.ts`
21. `src/components/chat/extensions/MentionExtension.ts`
22. `src/components/chat/ApprovalCommand.tsx`
23. `src/components/chat/ApprovalCommand.css`
24. `src/components/chat/PermissionSelect.tsx`
25. `src/components/chat/PermissionSelect.css`
26. `src/components/chat/ToolDetails.tsx`
27. `src/components/chat/ToolDetails.css`

### 阶段 C 新建文件
28. `src/components/chat/PlanModeControl.tsx`
29. `src/components/chat/PlanModeControl.css`
30. `src/components/chat/SubagentHeader.tsx`
31. `src/components/chat/SubagentHeader.css`
32. `src/components/chat/TodoPanel.tsx`
33. `src/components/chat/TodoPanel.css`
34. `src/components/chat/QueueDock.tsx`
35. `src/components/chat/QueueDock.css`
36. `src/components/sidebar/WorkspaceBrowser.tsx`
37. `src/components/sidebar/WorkspaceBrowser.css`
38. `src/components/chat/TrajectoryTimeline.tsx`
39. `src/components/chat/TrajectoryTimeline.css`

### 阶段 D 新建文件
40. `src/components/settings/ProviderEditor.tsx`
41. `src/components/settings/ProviderEditor.css`
42. `src/components/settings/ModelListEditor.tsx`
43. `src/components/settings/ModelListEditor.css`
44. `src/components/settings/OnboardingDialog.tsx`
45. `src/components/settings/OnboardingDialog.css`

### 需要修改的现有文件
- `src/components/chat/MessageItem.tsx`
- `src/components/chat/ToolCallTree.tsx`
- `src/components/chat/ChatView.tsx`
- `src/components/layout/DetailsPanel.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/settings/SettingsModal.tsx`
- `src/store/index.ts`
- `src/App.tsx`

---

## 附录 B：依赖安装命令

```bash
# 阶段 B（富文本输入）
pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-mention @tiptap/extension-placeholder

# 阶段 B（代码差异展示）
pnpm add react-diff-viewer-continued

# 阶段 C（虚拟滚动，可选）
pnpm add @tanstack/react-virtual
```

---

*文档结束*
