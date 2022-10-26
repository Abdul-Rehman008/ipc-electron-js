const { app, BrowserWindow, Menu, shell, ipcMain } = require("electron");
const path = require("path");
const isDev = require('electron-is-dev');
// const AutoLaunch = require('auto-launch');

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

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});


if (!isDev) {
  app.setLoginItemSettings({
    openAtLogin: true,
  });
  
  console.log("auto start application");
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});


/* const meterAutoLauncher = new AutoLaunch({
  name: 'Minecraft',
  path: '/Applications/Minecraft.app',
});

meterAutoLauncher.enable();

//minecraftAutoLauncher.disable();


meterAutoLauncher.isEnabled()
  .then(function (isEnabled) {
    if (isEnabled) {
      return;
    }
    meterAutoLauncher.enable();
  })
  .catch(function (err) {
    // handle error
  });
 */