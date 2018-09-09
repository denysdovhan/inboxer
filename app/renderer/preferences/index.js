const { remote } = require('electron');

const config = remote.require('../../app/main/config');

const PreferencesWindow = {};

PreferencesWindow.savePreferencesButton = document.querySelector('#savePreferencesButton');
PreferencesWindow.sendAnalyticsCheckbox = document.querySelector('#sendAnalyticsCheckbox');

PreferencesWindow.setEventListeners = () => {
  const self = this;
  this.savePreferencesButton.addEventListener('click', () => {
    config.set('sendAnalytics', self.sendAnalyticsCheckbox.checked);
    remote.getCurrentWindow().close();
  });
};

PreferencesWindow.init = () => {
  this.sendAnalyticsCheckbox.checked = config.get('sendAnalytics');
  PreferencesWindow.setEventListeners();
};

window.addEventListener('DOMContentLoaded', () => {
  PreferencesWindow.init();
});
