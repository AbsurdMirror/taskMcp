// src/mcp/server.js - MCP服务器实现
const { McpServer: ModelContextServer } = require('@modelcontextprotocol/sdk/server/mcp.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const tools = require('./tools');

class McpServer {
  constructor(config) {
    this.config = config;
    this.server = null;
  }

  initialize() {
    this.server = new ModelContextServer({
      name: "task-mcp",
      version: "1.0.0"
      // 不在这里传递config，而是在工具处理函数中手动添加
    });
    
    // 注册工具
    this.registerTools();
    
    // 设置传输层
    this.transport = new StdioServerTransport();
  }
  
  registerTools() {
    // 注册所有工具
    [
      tools.setTaskDocument,
      tools.setTaskOverview,
      tools.addSubtask,
      tools.insertSubtask,
      tools.getSubtaskNameList,
      tools.getSubtaskDetail,
      tools.getSubtaskFullList,
      tools.updateSubtask  // 添加这一行
    ].forEach(tool => {
      this.server.registerTool(
        tool.name,
        {
          title: tool.title || tool.name,
          description: tool.description || "",
          inputSchema: tool.inputSchema
        },
        tool.handler
      );
    });
  }

  async start() {
    try {
      await this.server.connect(this.transport);
      const port = this.config.port || 3000;
      // 使用console.error输出服务器信息，避免干扰MCP协议通信
      console.error(`MCP Server running on port ${port}`);
    } catch (error) {
      console.error('Failed to start MCP server:', error);
    }
  }
}

module.exports = McpServer;