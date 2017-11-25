function getExtension() {
  const userAgent = navigator.userAgent.toLowerCase();

  if (userAgent.match(/(mac|os x)/)) {
    return 'dmg';
  } else if (userAgent.match(/windows/)) {
    return 'exe';
  } else if (userAgent.match(/linux/)) {
    return 'AppImage';
  }
  return undefined;
}

function getLatestRelease(ext) {
  return fetch('https://api.github.com/repos/denysdovhan/inboxer/releases/latest')
    .then(res => res.json())
    .then((json) => {
      const requiredAsset = json.assets.filter(asset => asset.name.includes(ext));
      console.log(requiredAsset);
      return requiredAsset[0].browser_download_url;
    })
    .catch(err => console.error(err));
}

getLatestRelease(getExtension())
  .then((url) => {
    console.log(url);
    document.getElementById('download').href = url;
  });
