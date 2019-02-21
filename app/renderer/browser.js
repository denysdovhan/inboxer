const { ipcRenderer: ipc } = require('electron');
const checkUnreads = require('./unreads');
const { $, $$, renderOverlayIcon } = require('./utils');

const doneURL = 'https://mail.google.com/mail/#search/-in%3Ainbox+-in%3Aspam+-in%3Atrash+-in%3Achats';
const contactsURL = 'https://contacts.google.com/';
const addAccountURL = 'https://accounts.google.com/AddSession';

ipc.on('toggle-sidebar', () => $('div.gb_zc').click());

ipc.on('show-preferences', () => $('.oin9Fc.cQ.lN').click());


function selectFolder(name) {
  const selector = `div.TK div.aim div.TO[data-tooltip="${name}"]`;
  const folder = $(selector);
  if (folder) {
    folder.click();
  } else {
    // if folder was not found, try loading correct URL
    const urlName = name.split(' ')[0].toLowerCase();
    const url = `https://mail.google.com/mail/#${urlName}`;
    window.location.assign(url);
  }
}

function loadURL(url) {
  window.location.assign(url);
}

// primary folder shortcuts

ipc.on('go-to-inbox', () => selectFolder('Inbox'));
ipc.on('go-to-snoozed', () => selectFolder('Snoozed'));
ipc.on('go-to-done', () => loadURL(doneURL));

// secondary folder shortcuts

ipc.on('go-to-drafts', () => selectFolder('Drafts'));
ipc.on('go-to-sent', () => selectFolder('Sent'));
ipc.on('go-to-reminders', () => $$('.pa + .Y .oin9Fc.cQ')[2].click()); // **FIXME**
ipc.on('go-to-trash', () => selectFolder('Trash'));
ipc.on('go-to-spam', () => selectFolder('Spam'));
ipc.on('go-to-contacts', () => loadURL(contactsURL));

ipc.on('go-to-search', () => $('input.gb_Df').focus());

ipc.on('sign-out', () => $('#gb_71').click());
ipc.on('add-account', () => loadURL(addAccountURL));

ipc.on('render-overlay-icon', (event, unreadsCount) => {
  ipc.send(
    'update-overlay-icon',
    renderOverlayIcon(unreadsCount).toDataURL(),
    unreadsCount.toString(),
  );
});

document.addEventListener('DOMContentLoaded', () => {
  document.documentElement.classList.add(`platform-${process.platform}`);

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
