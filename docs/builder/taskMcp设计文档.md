# taskMcp设计文档

## 1. 概述

MCP（Model Context Protocol，模型上下文协议）是一种开放协议，旨在实现大型语言模型（LLM）应用与外部数据源、工具和服务之间的无缝集成。本项目旨在设计并实现一个基于MCP的API文档管理系统，该系统将允许AI通过MCP接口结构化地读写API文档，同时支持用户以Markdown格式查看这些文档。

本系统的主要目标包括：

1. 提供标准化的MCP接口，用于记录大任务的子任务拆解列表，以及读取子任务
2. 使用markdown文档来记录和读取

## 2. MCP接口设计

MCP接口设计遵循标准的MCP协议规范，提供一系列工具（tools）用于API文档的管理。每个工具都有明确定义的输入模式（inputSchema）和返回值（return）。以下是主要接口的设计：

### 子章节模板

1. name: `addModule`
2. 描述: 创建新的API模块，包括模块名称、描述和其他元数据
3. inputSchema:（最外层为json，内层使用zod库的表示）

```javascript
{
  "???": z.xxx
}
```

4. return:（最外层是一个只有content的json，content的值可以是任意值）

```javascript
{
  "content": xxx
}
```

### 2.1. 指定任务文档

1. name: `setTaskDocument`
2. 描述: 指定要操作的任务文档路径
3. inputSchema:

```javascript
{
  "documentPath": z.string().describe("任务文档的路径")
}
```

4. return:

```javascript
{
  "content": {
    "success": boolean,
    "message": string
  }
}
```

### 2.2. 设置任务概述

1. name: `setTaskOverview`
2. 描述: 设置任务文档的概述内容
3. inputSchema:

```javascript
{
  "overview": z.string().describe("任务的概述内容")
}
```

4. return:

```javascript
{
  "content": {
    "success": boolean,
    "message": string
  }
}
```

### 2.3. 添加子任务

1. name: `addSubtask`
2. 描述: 在任务列表末尾添加新的子任务
3. inputSchema:

```javascript
{
  "name": z.string().describe("子任务名称"),
  "description": z.string().describe("子任务描述")
}
```

4. return:

```javascript
{
  "content": {
    "success": boolean,
    "taskId": number,
    "message": string
  }
}
```

### 2.4. 插入子任务

1. name: `insertSubtask`
2. 描述: 在指定位置插入新的子任务
3. inputSchema:

```javascript
{
  "position": z.number().int().positive().describe("插入位置的序号"),
  "name": z.string().describe("子任务名称"),
  "description": z.string().describe("子任务描述")
}
```

4. return:

```javascript
{
  "content": {
    "success": boolean,
    "taskId": number,
    "message": string
  }
}
```

### 2.5. 获取子任务名称列表

1. name: `getSubtaskNameList`
2. 描述: 获取所有子任务的名称列表
3. inputSchema:

```javascript
{}
```

4. return:

```javascript
{
  "content": {
    "success": boolean,
    "subtasks": Array<{
      "id": number,
      "name": string
    }>,
    "message": string
  }
}
```

### 2.6. 获取子任务详情

1. name: `getSubtaskDetail`
2. 描述: 获取指定子任务的详细信息
3. inputSchema:

```javascript
{
  "taskId": z.number().int().positive().describe("子任务ID")
}
```

4. return:

```javascript
{
  "content": {
    "success": boolean,
    "subtask": {
      "id": number,
      "name": string,
      "description": string
    },
    "message": string
  }
}
```

### 2.7. 获取子任务完整列表

1. name: `getSubtaskFullList`
2. 描述: 获取所有子任务的完整信息列表
3. inputSchema:

```javascript
{}
```

4. return:

```javascript
{
  "content": {
    "success": boolean,
    "subtasks": Array<{
      "id": number,
      "name": string,
      "description": string
    }>,
    "message": string
  }
}
```

## 3. 任务文档markdown格式设计

本系统的任务文档markdown格式按照下文设计，其中尖括号的内容为模板可替换的内容，省略号代指重复性的格式

```md
# 任务

## 任务概述

<任务概述>

## 任务列表

### <序号>. <子任务名称>

<子任务描述>

### <序号>. <子任务名称>

<子任务描述>

...
...

```

示例：

```md
# 任务

## 任务概述

如何把大象装进冰箱的任务拆解

## 任务列表

### 1. 打开冰箱门

把冰箱门打开，门是垂直的。

### 2. 把大象装进冰箱

把大象装进冰箱，保证大象不被摔碎。

### 3. 关闭冰箱门

关闭冰箱门，门是垂直的。

```

## 4. MCP实现设计

### 4.1. 文件结构

```
/
├── src/
│   ├── index.js          # 主入口文件
│   ├── taskDocument.js   # 任务文档处理模块
│   ├── mcp/
│   │   ├── server.js     # MCP服务器实现
│   │   └── tools.js      # MCP工具集实现
│   └── utils/
│       ├── fileIO.js     # 文件读写工具
│       └── parser.js     # Markdown解析工具
├── package.json
└── README.md
```

### 4.2. 核心模块

#### 4.2.1. 任务文档处理模块

任务文档处理模块负责解析和修改Markdown格式的任务文档，提供以下功能：

- 解析任务文档结构
- 提取任务概述和子任务列表
- 修改任务概述
- 添加、插入和修改子任务
- 生成符合格式的Markdown文档

#### 4.2.2. MCP服务器实现

MCP服务器模块负责处理来自AI的请求，实现MCP协议规范，包括：

- 注册和管理MCP工具
- 处理工具调用请求
- 返回标准格式的响应
- 错误处理和日志记录

#### 4.2.3. MCP工具集实现

MCP工具集模块实现所有在接口设计中定义的工具，每个工具都包括：

- 输入验证
- 业务逻辑处理
- 结果格式化
- 错误处理

### 4.3. 数据流程

1. AI通过MCP协议调用工具
2. MCP服务器接收请求并验证输入
3. 调用相应的工具处理请求
4. 工具根据需要读取或修改任务文档
5. 返回处理结果给MCP服务器
6. MCP服务器将结果格式化并返回给AI

### 4.4. 错误处理

系统将实现全面的错误处理机制，包括：

- 输入验证错误
- 文件读写错误
- 解析错误
- 业务逻辑错误

所有错误都将返回标准格式的错误信息，包含错误代码和描述信息。
