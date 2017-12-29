const { app, shell, Menu } = require('electron');
const pkg = require('../../package');
const {
  isDarwin, isWindows, sendAction, sendKeybinding,
} = require('./utils');
const config = require('./config');
const report = require('./report');

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
          config.set('autoHideMenuBar', !menuItem.checked);
          focusedWindow.setAutoHideMenuBar(menuItem.checked);
          focusedWindow.setMenuBarVisibility(!menuItem.checked);
        },
      },
      {
        label: 'Preferences…',
        accelerator: 'Cmd+,',
        click(menuItem, focusedWindow) {
          sendAction(focusedWindow, 'show-preferences');
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
    label: 'File',
    submenu: [
      {
        label: 'Compose Message',
        accelerator: 'CmdOrCtrl+N',
        click(menuItem, focusedWindow) {
          sendKeybinding(focusedWindow, 'c');
        },
      },
      {
        label: 'Create Reminder',
        accelerator: 'Shift+CmdOrCtrl+N',
        click(menuItem, focusedWindow) {
          sendKeybinding(focusedWindow, 't');
        },
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Go to Inbox',
        accelerator: 'CmdOrCtrl+I',
        click(menuItem, focusedWindow) {
          sendAction(focusedWindow, 'go-to-inbox');
        },
      },
      {
        label: 'Go to Shoozed',
        accelerator: 'CmdOrCtrl+S',
        click(menuItem, focusedWindow) {
          sendAction(focusedWindow, 'go-to-shoozed');
        },
      },
      {
        label: 'Go to Done',
        accelerator: 'CmdOrCtrl+D',
        click(menuItem, focusedWindow) {
          sendAction(focusedWindow, 'go-to-done');
        },
      },
      {
        type: 'separator',
      },
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
        label: 'Reminders',
        accelerator: 'CmdOrCtrl+Shift+R',
        click(menuItem, focusedWindow) {
          sendAction(focusedWindow, 'go-to-reminders');
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
      {
        type: 'separator',
      },
      {
        label: 'Search…',
        accelerator: 'CmdOrCtrl+F',
        click(menuItem, focusedWindow) {
          sendAction(focusedWindow, 'go-to-search');
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Toggle Sidebar',
        accelerator: 'CmdOrCtrl+/',
        click(menuItem, focusedWindow) {
          sendAction(focusedWindow, 'toggle-sidebar');
        },
      },
    ],
  },
  {
    role: 'editMenu',
  },
  {
    label: 'List',
    submenu: [
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
      {
        type: 'separator',
      },
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
      {
        type: 'separator',
      },
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
    ],
  },
  {
    label: 'Item',
    submenu: [
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
      {
        type: 'separator',
      },
      {
        label: 'Snooze',
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
      {
        type: 'separator',
      },
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
      {
        type: 'separator',
      },
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
        label: 'Mute',
        click(menuItem, focusedWindow) {
          sendKeybinding(focusedWindow, 'm');
        },
      },
      {
        label: 'Move to…',
        click(menuItem, focusedWindow) {
          sendKeybinding(focusedWindow, '.');
        },
      },
      {
        label: 'Select…',
        click(menuItem, focusedWindow) {
          sendKeybinding(focusedWindow, 'x');
        },
      },
    ],
  },
  // @FIXME: Shift keybindings do not work.
  // https://stackoverflow.com/q/47378160/5508862
  // {
  //   label: 'Format',
  //   submenu: [
  //     {
  //       label: 'Bold',
  //       accelerator: 'CommandOrControl+B',
  //       click() {
  //         // ...
  //       },
  //     },
  //     // ...
  //   ],
  // },
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
        accelerator: 'CmdOrCtrl+Shift+T',
        checked: config.get('alwaysOnTop'),
        click(menuItem, focusedWindow) {
          config.set('alwaysOnTop', menuItem.checked);
          focusedWindow.setAlwaysOnTop(menuItem.checked);
        },
      },
    ],
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Keyboard Shortcuts Reference',
        accelerator: ['Shift+/', '?'],
        click(menuItem, focusedWindow) {
          sendKeybinding(focusedWindow, '?');
        },
      },
      {
        type: 'separator',
      },
      {
        label: `${app.getName()} Website`,
        click() {
          shell.openExternal(pkg.homepage);
        },
      },
      {
        label: 'Report an Issue…',
        click() {
          shell.openExternal(`${pkg.bugs.url}/new?body=${encodeURIComponent(report)}`);
        },
      },
      {
        type: 'separator',
      },
      {
        label: 'Toggle Developer Tools',
        type: 'checkbox',
        accelerator: isDarwin ? 'Option+Cmd+I' : 'Ctrl+Shift+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        },
      },
    ],
  },
];

module.exports = Menu.buildFromTemplate(template);
