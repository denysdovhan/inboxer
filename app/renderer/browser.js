const { ipcRenderer: ipc } = require('electron');
const {
  $, $$, sendClick, ancestor,
} = require('./dom');

let seenMessages;

ipc.on('toggle-sidebar', () => $('.aO.AK.ew').click());

ipc.on('show-preferences', () => $('.oin9Fc.cQ.lN').click());

// primary folder shortcuts

ipc.on('go-to-inbox', () => $$('.pa .oin9Fc.cN')[0].click());
ipc.on('go-to-shoozed', () => $$('.pa .oin9Fc.cN')[1].click());
ipc.on('go-to-done', () => $$('.pa .oin9Fc.cN')[2].click());

// secondary folder shortcuts

ipc.on('go-to-drafts', () => $$('.pa + .Y .oin9Fc.cQ')[0].click());
ipc.on('go-to-sent', () => $$('.pa + .Y .oin9Fc.cQ')[1].click());
ipc.on('go-to-reminders', () => $$('.pa + .Y .oin9Fc.cQ')[2].click());
ipc.on('go-to-trash', () => $$('.pa + .Y .oin9Fc.cQ')[3].click());
ipc.on('go-to-spam', () => $$('.pa + .Y .oin9Fc.cQ')[4].click());
ipc.on('go-to-contacts', () => $$('.pa + .Y .oin9Fc.cQ')[5].click());

ipc.on('go-to-search', () => $('.gc.sp.g-lW').click());

ipc.on('sign-out', () => $('#gb_71').click());
ipc.on('add-account', () => $('.gb_Fa.gb_Nf.gb_Ee.gb_Eb').click());

function extractSubject(el) {
  return ($('.lt', el) || $('.qG span', el)).textContent;
}

function extractAvatar(el, message) {
  const brand = message.getAttribute('brand_avatar_url');
  if (brand) {
    return brand;
  }

  const image = $('img', el);
  if (image) {
    return image.src;
  }

  const icon = $('.pE', el);
  return getComputedStyle(icon)['background-image'].replace(/url\((.+)\)/, '$1');
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

function sendNotification(message) {
  new Notification(message.sender, {
    tag: message.id,
    body: message.subject,
    icon: message.avatar,
  })
    .addEventListener('click', () => {
      sendClick(message.element);
    });
}

function checkUnreads() {
  const unreads = getUnreadMessages();

  ipc.send('unread', unreads.length);
  console.log(unreads.length, unreads);

  const startUp = !seenMessages;
  if (startUp) {
    seenMessages = new WeakMap();
  }

  unreads
    .filter(message => !seenMessages.has(message.element))
    .forEach((message) => {
      // do not show the same notification every time on start up
      if (!startUp) {
        sendNotification(message);
      }
      // mark message as seen
      seenMessages.set(message.element, true);
    });

  setTimeout(checkUnreads, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  checkUnreads();

  // Change application title on login page
  const appTitle = $('.wrapper .banner h1');
  if (appTitle) {
    appTitle.innerHTML = 'Inboxer';
  }

  // Put the name of active user on the topbar
  const activeUserName = $('div.gb_Bb.gb_Ab');
  const topbarUserLink = $('a.gb_b.gb_fb.gb_R');
  if (activeUserName && topbarUserLink) {
    const span = document.createElement('span');
    span.textContent = activeUserName.textContent;
    span.classList.add('active-user-name');
    topbarUserLink.appendChild(span);
  }
});
