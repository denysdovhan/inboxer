const { ipcRenderer: ipc, remote } = require('electron');
const path = require('path');
const {
  $, $$, ancestor, sendNotification, sendClick,
} = require('./utils');

const config = remote.require('../../app/main/config');

const seenMessages = new Map();

// snoozed logo copied from Inbox
const iconSnoozed = path.join(__dirname, '..', 'static/IconSnoozed.png');

function keyByMessage({
  messageType, subject, sender, conversationLength,
}) {
  try {
    return JSON.stringify({
      messageType, subject, sender, conversationLength,
    });
  } catch (error) {
    console.error(error); // eslint-disable-line
    return undefined;
  }
}

function extractSubject(el) {
  return ($('.lt', el) || $('.qG span', el) || $('div.bg > span', el)).textContent;
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

function extractSnoozedSender(message) {
  const senderSpan = $('div.rw > span', message);
  return senderSpan.textContent;
}

function extractConversationLength(el) {
  const lenSpan = $('span.qi', el);
  return (lenSpan) ? lenSpan.textContent : null;
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
        messageType: 'unread',
        subject: extractSubject(ancestorEl),
        sender: extractSender(ancestorEl, message),
        avatar: extractAvatar(ancestorEl, message),
        conversationLength: extractConversationLength(ancestorEl),
      };
    })
    .filter(Boolean);
}

function getSnoozedMessages() {
  return Array.from($$('div.pW'))
    .map((snoozeDiv) => {
      const message = ancestor(snoozeDiv, '.jS');

      return {
        element: message,
        messageType: 'snoozed',
        subject: extractSubject(message),
        sender: extractSnoozedSender(message),
        conversationLength: extractConversationLength(message),
      };
    });
}

function checkUnreads() {
  let period = parseFloat(config.get('notify.period'), 10) * 1000; // convert seconds to milliseconds
  if (period < 100) {
    period = 100; // no faster than every 100 ms
  }

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
  const snoozed = getSnoozedMessages();

  ipc.send('update-unreads-count', unreads.length);

  // mark all previously seen messages as false
  seenMessages.forEach((value, key, map) => {
    map.set(key, false);
  });

  const notifyUnread = config.get('notify.unread');
  const notifySnoozed = config.get('notify.snoozed');
  unreads.forEach((message) => {
    const {
      element, subject, sender, avatar,
    } = message;
    const key = keyByMessage(message);
    // do not show the same notification every time on start up
    if (notifyUnread && !checkUnreads.startingUp && !seenMessages.has(key)) {
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

  // notify about new snoozed messages
  snoozed.forEach((message) => {
    const {
      element, subject, sender,
    } = message;
    const key = keyByMessage(message);
    // do not show the same notification every time on start up
    if (notifySnoozed && !checkUnreads.startingUp && !seenMessages.has(key)) {
      sendNotification({
        title: sender,
        body: subject,
        icon: `file://${iconSnoozed}`,
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
