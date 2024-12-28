const blessed = require('blessed');
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

function handleRename(screen, fileList, currentPath, updateFileList) {
  screen.key(['r'], () => {
    const selectedIndex = fileList.selected;
    const selectedFile = fileList.getItem(selectedIndex).content.trim().split(' ').slice(1).join(' ');
    if (selectedFile) {
      const oldName = selectedFile;
      const renamePrompt = blessed.prompt({
        parent: screen,
        left: 'center',
        top: 'center',
        width: '50%',
        height: 'shrink',
        label: 'Rename File/Directory',
        border: 'line',
        style: {
          fg: 'white',
          bg: 'black',
          border: {
            fg: 'blue'
          },
          hover: {
            bg: 'green'
          }
        },
        keys: true
      });
      renamePrompt.input('Enter new name:', '', (err, newName) => {
        if (newName) {
          renameItem(currentPath, oldName, newName);
          updateFileList();
        }
        renamePrompt.destroy();
        screen.render();
      });

      renamePrompt.key('backspace', () => {
        renamePrompt.destroy();
        screen.render();
      });

      screen.render();
    }
  });
}

module.exports = { renameItem, handleRename };
