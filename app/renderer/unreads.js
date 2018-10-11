const {
  $, $$, ancestor, sendNotification, sendClick,
} = require('./utils');
const { ipcRenderer: ipc } = require('electron');

const seenMessages = new Map();

function keyByMessage({ subject, sender, convlen }) {
  try {
    return JSON.stringify({ subject, sender, convlen });
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

function extractConversationLength(el) {
    const len_span = $('span.qi', el);
    if (len_span) {
	return len_span.textContent;
    }
    return null;
}

function getUnreadMessages() {
  return Array.from($$('.ss'))
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
        convlen: extractConversationLength(ancestorEl)
      };
    })
    .filter(Boolean);
}

function checkUnreads(period = 2000) {
  // skip if we're not inside the inbox
  const isInbox = $('.hA [title=Inbox]');
  if (!isInbox) {
    setTimeout(checkUnreads, period);
    return;
  }

  if (typeof checkUnreads.startingUp === 'undefined') {
    checkUnreads.startingUp = true;
  }

  const unreads = getUnreadMessages();

  ipc.send('update-unreads-count', unreads.length);

  // mark all previously seen messages as false
  seenMessages.forEach((value, key, map) => {
    map.set(key, false);
  });

  unreads.forEach((message) => {
    const {
      element, subject, sender, avatar, convlen
    } = message;
    const key = keyByMessage(message);
    // do not show the same notification every time on start up
    if (!checkUnreads.startingUp && !seenMessages.has(key)) {
      sendNotification({
        title: sender,
        body: subject,
        icon: avatar,
      }).addEventListener('click', () => {
        ipc.send('show-window', true);
        sendClick(element);
      });
    }
    // mark message as seen
    seenMessages.set(key, true);
  });

  // clean up old entries in seenMessages
  seenMessages.forEach((value, key, map) => {
    if (value === false) {
      map.delete(key);
    }
  });

  if (checkUnreads.startingUp) {
    checkUnreads.startingUp = false;
  }

  setTimeout(checkUnreads, period);
}

module.exports = checkUnreads;
