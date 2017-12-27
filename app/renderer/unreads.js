const {
  $, $$, ancestor, sendNotification, sendClick,
} = require('./utils');
const { ipcRenderer: ipc } = require('electron');

const seenMessages = new Map();

function keyByMessage({ subject, sender, avatar }) {
  try {
    return JSON.stringify({ subject, sender, avatar });
  } catch (error) {
    console.error(error); // eslint-disable-line
    return undefined;
  }
}

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

  return Array
    .from($$('.ss'))
    .map((message) => {
      const ancestorEl = ancestor(message, '.jS');

      if (ancestor(ancestorEl, '.full-cluster-item')) {
        return null;
      }

      return {
        element: ancestorEl,
        subject: extractSubject(ancestorEl),
        sender: extractSender(ancestorEl, message),
        avatar: extractAvatar(ancestorEl, message),
      };
    })
    .filter(Boolean);
}

function checkUnreads(period = 2000) {
  const unreads = getUnreadMessages();

  ipc.send('update-unreads-count', unreads.length);

  const startingUp = seenMessages.size === 0;

  unreads
    .filter(message => !seenMessages.has(keyByMessage(message)))
    .forEach((message) => {
      const {
        element, subject, sender, avatar,
      } = message;
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
      seenMessages.set(keyByMessage(message), true);
    });

  setTimeout(checkUnreads, period);
}

module.exports = checkUnreads;
