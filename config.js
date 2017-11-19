'use strict';

const ElectronStore = require('electron-store');

module.exports = new ElectronStore({
  defaults: {
    windowState: {
      width: 900,
      height: 600
    },
    alwaysOnTop: false,
  },
});
