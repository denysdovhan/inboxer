const ElectronStore = require('electron-store');

module.exports = new ElectronStore({
  defaults: {
    windowState: {
      width: 900,
      height: 600,
    },
    alwaysOnTop: false,
    showUnreadBadge: true,
    bounceDockIcon: false,
    flashWindowOnMessage: false,
    autoHideMenuBar: false,
    notify: {
      unread: true,
      snoozed: true,
      download: true,
      period: 2,
    },
    sendAnalytics: true,
    displayMigrationInfo: true,
  },
});
