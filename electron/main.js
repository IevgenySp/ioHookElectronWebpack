import { app, BrowserWindow, ipcMain, screen, protocol, Menu, globalShortcut  } from "electron";
import * as path from "path";
import * as url from 'url';
import log from "electron-log";

// Add iohook functionality to main electron process
import ioHook from 'iohook';

ioHook.on('mousemove', event => {
  //console.log(event); // { type: 'mousemove', x: 700, y: 400 }
  mainWindow.webContents.send('mousemove', event);
});

ioHook.on('mouseclick', event => {
  mainWindow.webContents.send('mouseclick', event);
});

// Register and start hook
ioHook.start();

const args = process.argv.slice(1),
  serve = args.some(val => val === '--serve');

let mainWindow  = null;

function createWindow() {
  const size = screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: 200,
    y: 200,
    width: /*320*/ /*800*/ 640,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false,
      enableRemoteModule : true,
      devTools: true
    },
  });

  mainWindow.setAlwaysOnTop(true, 'floating');
  mainWindow.setVisibleOnAllWorkspaces(true);
  mainWindow.setFullScreenable(false);

  if (serve) {
    //mainWindow.webContents.openDevTools();
    mainWindow.loadFile(path.join(__dirname, "./../src/index.html"));

  } else {
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, './../src/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  /**
   * Need to deal with Electron bug when window not closing wit open developer tools
   * And frame mode set to false. False frame mode needed wor default window tilebar
   */
  mainWindow.on('close', () => {
    ioHook.stop();

    if (mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.webContents.closeDevTools()
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });

  return mainWindow;
}

// IMPORTANT: option should be set to false to make it possible for ioHook global event
// tracker boundaries works correctly.
app.allowRendererProcessReuse = false;

app.on("ready", async () => {
  try {
    globalShortcut.register('Control+Shift+I', () => {
      if (mainWindow.webContents.isDevToolsOpened()) {
        mainWindow.webContents.closeDevTools()
      } else {
        mainWindow.webContents.openDevTools();
      }
    });

    //protocol.interceptFileProtocol('file', (request, callback) => {
      //const url = request.url.substr(7)    /* all urls start with 'file://' */
      //callback({ path: path.normalize('${__dirname}/${url}')})
    //});

    // Name the protocol whatever you want
    const protocolName = 'safe-file-protocol';

    // NEEDED FOR PROPER IMAGES LOADING
    protocol.registerFileProtocol(protocolName, (request, callback) => {
      const url = request.url.replace(`${protocolName}://`, '');
      try {
        return callback(decodeURIComponent(url))
      } catch (error) {
        // Handle the error as needed
        log.error(error)
      }
    });

    createWindow();
  } catch (error) {
    log.error(error);
    ioHook.stop();
    app.quit();
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    ioHook.stop();
    app.quit();
  }
});
