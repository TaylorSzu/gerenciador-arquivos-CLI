const fs = require('fs');
const path = require('path');
const { getIcon } = require('./icons');

function listDirectory(currentPath) {
  try {
    const files = fs.readdirSync(currentPath);
    return files.map(file => {
      const filePath = path.join(currentPath, file);
      const stats = fs.statSync(filePath);
      const icon = getIcon(filePath, stats.isDirectory());
      console.log(`File: ${file}, Icon: ${icon}`); // Adicionado para depuração

      return {
        name: file,
        isDirectory: stats.isDirectory(),
        icon: icon
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
