const fs = require('fs');
const path = require('path');

function deleteItem(currentPath, itemName) {
  const itemPath = path.join(currentPath, itemName);

  try {
    const stats = fs.lstatSync(itemPath);

    if (stats.isDirectory()) {
      fs.rmdirSync(itemPath, { recursive: true });
    } else {
      fs.unlinkSync(itemPath);
    }

    console.log(`Item deleted: ${itemPath}`);
  } catch (error) {
    console.error(`Error deleting item: ${error.message}`);
  }
}

module.exports = { deleteItem };
