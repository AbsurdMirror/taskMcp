# TaskMCP - 基于MCP协议的任务文档管理系统

## 概述

TaskMCP是一个基于MCP（Model Context Protocol，模型上下文协议）的任务文档管理系统，旨在提供标准化的接口，用于记录大任务的子任务拆解列表，以及读取子任务。系统使用Markdown格式存储任务文档，便于人类阅读和编辑。

通过TaskMCP，您可以：

- 创建和管理任务文档
- 添加和组织子任务
- 使用标准化的MCP接口与AI模型交互

## 功能特性

- 提供标准化的MCP接口，用于任务文档的管理
- 支持设置任务概述
- 支持添加、插入子任务
- 支持获取子任务列表和详情
- 使用Markdown格式存储任务文档

## 安装

### 全局安装

```bash
npm install -g task-mcp
```

### 本地安装

```bash
npm install task-mcp
```

### MCP配置

```json
{
  "mcpServers": {
    "task-mcp": {
      "command": "npx",
      "args": [
        "task-mcp"
      ]
    }
  }
}
```

## 使用方法

### 全局安装后使用

```bash
task-mcp --port 3000
```

### 使用npx运行

```bash
npx task-mcp --port 3000
```

### 本地安装后使用

```bash
npm start
```

### 命令行参数

- `-p, --port <number>`: MCP服务器端口，默认为3000
- `-V, --version`: 显示版本号

## MCP接口

### 设置任务文档

```javascript
{
  "documentPath": "path/to/document.md"
}
```

### 设置任务概述

```javascript
{
  "overview": "任务的概述内容"
}
```

### 添加子任务

```javascript
{
  "name": "子任务名称",
  "description": "子任务描述"
}
```

### 插入子任务

```javascript
{
  "position": 1,
  "name": "子任务名称",
  "description": "子任务描述"
}
```

### 获取子任务名称列表

```javascript
{}
```

### 获取子任务详情

```javascript
{
  "taskId": 1
}
```

### 获取子任务完整列表

```javascript
{}
```

### 修改子任务

```javascript
{
  "taskId": 1,
  "name": "新的子任务名称",  // 可选
  "description": "新的子任务描述"  // 可选
}
```

## 文档格式

任务文档使用Markdown格式存储，格式如下：

```markdown
# 任务

## 任务概述

<任务概述>

## 任务列表

### <序号>. <子任务名称>

<子任务描述>

### <序号>. <子任务名称>

<子任务描述>

...
```

## 许可证

MIT
