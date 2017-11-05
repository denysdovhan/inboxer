'use strict';

const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const config = require('./config');

app.setAppUserModelId('com.denysdovhan.inboxer');
app.disableHardwareAcceleration();

require('electron-dl')();
require('electron-context-menu')();

const mainURL = 'https://inbox.google.com/';

let mainWindow;
let isQuitting = false;

const isRunning = app.makeSingleInstance(() => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) {
      mainWindow.restore();
    }
    mainWindow.focus();
  }
});

if (isRunning) {
  app.quit();
}

function createMainWindow() {
  const windowState = config.get('windowState');

  const win = new BrowserWindow({
    title: app.getName(),
    x: windowState.x,
    y: windowState.y,
    width: windowState.width,
    height: windowState.height,
    minWidth: 890,
    minHeight: 400,
    icon: path.join(__dirname, 'Logo.png'),
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      preload: path.join(__dirname, 'browser.js'),
      nodeIntegration: false,
      plugins: true
    }
  });

  if (process.platform === 'darwin') {
    win.setSheetOffset(40);
  }

  win.loadURL(mainURL);

  win.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      app.hide();
    }
  });

  return win;
}

app.on('ready', () => {
  mainWindow = createMainWindow();

  const { webContents } = mainWindow;

  webContents.on('dom-ready', () => {
    webContents.insertCSS(fs.readFileSync(path.join(__dirname, 'browser.css'), 'utf8'));

    mainWindow.show();
  });
});

app.on('activate', () => {
  mainWindow.show();
});

app.on('before-quit', () => {
  isQuitting = true;

  if (!mainWindow.isFullScreen()) {
    config.set('windowState', mainWindow.getBounds());
  }
});