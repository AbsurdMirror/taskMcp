#!/usr/bin/env node
// src/index.js - MCP服务器入口
const McpServer = require('./mcp/server');
const { Command } = require('commander');
const { version } = require('../package.json');

// 命令行参数解析
const program = new Command();
program
  .version(version)
  .option('-p, --port <number>', 'MCP服务器端口', 3000)
  .parse(process.argv);

const options = program.opts();

// 配置
const config = {
  port: process.env.PORT || options.port
};

// 启动MCP服务器
const mcpServer = new McpServer(config);
mcpServer.initialize();
mcpServer.start();

// 使用console.error输出服务器信息，避免干扰MCP协议通信
console.error(`
MCP服务器已启动:
- MCP服务器运行在端口 ${config.port}
`);