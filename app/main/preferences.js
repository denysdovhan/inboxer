const path = require('path');
const { BrowserWindow } = require('electron');

let preferencesWindow = null;

function createPreferencesWindow() {
  const preferencesPath = path.join('file://', __dirname, '../renderer/preferences/index.html');
  preferencesWindow = new BrowserWindow({
    width: 600,
    height: 400,
    icon: path.join(__dirname, '..', 'static/Icon.png'),
    title: 'Preferences',
  });

  preferencesWindow.on('close', () => {
    preferencesWindow = null;
  });

  preferencesWindow.setResizable(false);
  preferencesWindow.setSkipTaskbar(true);
  preferencesWindow.setMenu(null);
  preferencesWindow.loadURL(preferencesPath);
}

module.exports = {
  showPreferencesWindow() {
    if (!preferencesWindow) createPreferencesWindow();
  },
};
