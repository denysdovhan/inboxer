const { ipcRenderer: ipc } = require('electron');
const path = require('path');
const {
  $, $$, sendNotification, sendClick,
} = require('./utils');

const seenMessages = new Map();

// gmail logo from https://gsuite.google.com/setup/resources/logos/
const iconMail = path.join(__dirname, '..', 'static/gmail_48px.png');
// snoozed logo copied from Inboxer
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

function extractSubject(message) {
  return $('.y6 span span', message).textContent;
}

function extractSender(message) {
  return $('span.bA4', message).textContent;
}

function extractConversationLength(message) {
  const lenSpan = $('span.bx0', message);
  return (lenSpan) ? lenSpan.textContent : null;
}

// name of currently selected folder: Inbox, Sent, ...
function folderName() {
  const folder = $('div.TK div.aim.ain div.TO');
  return (folder) ? folder.getAttribute('data-tooltip') : null;
}

// extract number of unread messages in Inbox from the left column
// works even if we're not in Inbox
function extractNumberUnread() {
  // div.TK: left column, main folders
  // div.aim: each folder (Inbox, Starred, Sent, ...)
  // div.TO with data-tooltip="Inbox": Inbox folder
  // div.bsU: contains number of unread messages
  const numUnreadDiv = $('div.TK div.aim div.TO[data-tooltip="Inbox"] div.bsU');
  const numUnread = (numUnreadDiv) ? parseInt(numUnreadDiv.textContent, 10) : 0;
  return (Number.isNaN(numUnread)) ? 0 : numUnread;
}

// returns array of notifications: {message, title, body, icon}
function findUnreadSnoozedMessages() {
  const messageTable = $('div.Cp table.F');
  if (messageTable === null) {
    return [];
  }
  const notifications = [];

  // mark already seen messages false
  seenMessages.forEach((value, key, map) => {
    map.set(key, false);
  });

  // iterate through all messages (rows in table)
  $$('table.F > tbody > tr', messageTable).forEach((message) => {
    let messageType = null;
    if (message.className.includes('zA zE')) { // unread message  <tr class="zA zE ..." ...>
      messageType = 'unread';
    } else if ($('td.byZ div.by1', message) !== null) { // snoozed message
      messageType = 'snoozed';
    }

    if (messageType !== null) {
      const subject = extractSubject(message);
      const sender = extractSender(message);
      const conversationLength = extractConversationLength(message);
      const key = keyByMessage({
        messageType,
        subject,
        sender,
        conversationLength,
      });

      // if message hasn't been seen before, schedule notification
      if (!seenMessages.has(key)) {
        const icon = (messageType === 'unread') ? iconMail : iconSnoozed;
        notifications.push({
          message,
          title: sender,
          body: subject,
          icon: `file://${icon}`,
        });
      }
      seenMessages.set(key, true); // mark message as seen
    }
  });

  // delete any seenMessages still marked false
  seenMessages.forEach((value, key, map) => {
    if (value === false) {
      map.delete(key);
    }
  });

  return notifications;
}

function checkUnreads(period = 2000) {
  if (typeof checkUnreads.haveUnread === 'undefined') {
    checkUnreads.haveUnread = false;
  }

  const numUnread = extractNumberUnread();
  if (checkUnreads.haveUnread !== (numUnread > 0)) {
    ipc.send('update-unreads-count', numUnread);
    checkUnreads.haveUnread = (numUnread > 0);
  }

  // skip if we're not inside the inbox
  if (folderName() !== 'Inbox') {
    setTimeout(checkUnreads, period);
    return;
  }

  if (typeof checkUnreads.startingUp === 'undefined') {
    checkUnreads.startingUp = true;
  }

  // notifications for new unread or snoozed messages
  const notifications = findUnreadSnoozedMessages();
  if (!checkUnreads.startingUp) { // send notifications only if we're not just starting up
    notifications.forEach((notification) => {
      const {
        message, title, body, icon,
      } = notification;
      sendNotification({
        title,
        body,
        icon,
      }).addEventListener('click', () => {
        ipc.send('show-window', true);
        sendClick(message);
      });
    });
  }

  if (checkUnreads.startingUp) {
    checkUnreads.startingUp = false;
  }

  setTimeout(checkUnreads, period);
}

module.exports = checkUnreads;
