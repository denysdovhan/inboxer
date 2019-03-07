const { remote } = require('electron');

const config = remote.require('../../app/main/config');

const PreferencesWindow = {};

PreferencesWindow.savePreferencesButton = document.querySelector('#savePreferencesButton');
PreferencesWindow.sendAnalyticsCheckbox = document.querySelector('#sendAnalyticsCheckbox');
PreferencesWindow.notifyUnread = document.querySelector('#notifyUnread');
PreferencesWindow.notifySnoozed = document.querySelector('#notifySnoozed');
PreferencesWindow.notifyDownload = document.querySelector('#notifyDownload');
PreferencesWindow.notifyPeriod = document.querySelector('#notifyPeriod');

PreferencesWindow.setEventListeners = () => {
  const self = this;
  this.savePreferencesButton.addEventListener('click', () => {
    config.set('sendAnalytics', self.sendAnalyticsCheckbox.checked);
    config.set('notify.unread', self.notifyUnread.checked);
    config.set('notify.snoozed', self.notifySnoozed.checked);
    config.set('notify.download', self.notifyDownload.checked);
    config.set('notify.period', parseFloat(self.notifyPeriod.value));
    remote.getCurrentWindow().close();
  });
};

PreferencesWindow.init = () => {
  this.sendAnalyticsCheckbox.checked = config.get('sendAnalytics');
  this.notifyUnread.checked = config.get('notify.unread');
  this.notifySnoozed.checked = config.get('notify.snoozed');
  this.notifyDownload.checked = config.get('notify.download');
  this.notifyPeriod.value = config.get('notify.period');
  PreferencesWindow.setEventListeners();
};

window.addEventListener('DOMContentLoaded', () => {
  PreferencesWindow.init();
});
