// test-requests.js
// 用于向MCP服务器发送测试请求

/**
 * 使用说明：
 * 1. 先运行test-with-inspector.js启动MCP服务器
 * 2. 获取会话令牌并设置为SESSION_TOKEN环境变量或直接在下方设置
 * 3. 运行此脚本发送测试请求
 */

const { McpClient } = require('@modelcontextprotocol/sdk/client/mcp.js');
const { HttpClientTransport } = require('@modelcontextprotocol/sdk/client/http.js');
const path = require('path');
const fs = require('fs').promises;

// 配置参数
const SESSION_TOKEN = process.env.SESSION_TOKEN || ''; // 从环境变量获取或手动设置
const PORT = process.env.PORT || 3000;
const TEST_DOC_PATH = path.join(__dirname, 'test-task.md');

// 创建MCP客户端
async function createClient() {
  if (!SESSION_TOKEN) {
    console.error('错误: 未设置会话令牌。请先运行test-with-inspector.js获取令牌');
    process.exit(1);
  }

  const transport = new HttpClientTransport({
    baseUrl: `http://localhost:${PORT}`,
    headers: {
      'X-Session-Token': SESSION_TOKEN
    }
  });

  const client = new McpClient();
  await client.connect(transport);
  return client;
}

// 准备测试文档
async function prepareTestDocument() {
  try {
    // 确保测试文档存在
    try {
      await fs.access(TEST_DOC_PATH);
    } catch (error) {
      // 文件不存在，创建一个空的测试文档
      await fs.writeFile(TEST_DOC_PATH, '# 任务\n\n## 任务概述\n\n这是一个测试任务文档\n\n## 任务列表\n\n(暂无子任务)\n', 'utf-8');
      console.log(`创建测试文档: ${TEST_DOC_PATH}`);
    }
  } catch (error) {
    console.error('准备测试文档失败:', error);
    process.exit(1);
  }
}

// 运行测试
async function runTests() {
  try {
    // 准备测试文档
    await prepareTestDocument();
    
    // 创建客户端
    const client = await createClient();
    console.log('MCP客户端已连接');

    // 测试: 设置任务文档
    console.log('\n测试: 设置任务文档');
    const setDocResult = await client.callTool('setTaskDocument', {
      documentPath: TEST_DOC_PATH
    });
    console.log('结果:', setDocResult);

    // 测试: 设置任务概述
    console.log('\n测试: 设置任务概述');
    const setOverviewResult = await client.callTool('setTaskOverview', {
      overview: '这是通过测试脚本更新的任务概述'
    });
    console.log('结果:', setOverviewResult);

    // 测试: 添加子任务
    console.log('\n测试: 添加子任务');
    const addSubtaskResult = await client.callTool('addSubtask', {
      name: '测试子任务',
      description: '这是一个通过测试脚本添加的子任务'
    });
    console.log('结果:', addSubtaskResult);

    // 测试: 获取子任务列表
    console.log('\n测试: 获取子任务列表');
    const getSubtasksResult = await client.callTool('getSubtaskNameList', {});
    console.log('结果:', getSubtasksResult);

    // 测试: 获取子任务详情
    if (getSubtasksResult.content.subtasks && getSubtasksResult.content.subtasks.length > 0) {
      const taskId = getSubtasksResult.content.subtasks[0].id;
      console.log(`\n测试: 获取子任务详情 (ID: ${taskId})`);
      const getDetailResult = await client.callTool('getSubtaskDetail', {
        taskId: taskId
      });
      console.log('结果:', getDetailResult);
    }

    console.log('\n所有测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
runTests();