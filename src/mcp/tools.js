// src/mcp/tools.js - MCP工具集实现
const { z } = require('zod');
const TaskDocument = require('../taskDocument');

// 设置任务文档路径
const setTaskDocument = {
  name: 'setTaskDocument',
  description: '指定要操作的任务文档路径',
  inputSchema: {
    documentPath: z.string().describe("任务文档的路径")
  },
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 设置文档路径
      await taskDoc.setDocumentPath(input.documentPath);
      
      return {
        content: [{
          type: 'text',
          text: '任务文档路径设置成功',
          success: true
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `任务文档路径设置失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

// 设置任务概述
const setTaskOverview = {
  name: 'setTaskOverview',
  description: '设置任务文档的概述内容',
  inputSchema: {
    overview: z.string().describe("任务的概述内容")
  },
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 设置任务概述
      await taskDoc.setOverview(input.overview);
      
      return {
        content: [{
          type: 'text',
          text: '任务概述设置成功',
          success: true
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `任务概述设置失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

// 添加子任务
const addSubtask = {
  name: 'addSubtask',
  description: '在任务列表末尾添加新的子任务',
  inputSchema: {
    name: z.string().describe("子任务名称"),
    description: z.string().describe("子任务描述")
  },
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 添加子任务
      const taskId = await taskDoc.addSubtask(input.name, input.description);
      
      return {
        content: [{
          type: 'text',
          text: '子任务添加成功',
          success: true,
          taskId
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `子任务添加失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

// 插入子任务
const insertSubtask = {
  name: 'insertSubtask',
  description: '在指定位置插入新的子任务',
  inputSchema: {
    position: z.number().int().positive().describe("插入位置的序号"),
    name: z.string().describe("子任务名称"),
    description: z.string().describe("子任务描述")
  },
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 插入子任务
      const taskId = await taskDoc.insertSubtask(input.position, input.name, input.description);
      
      return {
        content: [{
          type: 'text',
          text: '子任务插入成功',
          success: true,
          taskId
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `子任务插入失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

// 获取子任务名称列表
const getSubtaskNameList = {
  name: 'getSubtaskNameList',
  description: '获取所有子任务的名称列表',
  inputSchema: {},
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 获取子任务名称列表
      const subtasks = await taskDoc.getSubtaskNameList();
      
      return {
        content: [{
          type: 'text',
          text: '子任务名称列表获取成功',
          success: true,
          subtasks
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `子任务名称列表获取失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

// 获取子任务详情
const getSubtaskDetail = {
  name: 'getSubtaskDetail',
  description: '获取指定子任务的详细信息',
  inputSchema: {
    taskId: z.number().int().positive().describe("子任务ID")
  },
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 获取子任务详情
      const subtask = await taskDoc.getSubtaskDetail(input.taskId);
      
      return {
        content: [{
          type: 'text',
          text: '子任务详情获取成功',
          success: true,
          subtask
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `子任务详情获取失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

// 获取子任务完整列表
const getSubtaskFullList = {
  name: 'getSubtaskFullList',
  description: '获取所有子任务的完整信息列表',
  inputSchema: {},
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 获取子任务完整列表
      const subtasks = await taskDoc.getSubtaskFullList();
      
      return {
        content: [{
          type: 'text',
          text: '子任务完整列表获取成功',
          success: true,
          subtasks
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `子任务完整列表获取失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

// 修改子任务
const updateSubtask = {
  name: 'updateSubtask',
  description: '修改指定子任务的名称和描述',
  inputSchema: {
    taskId: z.number().int().positive().describe("子任务ID"),
    name: z.string().optional().describe("子任务的新名称（可选）"),
    description: z.string().optional().describe("子任务的新描述（可选）")
  },
  async handler(input, context) {
    try {
      // 获取任务文档实例
      const taskDoc = TaskDocument.getInstance();
      
      // 修改子任务
      const taskId = await taskDoc.updateSubtask(input.taskId, input.name, input.description);
      
      return {
        content: [{
          type: 'text',
          text: '子任务修改成功',
          success: true,
          taskId
        }]
      };
    } catch (error) {
      return {
        content: [{
          type: 'text',
          text: `子任务修改失败: ${error.message}`,
          success: false
        }]
      };
    }
  }
};

module.exports = {
  setTaskDocument,
  setTaskOverview,
  addSubtask,
  insertSubtask,
  getSubtaskNameList,
  getSubtaskDetail,
  getSubtaskFullList,
  updateSubtask
};