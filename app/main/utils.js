const analytics = require('./analytics');

const isDarwin = process.platform === 'darwin';
const isLinux = process.platform === 'linux';
const isWindows = process.platform === 'win32';

function sendAction(win, action) {
  analytics.track(action);
  if (isDarwin) win.restore();
  win.webContents.send(action);
}

// @FIXME: Shift keybindings do not work.
// https://stackoverflow.com/q/47378160/5508862
function sendKeybinding(win, keyCode) {
  win.webContents.sendInputEvent({ type: 'keyDown', keyCode });
  win.webContents.sendInputEvent({ type: 'char', keyCode });
  win.webContents.sendInputEvent({ type: 'keyUp', keyCode });
}

module.exports = {
  isDarwin,
  isLinux,
  isWindows,
  sendAction,
  sendKeybinding,
};
