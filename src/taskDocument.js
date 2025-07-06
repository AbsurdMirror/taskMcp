// src/taskDocument.js - 任务文档处理模块
const fs = require('fs').promises;
const path = require('path');
const { parseMarkdown, generateMarkdown } = require('./parser');

class TaskDocument {
  constructor() {
    this.documentPath = null;
    this.overview = '';
    this.subtasks = [];
    this.initialized = false;
  }

  // 单例模式实现
  static instance = null;
  static getInstance() {
    if (!TaskDocument.instance) {
      TaskDocument.instance = new TaskDocument();
    }
    return TaskDocument.instance;
  }

  // 设置文档路径
  async setDocumentPath(documentPath) {
    this.documentPath = documentPath;
    
    try {
      // 检查文件是否存在
      await fs.access(documentPath);
      
      // 读取并解析文档
      await this.loadDocument();
    } catch (error) {
      if (error.code === 'ENOENT') {
        // 文件不存在，创建新文档
        this.overview = '';
        this.subtasks = [];
        this.initialized = true;
        await this.saveDocument();
      } else {
        throw error;
      }
    }
    
    return true;
  }

  // 加载文档
  async loadDocument() {
    if (!this.documentPath) {
      throw new Error('未设置文档路径');
    }
    
    const content = await fs.readFile(this.documentPath, 'utf-8');
    const { overview, subtasks } = parseMarkdown(content);
    
    this.overview = overview;
    this.subtasks = subtasks;
    this.initialized = true;
    
    return true;
  }

  // 保存文档
  async saveDocument() {
    if (!this.documentPath) {
      throw new Error('未设置文档路径');
    }
    
    // 确保目录存在
    const dir = path.dirname(this.documentPath);
    await fs.mkdir(dir, { recursive: true });
    
    // 生成Markdown内容
    const content = generateMarkdown(this.overview, this.subtasks);
    
    // 写入文件
    await fs.writeFile(this.documentPath, content, 'utf-8');
    
    return true;
  }

  // 检查初始化状态
  checkInitialized() {
    if (!this.initialized) {
      throw new Error('任务文档未初始化，请先设置文档路径');
    }
  }

  // 设置任务概述
  async setOverview(overview) {
    this.checkInitialized();
    this.overview = overview;
    await this.saveDocument();
    return true;
  }

  // 添加子任务
  async addSubtask(name, description) {
    this.checkInitialized();
    
    // 生成新的任务ID
    const taskId = this.subtasks.length > 0 
      ? Math.max(...this.subtasks.map(task => task.id)) + 1 
      : 1;
    
    // 添加子任务
    this.subtasks.push({
      id: taskId,
      name,
      description
    });
    
    await this.saveDocument();
    return taskId;
  }

  // 插入子任务
  async insertSubtask(position, name, description) {
    this.checkInitialized();
    
    // 检查位置是否有效
    if (position < 1 || position > this.subtasks.length + 1) {
      throw new Error(`无效的插入位置: ${position}`);
    }
    
    // 创建新任务（暂时不分配ID）
    const newTask = {
      id: null, // 临时ID，稍后重新分配
      name,
      description
    };
    
    // 插入任务
    this.subtasks.splice(position - 1, 0, newTask);
    
    // 重新分配所有任务的ID，从1开始递增
    this.subtasks.forEach((task, index) => {
      task.id = index + 1;
    });
    
    // 获取新插入任务的ID
    const taskId = this.subtasks[position - 1].id;
    
    await this.saveDocument();
    return taskId;
  }

  // 获取子任务名称列表
  async getSubtaskNameList() {
    this.checkInitialized();
    return this.subtasks.map(task => ({
      id: task.id,
      name: task.name
    }));
  }

  // 获取子任务详情
  async getSubtaskDetail(taskId) {
    this.checkInitialized();
    
    const task = this.subtasks.find(task => task.id === taskId);
    if (!task) {
      throw new Error(`子任务不存在: ${taskId}`);
    }
    
    return task;
  }

  // 获取子任务完整列表
  async getSubtaskFullList() {
    this.checkInitialized();
    return this.subtasks;
  }

  // 修改子任务
  async updateSubtask(taskId, name, description) {
    this.checkInitialized();
    
    // 查找子任务
    const taskIndex = this.subtasks.findIndex(task => task.id === taskId);
    if (taskIndex === -1) {
      throw new Error(`子任务不存在: ${taskId}`);
    }
    
    // 更新子任务信息
    if (name !== undefined) {
      this.subtasks[taskIndex].name = name;
    }
    
    if (description !== undefined) {
      this.subtasks[taskIndex].description = description;
    }
    
    await this.saveDocument();
    return this.subtasks[taskIndex].id;
  }
}

module.exports = TaskDocument;