const fs = require('fs');
const path = require('path');

function deleteItem(currentPath, itemName) {
  try {
    const itemPath = path.join(currentPath, itemName);
    if (fs.lstatSync(itemPath).isDirectory()) {
      fs.rmdirSync(itemPath, { recursive: true });
    } else {
      fs.unlinkSync(itemPath);
    }
  } catch (error) {
    console.error('Erro ao deletar:', error.message);
  }
}

module.exports = { deleteItem };
