const blessed = require('blessed');
const path = require('path');
const fs = require('fs');
const { listDirectory, goBack } = require('./navigate/index');
const { renameItem } = require('./actions/rename');
const { deleteItem } = require('./actions/delete');

const screen = blessed.screen({
  smartCSR: true,
  title: 'Ranger Clone'
});

const dirLabel = blessed.box({
  top: 0,
  left: 'left',
  width: '100%',
  height: 1,
  content: '',
  tags: true,
  style: {
    fg: 'white',
    bg: 'blue'
  }
});

const fileList = blessed.list({
  parent: screen,
  top: 1,
  left: 0,
  width: '100%',
  height: '100%-1',
  keys: true,
  vi: true,
  mouse: true,
  border: 'line',
  scrollbar: {
    ch: ' ',
    inverse: true
  },
  style: {
    selected: {
      bg: 'blue'
    }
  }
});

let currentPath = process.cwd();
let files = listDirectory(currentPath);

function updateFileList() {
  dirLabel.setContent(` Current Directory: ${currentPath} `);
  files = listDirectory(currentPath);
  const items = files.map(file => `${file.icon} ${file.name}`);
  fileList.setItems(items);
  screen.render();
}

fileList.on('select', (item, index) => {
  const selectedFile = files[index];
  const selectedPath = path.join(currentPath, selectedFile.name);
  try {
    if (fs.lstatSync(selectedPath).isDirectory()) {
      currentPath = selectedPath;
      updateFileList();
    } else {
      
    }
  } catch (error) {
    console.error('Erro ao acessar o caminho:', error.message);
  }
});

screen.key(['escape', 'C-c'], () => process.exit(0));

screen.key(['space'], () => {
  try {
    const previousPath = goBack(currentPath);
    if (previousPath !== currentPath) {
      currentPath = previousPath;
      updateFileList();
    }
  } catch (error) {
    console.error('Erro ao voltar ao diretório anterior:', error.message);
  }
});

screen.key(['r'], () => {
  const selectedIndex = fileList.selected;
  const selectedFile = files[selectedIndex];
  if (selectedFile) {
    const oldName = selectedFile.name;
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
      }
    });
    renamePrompt.input('Enter new name:', '', (err, newName) => {
      if (newName) {
        renameItem(currentPath, oldName, newName);
        updateFileList();
      }
    });
  }
});

screen.key(['d'], () => {
  const selectedIndex = fileList.selected;
  const selectedFile = files[selectedIndex];
  if (selectedFile) {
    const itemName = selectedFile.name;
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

    deleteModal.ask(`Are you sure you want to delete ${itemName}? (Enter to confirm, Backspace to cancel)`, (err, confirmed) => {
      if (err || !confirmed) return;

      deleteItem(currentPath, itemName);
      updateFileList();
      deleteModal.destroy(); 
      screen.render();
    });
    deleteModal.key('backspace', () => {
      deleteModal.destroy();
      screen.render();
    });

    screen.render();
  }
});

screen.on('resize', () => {
  dirLabel.width = '100%';
  fileList.width = '100%';
  fileList.height = '100%-1';
  screen.render();
});

screen.append(dirLabel);
screen.append(fileList);
updateFileList();
screen.render();
