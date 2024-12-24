  const path = require('path');
  const mime = require('mime-types');
  const emoji = require('emoji-cli');

  const icons = {
    'default': emoji.get('page_facing_up'),
    'folder': '[DIR]',
    '.txt': '[TXT]',
    '.jpg': '[IMG]',
    '.jpeg': '[IMG]',
    '.png': '[IMG]',
    '.gif': '[IMG]',
    '.pdf': '[PDF]',
    '.zip': '[ZIP]',
    '.tar': '[TAR]',
    '.gz': '[GZ]',
    '.rar': '[RAR]',
    '.js': '[JS]',
    '.jar': '[JAR]',
    '.html': '[HTML]',
    '.htm': '[HTML]',
    '.css': '[CSS]',
    '.mp3': '[MP3]',
    '.wav': '[WAV]',
    '.mp4': '[MP4]',
    '.mkv': '[MKV]',
    '.avi': '[AVI]'
  };

  function getIcon(filePath, isDirectory) {
    if (isDirectory) {
      return icons['folder'];
    }
    const ext = path.extname(filePath).toLowerCase();
    return icons[ext] || getMimeTypeIcon(filePath) || icons['default'];
  }

  function getMimeTypeIcon(filePath) {
    const mimeType = mime.lookup(filePath);
    if (mimeType) {
      if (mimeType.startsWith('video')) {
        return '[VIDEO]';
      }
      if (mimeType.startsWith('audio')) {
        return '[AUDIO]';
      }
      if (mimeType.startsWith('image')) {
        return '[IMAGE]';
      }
    }
    return null;
  }

  module.exports = { getIcon };
