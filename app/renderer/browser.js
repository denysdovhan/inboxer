const { ipcRenderer: ipc } = require('electron');

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

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

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here

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
