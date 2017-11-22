const fs = require('fs');
const path = require('path');
const {
  app, BrowserWindow, Menu, shell,
} = require('electron');
const minimatch = require('minimatch-all');
const config = require('./config');
const appMenu = require('./menu');

app.setAppUserModelId('com.denysdovhan.inboxer');

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

function allowedUrl(url) {
  const urls = [
    'https://accounts.google.com/@(u|AddSession|ServiceLogin|CheckCookie|Logout){**/**,**}',
    'https://accounts.google.com/signin/usernamerecovery**',
    'http://www.google.*/accounts/Logout2**',
    'https://inbox.google.com{**/**,**}',
    'https://{accounts.youtube,inbox.google}.com/accounts/@(SetOSID|SetSID)**',
  ];

  return minimatch(url, urls);
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
    alwaysOnTop: config.get('alwaysOnTop'),
    icon: path.join(__dirname, 'Logo.png'),
    titleBarStyle: 'hidden-inset',
    webPreferences: {
      preload: path.join(__dirname, '..', 'renderer', 'browser.js'),
      nodeIntegration: false,
    },
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
  Menu.setApplicationMenu(appMenu);
  mainWindow = createMainWindow();

  const { webContents } = mainWindow;

  webContents.on('dom-ready', () => {
    webContents.insertCSS(fs.readFileSync(path.join(__dirname, '../renderer/browser.css'), 'utf8'));

    mainWindow.show();
  });

  webContents.on('will-navigate', (e, url) => {
    if (!allowedUrl(url)) {
      e.preventDefault();
      shell.openExternal(url);
    }
  });

  webContents.on('new-window', (e, url) => {
    e.preventDefault();
    if (allowedUrl(url)) {
      webContents.loadURL(url);
      return;
    }
    shell.openExternal(url);
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
