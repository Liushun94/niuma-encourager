const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('niuma', {
  minimize: () => ipcRenderer.send('win:minimize'),
  close: () => ipcRenderer.send('win:close'),
  togglePin: () => ipcRenderer.invoke('win:toggle-pin'),
  platform: process.platform,
});
