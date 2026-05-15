const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
 
function createWindow() {
  global.mainWindow = new BrowserWindow({
    width: 420,
    height: 580,
    resizable: false,
    title: 'Wireless Mouse',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
 
  global.mainWindow.loadFile('app.html');
 
  global.mainWindow.on('closed', () => {
    global.mainWindow = null;
  });
}
 
app.whenReady().then(() => {
  require('./server'); // start WebSocket server
  createWindow();
});
 
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
 
app.on('activate', () => {
  if (global.mainWindow === null) createWindow();
});