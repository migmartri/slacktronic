// @flow
import { app, BrowserWindow, Tray, nativeImage, Menu } from 'electron';
import path from 'path';

export default class TrayMenuBuilder {
  mainWindow: BrowserWindow;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  buildMenu() {
    let trayIcon = path.join(__dirname, '../resources/icon.png');
    if (process.platform === 'darwin') {
      trayIcon = path.join(__dirname, '../resources/icon.icns');
    } else if (process.platform === 'win32') { // This is also win64
      trayIcon = path.join(__dirname, '../resources/icon.ico');
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

    const tray = new Tray(nimage);
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
