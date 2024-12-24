const fs = require('fs');
const path = require('path');

function listDirectory(currentPath) {
  try {
    const files = fs.readdirSync(currentPath);
    return files.map(file => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        isDirectory: stats.isDirectory(),
        icon: stats.isDirectory() ? '📁' : '📄'
      };
    });
  } catch (error) {
    console.error('Erro ao listar o diretório:', error.message);
    return [];
  }
}

function goBack(currentPath) {
  try {
    return path.dirname(currentPath);
  } catch (error) {
    console.error('Erro ao voltar ao diretório anterior:', error.message);
    return currentPath;
  }
}

module.exports = { listDirectory, goBack };
