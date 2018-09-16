// @flow
import { app, BrowserWindow, Tray, nativeImage, Menu } from 'electron';
import path from 'path';

// Keep a global reference of the tray icon to avoid problems with garbage collector
let tray: ?Tray = null;

export default class TrayMenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    let trayIcon = path.join(__dirname, '../resources/icons/tray/default.png');
    if (process.platform === 'darwin') {
      trayIcon = path.join(__dirname, '../resources/icons/tray/mac.png');
    } else if (process.platform === 'win32') { // This is also win64
      trayIcon = path.join(__dirname, '../resources/icons/tray/windows.ico');
    }

    const nimage = nativeImage.createFromPath(trayIcon);

    const contextMenu = Menu.buildFromTemplate([
      { label: 'Show App', click: () => this.mainWindow.show() },
      {
        label: 'Quit',
        click: () => {
          app.isQuiting = true;
          app.quit();
        }
      }
    ]);

    tray = new Tray(nimage);
    tray.setContextMenu(contextMenu);

    this.mainWindow.on('close', (event) => {
      if (!this.mainWindow) {
        throw new Error('"mainWindow" is not defined');
      }

      if (!app.isQuiting) {
        event.preventDefault();
        this.mainWindow.hide();
      }
    });
  }
}
