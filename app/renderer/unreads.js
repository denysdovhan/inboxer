const {
  $, $$, ancestor, sendNotification, sendClick,
} = require('./utils');
const { ipcRenderer: ipc } = require('electron');

let seenMessages;

function extractSubject(el) {
  return ($('.lt', el) || $('.qG span', el)).textContent;
}

function extractAvatar(el, message) {
  const brand = message.getAttribute('brand_avatar_url');
  if (brand) {
    return brand;
  }

  const image = $('.Kc img[src], .pE img[src]', el);
  if (image) {
    return image.src;
  }

  return null;
}

function extractSender(el, message) {
  const brand = message.getAttribute('brand_name');
  if (brand) {
    return brand;
  }

  return $('[email]', el).textContent;
}

function getUnreadMessages() {
  // not inside the inbox
  const isInbox = $('.hA [title=Inbox]');

  if (!isInbox) {
    return [];
  }

  return Array.from($$('.ss')).map((message) => {
    const ancestorEl = ancestor(message, '.jS');

    if (ancestorEl.classList.contains('full-cluster-item') || $('.itemIconMarkedDone', ancestorEl)) {
      return null;
    }

    return {
      element: ancestorEl,
      subject: extractSubject(ancestorEl),
      sender: extractSender(ancestorEl, message),
      avatar: extractAvatar(ancestorEl, message),
    };
  });
}

function checkUnreads(period = 2000) {
  const unreads = getUnreadMessages();

  ipc.send('unread', unreads.length);

  const startingUp = !seenMessages;
  if (startingUp) {
    seenMessages = new WeakMap();
  }

  unreads
    .filter(message => !seenMessages.has(message.element))
    .forEach(({
      element, subject, sender, avatar,
    }) => {
      // do not show the same notification every time on start up
      if (startingUp) {
        sendNotification({
          title: sender,
          body: subject,
          icon: avatar,
        }).addEventListener('click', () => {
          sendClick(element);
        });
      }
      // mark message as seen
      seenMessages.set(element, true);
    });

  setTimeout(checkUnreads, period);
}

module.exports = checkUnreads;
