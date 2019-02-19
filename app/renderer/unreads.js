const {
  $, $$, ancestor, sendNotification, sendClick,
} = require('./utils');
const { ipcRenderer: ipc } = require('electron');

const seenMessages = new Map();
const iconMail = "https://www.gstatic.com/images/icons/material/system/2x/inbox_gm_googlered600_24dp.png"

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


function getUnreadMessages() {
  return Array.from($$('tr.zA.zE'))
    .map((message) => {
      return {
        element: message,
        subject: extractSubject(message),
        sender: extractSender(message),
        conversationLength: extractConversationLength(message),
      };
    });
}

function checkUnreads(period = 2000) {
  // skip if we're not inside the inbox
  if (folderName() !== 'Inbox') {
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
      element, subject, sender,
    } = message;
    const key = keyByMessage(message);
    // do not show the same notification every time on start up
    if (!checkUnreads.startingUp && !seenMessages.has(key)) {
      sendNotification({
        title: sender,
        body: subject,
        icon: iconMail,
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
