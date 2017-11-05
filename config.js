'use strict';

const ElectronStore = require('electron-store');

module.exports = new ElectronStore({
  defaults: {
    windowState: {
      width: 800,
      height: 600
    },
  },
});
