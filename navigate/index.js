const fs = require('fs');
const path = require('path');
const { getIcon } = require('./icons');

function listDirectory(currentPath) {
  try {
    const files = fs.readdirSync(currentPath);
    return files.map(file => {
      const filePath = path.join(currentPath, file);
      const stats = fs.lstatSync(filePath);  
      const icon = getIcon(filePath, stats.isDirectory());
      return {
        name: file,
        isDirectory: stats.isDirectory(),
        icon: icon
      };
    }).sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.error('Erro ao listar o diretório:', error.message);
    return [];
  }
}

function goBack(currentPath) {
  try {
    const previousPath = path.dirname(currentPath);
    if (fs.existsSync(previousPath)) {
      return previousPath;
    }
    return currentPath;
  } catch (error) {
    console.error('Erro ao voltar ao diretório anterior:', error.message);
    return currentPath;
  }
}

module.exports = { listDirectory, goBack };
