// test/test-update-subtask.js
const fs = require('fs').promises;
const path = require('path');
const TaskDocument = require('../src/taskDocument');

async function testUpdateSubtask() {
  try {
    // 创建测试文档路径
    const testDocPath = path.join(__dirname, 'test-update.md');
    
    // 获取TaskDocument实例
    const taskDoc = TaskDocument.getInstance();
    
    // 设置文档路径
    await taskDoc.setDocumentPath(testDocPath);
    
    // 设置任务概述
    await taskDoc.setOverview('这是一个测试任务');
    
    // 添加测试子任务
    const taskId = await taskDoc.addSubtask('测试子任务', '这是一个测试子任务的描述');
    
    console.log(`添加子任务成功，ID: ${taskId}`);
    
    // 获取子任务详情
    const taskBefore = await taskDoc.getSubtaskDetail(taskId);
    console.log('修改前的子任务:', taskBefore);
    
    // 修改子任务
    await taskDoc.updateSubtask(taskId, '修改后的子任务', '这是修改后的子任务描述');
    
    // 再次获取子任务详情
    const taskAfter = await taskDoc.getSubtaskDetail(taskId);
    console.log('修改后的子任务:', taskAfter);
    
    // 只修改名称
    await taskDoc.updateSubtask(taskId, '只修改名称', undefined);
    const taskNameOnly = await taskDoc.getSubtaskDetail(taskId);
    console.log('只修改名称后的子任务:', taskNameOnly);
    
    // 只修改描述
    await taskDoc.updateSubtask(taskId, undefined, '只修改描述');
    const taskDescOnly = await taskDoc.getSubtaskDetail(taskId);
    console.log('只修改描述后的子任务:', taskDescOnly);
    
    // 清理测试文件
    await fs.unlink(testDocPath);
    
    console.log('测试完成');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testUpdateSubtask();