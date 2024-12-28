const path = require('path');
const fs = require('fs');
const { listDirectory, goBack } = require('./navigate/index');
const { createScreen, createDirLabel, createFileList } = require('./views/render');
const { handleRename } = require('./actions/rename');
const { handleDelete } = require('./actions/delete');

const screen = createScreen();
const dirLabel = createDirLabel();
const fileList = createFileList();

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
      console.log('Arquivo selecionado:', selectedPath);
    }
  } catch (error) {
    console.error('Erro ao acessar o caminho:', error.message);
  }
});

screen.key(['q', 'C-c'], () => process.exit(0));

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

// Utilizando a função handleRename e handleDelete
handleRename(screen, fileList, currentPath, updateFileList);
handleDelete(screen, fileList, currentPath, updateFileList);

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
