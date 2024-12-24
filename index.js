const blessed = require('blessed');
const path = require('path');
const { listDirectory, goBack } = require('./navigate/index');

const screen = blessed.screen({
  smartCSR: true,
  title: 'Ranger Clone'
});

const fileList = blessed.list({
  parent: screen,
  width: '100%',
  height: '100%',
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
  fileList.setItems(files.map(file => `${file.icon} ${file.name}`));
  screen.render();
}

fileList.on('select', (item, index) => {
  const selectedFile = files[index];
  const selectedPath = path.join(currentPath, selectedFile.name);
  if (selectedFile.isDirectory) {
    currentPath = selectedPath;
    files = listDirectory(currentPath);
    updateFileList();
  } else {
    console.log('Arquivo selecionado:', selectedPath);
  }
});

screen.key(['q', 'C-c'], () => process.exit(0));

screen.key(['space'], () => {
  currentPath = goBack(currentPath);
  files = listDirectory(currentPath);
  updateFileList();
});

updateFileList();
screen.render();
