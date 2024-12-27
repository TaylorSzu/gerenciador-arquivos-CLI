const fs = require('fs');
const path = require('path');

function renameItem(currentPath, oldName, newName) {
  try {
    const oldPath = path.join(currentPath, oldName);
    const newPath = path.join(currentPath, newName);
    fs.renameSync(oldPath, newPath);
    console.log(`Renomeado de ${oldName} para ${newName}`);
  } catch (error) {
    console.error('Erro ao renomear:', error.message);
  }
}

module.exports = { renameItem };
