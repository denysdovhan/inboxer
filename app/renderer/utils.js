function $(selector, context = document) {
  return context.querySelector(selector);
}

function $$(selector, context = document) {
  return context.querySelectorAll(selector);
}

function createEvent(type) {
  return new MouseEvent(type, {
    view: window,
    bubbles: true,
    cancelable: true,
  });
}

function sendClick(el) {
  el.dispatchEvent(createEvent('mousedown'));
  el.dispatchEvent(createEvent('click'));
}

function sendNotification(notification) {
  const { title, body, icon } = notification;
  return new Notification(title, { body, icon });
}

function ancestor(el, selector) {
  return el.closest(selector);
}

// Drawing overlay icon for main proccess
// https://github.com/sindresorhus/caprine/blob/f67cc47fd4c9e5a44e171a5cc51c3e5a11cea600/browser.js#L104-L119
function renderOverlayIcon(unreadsCount) {
  const canvas = document.createElement('canvas');
  canvas.height = 128;
  canvas.width = 128;
  canvas.style.letterSpacing = '-5px';

  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#f42020';
  ctx.beginPath();
  ctx.ellipse(64, 64, 64, 64, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'white';
  ctx.font = '90px sans-serif';
  ctx.fillText(Math.min(99, unreadsCount).toString(), 64, 96);

  return canvas;
}

module.exports = {
  $,
  $$,
  createEvent,
  sendClick,
  sendNotification,
  ancestor,
  renderOverlayIcon,
};
