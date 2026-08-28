# API 文档

## 概述

DeepSeek Harness Desktop通过预加载脚本暴露了一套完整的API给渲染进程。所有API通过`window.deepSeek`访问。

## 类型定义

```typescript
interface DeepSeekAPI {
  window: WindowAPI;
  llm: LLMAPI;
  tools: ToolsAPI;
  sessions: SessionsAPI;
  fs: FileSystemAPI;
  system: SystemAPI;
  on: EventAPI;
}
```

## 窗口控制 API

### window.minimize()
最小化窗口。

```typescript
await window.deepSeek.window.minimize();
```

### window.maximize()
最大化/恢复窗口。

```typescript
await window.deepSeek.window.maximize();
```

### window.close()
关闭窗口。

```typescript
await window.deepSeek.window.close();
```

### window.isMaximized()
检查窗口是否最大化。

```typescript
const isMaximized = await window.deepSeek.window.isMaximized();
console.log(isMaximized); // true 或 false
```

## LLM API

### llm.stream(options)
发送流式LLM请求。

```typescript
const stream = await window.deepSeek.llm.stream({
  prompt: "你好，请介绍一下自己",
  systemMessage: "你是一个有帮助的AI助手",
  model: "deepseek-chat"
});

for await (const event of stream) {
  console.log(event);
}
```

### llm.listModels()
获取可用的模型列表。

```typescript
const models = await window.deepSeek.llm.listModels();
console.log(models);
```

### llm.setProvider(provider)
设置LLM提供商。

```typescript
await window.deepSeek.llm.setProvider('deepseek');
```

### llm.getConfig()
获取当前LLM配置。

```typescript
const config = await window.deepSeek.llm.getConfig();
console.log(config);
```

### llm.updateConfig(config)
更新LLM配置。

```typescript
await window.deepSeek.llm.updateConfig({
  provider: 'deepseek',
  model: 'deepseek-chat'
});
```

## 工具 API

### tools.execute(name, args)
执行一个工具。

```typescript
const result = await window.deepSeek.tools.execute('bash', {
  command: 'ls -la'
});
console.log(result);
```

### tools.list()
获取可用工具列表。

```typescript
const tools = await window.deepSeek.tools.list();
console.log(tools);
```

## 会话 API

### sessions.create(name?)
创建新会话。

```typescript
const session = await window.deepSeek.sessions.create('我的会话');
console.log(session);
```

### sessions.load(id)
加载会话。

```typescript
const session = await window.deepSeek.sessions.load('session-id');
console.log(session);
```

### sessions.save(session)
保存会话。

```typescript
await window.deepSeek.sessions.save({
  id: 'session-id',
  messages: [...]
});
```

### sessions.delete(id)
删除会话。

```typescript
await window.deepSeek.sessions.delete('session-id');
```

### sessions.list()
获取所有会话列表。

```typescript
const sessions = await window.deepSeek.sessions.list();
console.log(sessions);
```

## 文件系统 API

### fs.readFile(path)
读取文件内容。

```typescript
const content = await window.deepSeek.fs.readFile('/path/to/file.txt');
console.log(content);
```

### fs.writeFile(path, content)
写入文件。

```typescript
await window.deepSeek.fs.writeFile('/path/to/file.txt', 'Hello World');
```

### fs.readDir(path)
读取目录内容。

```typescript
const files = await window.deepSeek.fs.readDir('/path/to/directory');
console.log(files);
```

### fs.pickDirectory()
打开目录选择对话框。

```typescript
const directory = await window.deepSeek.fs.pickDirectory();
console.log(directory);
```

### fs.pickFile(options?)
打开文件选择对话框。

```typescript
const file = await window.deepSeek.fs.pickFile({
  filters: [
    { name: 'Text Files', extensions: ['txt'] },
    { name: 'All Files', extensions: ['*'] }
  ]
});
console.log(file);
```

### fs.exists(path)
检查文件是否存在。

```typescript
const exists = await window.deepSeek.fs.exists('/path/to/file.txt');
console.log(exists); // true 或 false
```

### fs.stat(path)
获取文件信息。

```typescript
const stat = await window.deepSeek.fs.stat('/path/to/file.txt');
console.log(stat);
```

## 系统 API

### system.getPlatform()
获取操作系统平台。

```typescript
const platform = await window.deepSeek.system.getPlatform();
console.log(platform); // 'win32', 'darwin', 'linux'
```

### system.getVersion()
获取应用版本。

```typescript
const version = await window.deepSeek.system.getVersion();
console.log(version); // '1.0.0'
```

### system.getHomeDir()
获取用户主目录。

```typescript
const homeDir = await window.deepSeek.system.getHomeDir();
console.log(homeDir);
```

### system.getTempDir()
获取临时目录。

```typescript
const tempDir = await window.deepSeek.system.getTempDir();
console.log(tempDir);
```

## 事件 API

### on.updateAvailable(callback)
监听更新可用事件。

```typescript
window.deepSeek.on.updateAvailable((info) => {
  console.log('新版本可用:', info);
});
```

### on.updateDownloaded(callback)
监听更新下载完成事件。

```typescript
window.deepSeek.on.updateDownloaded((info) => {
  console.log('更新已下载:', info);
});
```

### on.updateProgress(callback)
监听更新进度事件。

```typescript
window.deepSeek.on.updateProgress((progress) => {
  console.log('更新进度:', progress);
});
```

### on.notification(callback)
监听通知事件。

```typescript
window.deepSeek.on.notification((notification) => {
  console.log('收到通知:', notification);
});
```

## 错误处理

所有API调用都返回Promise，可以使用try/catch处理错误：

```typescript
try {
  const result = await window.deepSeek.llm.stream({
    prompt: "你好"
  });
} catch (error) {
  console.error('LLM调用失败:', error);
}
```

## 安全注意事项

1. 所有API调用都经过预加载脚本的安全检查
2. 文件系统操作限制在工作区目录内
3. 网络请求只允许访问授权的API端点
4. 所有用户输入都经过验证和清理
