

const { app, Menu, BrowserWindow } = require('electron');
const config = require('./config');

function getWindow() {
  const [win] = BrowserWindow.getAllWindows();

  if (process.platform === 'darwin') {
    win.restore();
  }

  return win;
}

function sendAction(action) {
  getWindow().webContents.send(action);
}

// function sendKeybinding(keyCode) {
// const win = getWindow();

// win.webContents.sendInputEvent({type:'char', keyCode });
// win.webContents.sendInputEvent({type:'keydown', keyCode });
// win.webContents.sendInputEvent({type:'keyup', keyCode});
// }

// @TODO: switch accouts
const template = [
  {
    label: app.getName(),
    submenu: [
      {
        role: 'about',
      },
      {
        type: 'separator',
      },
      {
        label: 'Preferences...',
        accelerator: 'Cmd+,',
        click() {
          // sendKeybinding('Shift+?');
          sendAction('show-preferences');
        },
      },
      {
        type: 'separator',
      },
      {
        role: 'services',
        submenu: [],
      },
      {
        type: 'separator',
      },
      {
        role: 'hide',
      },
      {
        role: 'hideothers',
      },
      {
        role: 'unhide',
      },
      {
        type: 'separator',
      },
      {
        role: 'quit',
      },
    ],
  },
  {
    role: 'editMenu',
  },
  {
    role: 'window',
    submenu: [
      {
        role: 'minimize',
      },
      {
        role: 'close',
      },
      {
        type: 'separator',
      },
      {
        role: 'front',
      },
      {
        role: 'togglefullscreen',
      },
      {
        type: 'separator',
      },
      {
        type: 'checkbox',
        label: 'Always on Top',
        accelerator: 'Cmd+Shift+T',
        checked: config.get('alwaysOnTop'),
        click(item, focusedWindow) {
          config.set('alwaysOnTop', item.checked);
          focusedWindow.setAlwaysOnTop(item.checked);
        },
      },
    ],
  },
];

module.exports = Menu.buildFromTemplate(template);
