const path = require('path');
const { app, Tray, Menu } = require('electron');
const { isDarwin, sendAction } = require('./utils');

const iconTrayPath = path.join(__dirname, '..', 'static/IconTray.png');
const iconTrayUnreadPath = path.join(__dirname, '..', 'static/IconTrayUnread.png');

let tray = null;

const contextMenu = focusedWindow => ([
  {
    label: 'Go to Inbox',
    click() {
      sendAction(focusedWindow, 'go-to-inbox');
    },
  },
  {
    label: 'Go to Shoozed',
    click() {
      sendAction(focusedWindow, 'go-to-shoozed');
    },
  },
  {
    label: 'Go to Done',
    click() {
      sendAction(focusedWindow, 'go-to-done');
    },
  },
  {
    type: 'separator',
  },
  {
    label: 'Sign Out',
    click() {
      sendAction(focusedWindow, 'sign-out');
    },
  },
  {
    type: 'separator',
  },
  {
    role: 'quit',
  },
]);

function create(win) {
  // if (isDarwin || tray) return;
  if (tray) return;

  tray = new Tray(iconTrayPath);
  tray.setToolTip(app.getName());
  tray.setContextMenu(Menu.buildFromTemplate(contextMenu(win)));

  tray.on('click', () => (win.isVisible() ? win.hide() : win.show()));
}

function setBadge(shouldDisplayUnread) {
  if (isDarwin || !tray) return;

  tray.setImage(shouldDisplayUnread ? iconTrayUnreadPath : iconTrayPath);
}

module.exports = {
  create,
  setBadge,
};
