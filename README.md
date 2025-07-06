# TaskMCP - 基于MCP协议的任务文档管理系统

## 概述

TaskMCP是一个基于MCP（Model Context Protocol，模型上下文协议）的任务文档管理系统，旨在提供标准化的接口，用于记录大任务的子任务拆解列表，以及读取子任务。系统使用Markdown格式存储任务文档，便于人类阅读和编辑。

## 功能特性

- 提供标准化的MCP接口，用于任务文档的管理
- 支持设置任务概述
- 支持添加、插入子任务
- 支持获取子任务列表和详情
- 使用Markdown格式存储任务文档

## 安装

```bash
npm install
```

## 使用方法

### 启动服务

```bash
npm start
```

或者使用命令行参数：

```bash
node src/index.js --port 3000 --data-dir ./data --docs-dir ./docs
```

### 命令行参数

- `-p, --port <number>`: MCP服务器端口，默认为3000
- `-d, --data-dir <path>`: 数据目录路径，默认为用户主目录下的.taskMcpData/data
- `-o, --docs-dir <path>`: 文档目录路径，默认为用户主目录下的.taskMcpData/docs

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