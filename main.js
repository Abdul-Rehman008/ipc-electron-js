const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require("path");
// require for electron api
// const isDev = require('electron-is-dev');
// const AutoLaunch = require('auto-launch');
const { powerSaveBlocker } = require('electron')
const electron = require('electron')

const menuItems = [
  {
    label: "Menu",
    submenu: [
      {
        label: "About",
      },
    ],
  },
  {
    label: "File",
    submenu: [
      {
        label: "Open Camera",
        click: async () => {
          const win2 = new BrowserWindow({
            height: 500,
            width: 800,
            show: false,
            webPreferences: {
              preload: path.join(__dirname, "window2Preload.js"),
            },
          });

          ipcMain.on("close-window-2", () => win2.close());

          // win2.webContents.openDevTools();
          win2.loadFile("window2.html");
          win2.once("ready-to-show", () => win2.show());
        },
      },
      {
        label: "Learn More",
        click: async () => {
          await shell.openExternal("https://bitfumes.com");
        },
      },
      {
        type: "separator",
      },
      {
        label: "Exit",
        click: () => app.quit(),
      },
    ],
  },
  {
    label: "Window",
    submenu: [
      {
        role: "Minimize",
      },
      {
        role: "close",
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(menuItems);
Menu.setApplicationMenu(menu);

const createWindow = () => {
  const win = new BrowserWindow({
    height: 500,
    width: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  ipcMain.on("set-image", (event, data) => {
    win.webContents.send("get-image", data);
  });

  // win.webContents.openDevTools();
  win.loadFile("index.html");
};

app.whenReady().then(() => {
  createWindow();
  electron.powerMonitor.on('lock-screen', () => {
    console.log('The system is going to sleep')
  });
  // using electron api
  /* 
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath("exe")
    }); 
    console.log("auto start application"); */

  // using node pack auto-lanuch

  /*  const meterAutoLauncher = new AutoLaunch({
     name: 'IPC-ELECTRON-JS',
     path: app.getPath("exe")
   });
 
   meterAutoLauncher.enable();
 
   meterAutoLauncher.isEnabled()
     .then(function (isEnabled) {
       if (isEnabled) {
         return;
       }
       meterAutoLauncher.enable();
     })
     .catch(function (err) {
       console.log(err)
     }); */
  //  for turn off app while sleep mode
  
  // const id = powerSaveBlocker.start('prevent-display-sleep')
  // console.log(!(powerSaveBlocker.isStarted(id)));
  // powerSaveBlocker.stop(id);  
  // console.log("the power is "+ !(powerSaveBlocker.stop(id)));
});

app.on("window-all-closed", () => {

  if (process.platform !== "darwin") app.quit();
  
});
