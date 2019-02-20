const {
  $, $$, ancestor, sendNotification, sendClick,
} = require('./utils');
const { ipcRenderer: ipc } = require('electron');
const path = require('path');

const seenUnreadMessages = new Map();
const seenSnoozedMessages = new Map();

// gmail logo from https://gsuite.google.com/setup/resources/logos/
const iconMail = path.join(__dirname, '..', 'static/gmail_48px.png');
// snoozed logo copied from Inboxer
const iconSnoozed = path.join(__dirname, '..', 'static/IconSnoozed.png');

function keyByMessage({ subject, sender, conversationLength }) {
  try {
    return JSON.stringify({ subject, sender, conversationLength });
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
  return (isNaN(numUnread)) ? 0 : numUnread;
}

function getUnreadMessages(messageTable) {
  if (messageTable == null) {
    return [];
  }
  return Array.from($$('tr.zA.zE', messageTable))
    .map((message) => {
      return {
        element: message,
        subject: extractSubject(message),
        sender: extractSender(message),
        conversationLength: extractConversationLength(message),
      };
    });
}

function getSnoozedMessages(messageTable) {
  if (messageTable == null) {
    return [];
  }
  return Array.from($$('td.byZ div.by1', messageTable))
    .map((snoozeDiv) => {
      const message = ancestor(snoozeDiv, 'tr.zA');

      return {
        element: message,
        subject: extractSubject(message),
        sender: extractSender(message),
        conversationLength: extractConversationLength(message),
      };
    });
}

function markMessageMap(messageMap) {
  messageMap.forEach((value, key, map) => {
    map.set(key, false);
  });
}

function cleanupMessageMap(messageMap) {
  messageMap.forEach((value, key, map) => {
    if (value === false) {
      map.delete(key);
    }
  });
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

  const messageTable = $('div.Cp table.F tbody');
  const unreads = getUnreadMessages(messageTable);
  const snoozed = getSnoozedMessages(messageTable);

  // mark all previously seen messages as false
  markMessageMap(seenUnreadMessages);
  markMessageMap(seenSnoozedMessages);

  // notify about new unread messages
  unreads.forEach((message) => {
    const {
      element, subject, sender,
    } = message;
    const key = keyByMessage(message);
    // do not show the same notification every time on start up
    if (!checkUnreads.startingUp && !seenUnreadMessages.has(key)) {
      sendNotification({
        title: sender,
        body: subject,
        icon: `file://${iconMail}`,
      }).addEventListener('click', () => {
        ipc.send('show-window', true);
        sendClick(element);
      });
    }
    // mark message as seen
    seenUnreadMessages.set(key, true);
  });

  // notify about new snoozed messages
  snoozed.forEach((message) => {
    const {
      element, subject, sender,
    } = message;
    const key = keyByMessage(message);
    // do not show the same notification every time on start up
    if (!checkUnreads.startingUp && !seenSnoozedMessages.has(key)) {
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
    seenSnoozedMessages.set(key, true);
  });

  // clean up old entries in seenUnreadMessages (entries that are still false)
  cleanupMessageMap(seenUnreadMessages);
  cleanupMessageMap(seenSnoozedMessages);

  if (checkUnreads.startingUp) {
    checkUnreads.startingUp = false;
  }

  setTimeout(checkUnreads, period);
}

module.exports = checkUnreads;
