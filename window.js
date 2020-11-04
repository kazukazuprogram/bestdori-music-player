const { app, BrowserWindow, Tray, Menu } = require('electron');
var Positioner = require('electron-positioner')
let positioner = null;
let mainWindow = null;
let tray = null;
const dev = true;
// const path = require('path')
// const fs = require('fs')

// function addext() {
//   const id = "fmkadmapgofadopljbjfkapdkoienihi"
//   const extensionDir = path.join(process.env.LOCALAPPDATA, "Google", "Chrome", "User Data", "Default", "Extensions")
//   const versions = fs.readdirSync(path.join(extensionDir, id)).sort()
//   const version = versions.pop()
//   const extdir = path.join(extensionDir, id, version)
//   BrowserWindow.addDevToolsExtension(extdir)
// }
const { default: installExtension, REACT_DEVELOPER_TOOLS } = require('electron-devtools-installer');

app.on('ready', () => {
  // installExtension(REACT_DEVELOPER_TOOLS)
  //   .then((name) => console.log(`Added Extension:  ${name}`))
  //   .catch((err) => console.log('An error occurred: ', err));
  iconPath = __dirname + "/favicon.ico"
  mainWindow = new BrowserWindow({
    width: 360,
    height: 480,
    icon: iconPath,
    frame: false,
    skipTaskbar: true,
    resizable: false,
    movable: false,
    alwaysOnTop: true,
    minimizable: false,
    maximizable: false,
    show: dev,
    webPreferences: {
      webSecurity: false
    }
  });
  positioner = new Positioner(mainWindow)
  positioner.move('bottomRight')
  mainWindow.getBounds
  mainWindow.loadURL('http://localhost:3000/');
  mainWindow.openDevTools();
  mainWindow.on('closed', () => {
    mainWindow = null
  });
  tray = new Tray(iconPath);
  tray.setToolTip("Bestdori music player.")
  if (!dev) {
    mainWindow.on("blur", () => mainWindow.hide())
    tray.on("click", () => mainWindow.show())
  }
});
