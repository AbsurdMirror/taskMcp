// src/parser.js - Markdown解析工具

/**
 * 解析Markdown格式的任务文档
 * @param {string} content - Markdown内容
 * @returns {Object} 解析结果，包含overview和subtasks
 */
function parseMarkdown(content) {
  // 初始化结果
  const result = {
    overview: '',
    subtasks: []
  };
  
  // 使用正则表达式匹配任务概述
  const overviewMatch = content.match(/## 任务概述\s*\n\s*([\s\S]*?)(?=\n## |$)/);
  if (overviewMatch && overviewMatch[1]) {
    result.overview = overviewMatch[1].trim();
  }
  
  // 使用正则表达式匹配子任务列表
  const subtasksSection = content.match(/## 任务列表\s*\n([\s\S]*?)(?=\n## |$)/);
  if (subtasksSection && subtasksSection[1]) {
    // 匹配每个子任务
    const subtaskPattern = /### (\d+)\. ([^\n]+)\s*\n\s*([\s\S]*?)(?=\n### |$)/g;
    let match;
    
    while ((match = subtaskPattern.exec(subtasksSection[1])) !== null) {
      const id = parseInt(match[1], 10);
      const name = match[2].trim();
      const description = match[3].trim();
      
      result.subtasks.push({ id, name, description });
    }
    
    // 按ID排序
    result.subtasks.sort((a, b) => a.id - b.id);
  }
  
  return result;
}

/**
 * 生成Markdown格式的任务文档
 * @param {string} overview - 任务概述
 * @param {Array} subtasks - 子任务列表
 * @returns {string} Markdown内容
 */
function generateMarkdown(overview, subtasks) {
  // 生成任务概述部分
  let markdown = '# 任务\n\n## 任务概述\n\n';
  markdown += overview || '(暂无任务概述)';
  
  // 生成任务列表部分
  markdown += '\n\n## 任务列表\n\n';
  
  // 添加每个子任务
  if (subtasks.length > 0) {
    subtasks.forEach(task => {
      markdown += `### ${task.id}. ${task.name}\n\n${task.description || '(暂无描述)'}\n\n`;
    });
  } else {
    markdown += '(暂无子任务)\n';
  }
  
  return markdown;
}

module.exports = {
  parseMarkdown,
  generateMarkdown
};