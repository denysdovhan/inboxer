const { ipcRenderer: ipc } = require('electron');
const checkUnreads = require('./unreads');
const { $, $$, renderOverlayIcon } = require('./utils');

ipc.on('toggle-sidebar', () => $('div.gb_zc').click());

ipc.on('show-preferences', () => $('.oin9Fc.cQ.lN').click());


function selectFolder(name) {
  const selector = `div.TK div.aim div.TO[data-tooltip="${name}"]`;
  let folder = $(selector);
  if (folder == null) {
    // if folder was not found, try clicking "More" button
    const moreButton = $('span.J-Ke');
    if (moreButton) {
      moreButton.click();
      folder = $(selector); // try to find folder again
    }
  }
  if (folder) {
    folder.click();
  }
}

// primary folder shortcuts

ipc.on('go-to-inbox', () => selectFolder('Inbox'));
ipc.on('go-to-snoozed', () => selectFolder('Snoozed'));
ipc.on('go-to-done', () => selectFolder('All Mail'));

// secondary folder shortcuts

ipc.on('go-to-drafts', () => selectFolder('Drafts'));
ipc.on('go-to-sent', () => selectFolder('Sent'));
ipc.on('go-to-reminders', () => $$('.pa + .Y .oin9Fc.cQ')[2].click());  // **FIXME**
ipc.on('go-to-trash', () => selectFolder('Trash'));
ipc.on('go-to-spam', () => selectFolder('Spam'));
ipc.on('go-to-contacts', () => $$('.pa + .Y .oin9Fc.cQ')[5].click());   // **FIXME**

ipc.on('go-to-search', () => $('input.gb_Df').focus());

ipc.on('sign-out', () => $('#gb_71').click());
ipc.on('add-account', () => $('.gb_Fa.gb_Nf.gb_Ee.gb_Eb').click());    // **FIXME**

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
