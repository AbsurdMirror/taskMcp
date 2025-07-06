# TaskMCP 测试指南

本目录包含用于测试TaskMCP服务器功能的测试脚本。

## 测试文件说明

- `test-with-inspector.js`: 启动MCP服务器并注入Inspector进行调试
- `test-requests.js`: 向MCP服务器发送测试请求
- `test-task.md`: 测试用的任务文档模板

## 使用方法

### 方法一：使用Inspector进行调试

1. 运行以下命令启动带有Inspector的MCP服务器：

```bash
npm run test:inspector
```

2. 注意控制台输出中的会话令牌（Session token）

3. 将会话令牌设置为环境变量：

```bash
# Windows PowerShell
$env:SESSION_TOKEN="your-session-token"

# Windows CMD
set SESSION_TOKEN=your-session-token
```

4. 运行测试请求脚本：

```bash
npm test
```

### 方法二：直接使用Inspector界面

1. 运行以下命令启动带有Inspector的MCP服务器：

```bash
npm run test:inspector
```

2. 在控制台输出中找到Inspector界面的URL，通常格式为：
   `http://localhost:3000/inspector?token=your-session-token`

3. 在浏览器中打开该URL，使用Inspector界面直接测试MCP工具

## 测试内容

`test-requests.js` 脚本会自动测试以下功能：

1. 设置任务文档路径
2. 设置任务概述
3. 添加子任务
4. 获取子任务列表
5. 获取子任务详情

## 注意事项

- 测试前确保已安装所有依赖：`npm install`
- 如果遇到权限问题，请确保有足够的文件读写权限
- 测试完成后，可以按 Ctrl+C 终止服务器进程