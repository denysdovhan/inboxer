const { ipcRenderer: ipc } = require('electron');

const $ = document.querySelector.bind(document);

ipc.on('show-preferences', () => {
  $('.oin9Fc.cQ.lN').click();
});

document.addEventListener('DOMContentLoaded', () => {
  // do your setup here

  // Change application title on login page
  const appTitle = $('.wrapper .banner h1');
  if (appTitle) {
    appTitle.innerHTML = 'Inboxer'
  }

  // Put the name of active user on the topbar
  const activeUserName = $('div.gb_Bb.gb_Cb');
  const topbarUserLink = $('a.gb_b.gb_gb.gb_R');
  if (activeUserName && topbarUserLink) {
    const span = document.createElement('span');
    span.textContent = activeUserName.textContent;
    span.classList.add('active-user-name');
    topbarUserLink.appendChild(span);
  }
});

