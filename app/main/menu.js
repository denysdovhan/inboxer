const path = require('path');
const {
  app, shell, dialog, Menu,
} = require('electron');
const pkg = require('../../package');
const {
  isDarwin, isWindows, sendAction, sendKeybinding,
} = require('./utils');
const config = require('./config');
const report = require('./report');
const preferences = require('./preferences');

const settingsItems = [
  {
    label: 'Show Unread Badge',
    type: 'checkbox',
    checked: config.get('showUnreadBadge'),
    click(menuItem) {
      config.set('showUnreadBadge', menuItem.checked);
    },
  },
  {
    label: 'Bounce Dock on Notification',
    type: 'checkbox',
    checked: config.get('bounceDockIcon'),
    visible: isDarwin,
    click(menuItem) {
      config.set('bounceDockIcon', menuItem.checked);
    },
  },
  {
    label: 'Flash Window on Message',
    type: 'checkbox',
    checked: config.get('flashWindowOnMessage'),
    visible: isWindows,
    click(menuItem) {
      config.set('flashWindowOnMessage', menuItem.checked);
    },
  },
  {
    label: 'Auto Hide Menu Bar',
    type: 'checkbox',
    checked: config.get('autoHideMenuBar'),
    visible: !isDarwin,
    click(menuItem, focusedWindow) {
      config.set('autoHideMenuBar', menuItem.checked);
      focusedWindow.setAutoHideMenuBar(menuItem.checked);
      focusedWindow.setMenuBarVisibility(!menuItem.checked);
    },
  },

  // NOTE: Account Preferences instead of Preferences (for Inboxer Preferences)

  {
    label: 'Account Preferences',
    accelerator: 'CmdOrCtrl+,',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'show-preferences');
    },
  },

  // TODO: Create Preferences window

  {
    label: 'Preferences',
    accelerator: 'CmdOrCtrl+P',
    click() {
      preferences.showPreferencesWindow();
    },
  },
];

// TODO: Switch accounts
const accountItems = [
  {
    label: 'Add Account',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'add-account');
    },
  },
  {
    label: 'Sign Out',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'sign-out');
    },
  },
];

const fileItems = [
  {
    label: 'Compose Message',
    accelerator: 'CmdOrCtrl+N',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'c');
    },
  },
];

const viewItems = [
  {
    label: 'Go to Inbox',
    accelerator: 'CmdOrCtrl+I',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-inbox');
    },
  },
  {
    label: 'Go to Snoozed',
    accelerator: 'CmdOrCtrl+S',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-snoozed');
    },
  },
  {
    label: 'Go to Done',
    accelerator: 'CmdOrCtrl+D',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-done');
    },
  },
  { type: 'separator' },
  {
    label: 'Drafts',
    accelerator: 'CmdOrCtrl+Shift+D',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-drafts');
    },
  },
  {
    label: 'Sent',
    accelerator: 'CmdOrCtrl+Shift+S',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-sent');
    },
  },
  {
    label: 'Trash',
    accelerator: 'Alt+Shift+T',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-trash');
    },
  },
  {
    label: 'Spam',
    accelerator: 'Alt+Shift+S',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-spam');
    },
  },
  {
    label: 'Contacts',
    accelerator: 'CmdOrCtrl+Shift+C',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-contacts');
    },
  },
  { type: 'separator' },
  {
    label: 'Search…',
    accelerator: 'CmdOrCtrl+F',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'go-to-search');
    },
  },
  { type: 'separator' },
  {
    label: 'Toggle Sidebar',
    accelerator: 'CmdOrCtrl+/',
    click(menuItem, focusedWindow) {
      sendAction(focusedWindow, 'toggle-sidebar');
    },
  },
];

const editItems = [
  { role: 'undo' },
  { role: 'redo' },
  { type: 'separator' },
  { role: 'cut' },
  { role: 'copy' },
  { role: 'paste' },
  { role: 'delete' },
  { type: 'separator' },
  { role: 'selectall' },
  { type: 'separator' },
];

const listItems = [
  {
    label: 'Open',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'o');
    },
  },
  {
    label: 'Close',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'u');
    },
  },
  { type: 'separator' },
  {
    label: 'Next Item',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'j');
    },
  },
  {
    label: 'Previous Item',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'k');
    },
  },
  {
    label: 'First Item',
    accelerator: 'Home',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'Home');
    },
  },
  { type: 'separator' },
  {
    label: 'Next Message',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'n');
    },
  },
  {
    label: 'Previous Message',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'p');
    },
  },
];

const itemItems = [
  {
    label: 'Mark Done',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'e');
    },
  },
  {
    label: 'Mark Done and Forward',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, '[');
    },
  },
  {
    label: 'Mark Done and Backward',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, ']');
    },
  },
  { type: 'separator' },
  {
    label: 'Snooze',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'b');
    },
  },
  {
    label: 'Star',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 's');
    },
  },
  // {
  //   label: 'Pin',
  //   click(menuItem, focusedWindow) {
  //     sendKeybinding(focusedWindow, 'Shift+p');
  //   },
  // },
  { type: 'separator' },
  {
    label: 'Reply',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'r');
    },
  },
  // {
  //   label: 'Reply in a new window',
  //   click(menuItem, focusedWindow) {
  //     sendKeybinding(focusedWindow, 'Shift+r');
  //   },
  // },
  {
    label: 'Reply All',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'a');
    },
  },
  // {
  //   label: 'Reply all in a new window',
  //   click(menuItem, focusedWindow) {
  //     sendKeybinding(focusedWindow, 'Shift+a');
  //   },
  // },
  {
    label: 'Forward',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'f');
    },
  },
  { type: 'separator' },
  {
    label: 'Trash',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, '#');
    },
  },
  {
    label: 'Report as Spam',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, '!');
    },
  },
  {
    label: 'Mute',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'm');
    },
  },
  {
    label: 'Move to…',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'v');
    },
  },
  {
    label: 'Select…',
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, 'x');
    },
  },
];

const windowItems = [
  {
    type: 'checkbox',
    label: 'Always on Top',
    accelerator: 'CmdOrCtrl+Shift+T',
    checked: config.get('alwaysOnTop'),
    click(menuItem, focusedWindow) {
      config.set('alwaysOnTop', menuItem.checked);
      focusedWindow.setAlwaysOnTop(menuItem.checked);
    },
  },
];

const helpItems = [
  {
    label: 'Keyboard Shortcuts Reference',
    accelerator: ['Shift+/', '?'],
    click(menuItem, focusedWindow) {
      sendKeybinding(focusedWindow, '?');
    },
  },
  { type: 'separator' },
  {
    label: `${app.getName()} Website`,
    click() {
      shell.openExternal(pkg.homepage);
    },
  },
  {
    label: 'Source Code',
    click() {
      shell.openExternal('https://github.com/denysdovhan/inboxer');
    },
  },
  {
    label: 'Report an Issue…',
    click() {
      shell.openExternal(`${pkg.bugs.url}/new?body=${encodeURIComponent(report)}`);
    },
  },
  { type: 'separator' },
  {
    label: 'Toggle Developer Tools',
    type: 'checkbox',
    accelerator: isDarwin ? 'Option+Cmd+I' : 'Ctrl+Shift+I',
    click(item, focusedWindow) {
      focusedWindow.toggleDevTools();
    },
  },
];

const darwinTemplate = [
  {
    label: app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      ...settingsItems,
      { type: 'separator' },
      {
        role: 'services',
        submenu: [],
      },
      { type: 'separator' },
      ...accountItems,
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'File',
    submenu: fileItems,
  },
  {
    label: 'View',
    submenu: viewItems,
  },
  {
    label: 'Edit',
    submenu: editItems,
  },
  {
    label: 'List',
    submenu: listItems,
  },
  {
    label: 'Item',
    submenu: itemItems,
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
      { type: 'separator' },
      { role: 'front' },
      { role: 'togglefullscreen' },
      { type: 'separator' },
      ...windowItems,
    ],
  },
  {
    role: 'help',
    submenu: helpItems,
  },
];

const otherTemplate = [
  {
    label: 'File',
    submenu: [
      ...fileItems,
      { type: 'separator' },
      ...accountItems,
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'View',
    submenu: [
      ...viewItems,
      ...windowItems,
    ],
  },
  {
    label: 'Edit',
    submenu: [...editItems, ...settingsItems],
  },
  {
    label: 'List',
    submenu: listItems,
  },
  {
    label: 'Item',
    submenu: itemItems,
  },
  {
    role: 'help',
    submenu: [
      ...helpItems,
      { type: 'separator' },
      {
        role: 'about',
        click() {
          dialog.showMessageBox({
            title: `About ${app.getName()}`,
            message: `${app.getName()} ${app.getVersion()}`,
            detail: `Created by ${pkg.author.name}`,
            icon: path.join(__dirname, '..', 'static/Icon.png'),
          });
        },
      },
    ],
  },
];

module.exports = Menu.buildFromTemplate(isDarwin ? darwinTemplate : otherTemplate);
