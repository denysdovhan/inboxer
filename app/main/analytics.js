const firstRun = require('first-run');
const Insight = require('insight');

const pkg = require('../../package');

const trackingCode = 'UA-40496885-12';

const insight = new Insight({
  trackingCode,
  pkg,
});

module.exports = {
  init() {
    if (firstRun()) {
      insight.track('install');
    }
    insight.track('start');
  },
  track(...paths) {
    insight.track(...paths);
  },
};
