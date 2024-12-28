const blessed = require('blessed');
const path = require('path');
const fs = require('fs');

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

function handleDelete(screen, fileList, currentPath, updateFileList) {
  screen.key(['d'], () => {
    const selectedIndex = fileList.selected;
    const selectedFile = fileList.getItem(selectedIndex).content.trim().split(' ').slice(1).join(' ');
    if (selectedFile) {
      const deleteModal = blessed.question({
        parent: screen,
        left: 'center',
        top: 'center',
        width: '50%',
        height: 'shrink',
        label: 'Delete File/Directory',
        border: 'line',
        style: {
          fg: 'white',
          bg: 'black',
          border: {
            fg: 'red'
          },
          hover: {
            bg: 'green'
          }
        },
        keys: true
      });

      deleteModal.ask(`Are you sure you want to delete ${selectedFile}? (Enter to confirm, Backspace to cancel)`, (err, confirmed) => {
        if (err || !confirmed) return;

        deleteItem(currentPath, selectedFile);
        updateFileList();
        deleteModal.destroy(); 
        screen.render();
      });
      deleteModal.key('escape', () => {
        deleteModal.destroy();
        screen.render();
      });

      screen.render();
    }
  });
}

module.exports = { deleteItem, handleDelete };
