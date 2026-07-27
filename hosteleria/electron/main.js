const { app, BrowserWindow, Menu } = require('electron');
app.commandLine.appendSwitch('js-flags', '--experimental-sqlite');
let mainWindow;
function startServer() {
  try { require('../server.js'); } catch(e) { console.error(e); }
}
function createWindow() {
  mainWindow = new BrowserWindow({
    width:1280, height:800, title:'TPV Hostelería', backgroundColor:'#0f0e0c',
    webPreferences:{ nodeIntegration:false, contextIsolation:true },
    autoHideMenuBar:true,
  });
  Menu.setApplicationMenu(null);
  setTimeout(() => mainWindow.loadURL('http://localhost:3000/tpv'), 800);
  mainWindow.on('closed', () => { mainWindow = null; });
}
app.whenReady().then(() => { startServer(); createWindow(); });
app.on('window-all-closed', () => { if(process.platform!=='darwin') app.quit(); });
