function getExtension() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.match(/(mac|os x)/)) {
    return 'dmg';
  } else if (userAgent.match(/windows/)) {
    return 'exe';
  } else if (userAgent.match(/linux/)) {
    return 'deb';
  }
  return undefined;
}

function getLatestRelease(ext) {
  return fetch('https://api.github.com/repos/denysdovhan/inboxer/releases/latest')
    .then(res => res.json())
    .then((json) => {
      const requiredAsset = json.assets.filter(asset => asset.name.includes(ext));
      return requiredAsset[0].browser_download_url;
    })
    // eslint-disable-next-line
    .catch(err => console.error(err));
}

const ext = getExtension();

getLatestRelease(ext)
  .then((url) => {
    const downloadBtn = document.getElementById('download');
    downloadBtn.href = url;
    downloadBtn.innerHTML = `Download .${ext}`;
  });
