const blessed = require('blessed');

function createScreen() {
  return blessed.screen({
    smartCSR: true,
    title: 'Ranger Clone'
  });
}

function createDirLabel() {
  return blessed.box({
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
}

function createFileList() {
  return blessed.list({
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
}

module.exports = {
  createScreen,
  createDirLabel,
  createFileList
};
