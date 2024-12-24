const blessed = require('blessed');
const path = require('path');
const fs = require('fs');
const { listDirectory, goBack } = require('./navigate/index');

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
  if (fs.lstatSync(selectedPath).isDirectory()) {
    currentPath = selectedPath;
    updateFileList();
  } else {
    console.log('Arquivo selecionado:', selectedPath);
  }
});

screen.key(['q', 'C-c', 'escape'], () => process.exit(0));

screen.key(['space'], () => {
  const previousPath = goBack(currentPath);
  if (previousPath !== currentPath) {
    currentPath = previousPath;
    updateFileList();
  }
});

// Redimensionamento dinâmico
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
