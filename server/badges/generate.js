const fs = require('fs');
const path = require('path');

module.exports = async ({ userId, repoId, score }) => {
  const svg = getSVG(score);

  const filename = `${repoId}.svg`;
  const pathname = path.join('badges', String(userId));
  if (!fs.existsSync(pathname)) fs.mkdirSync(pathname);
  const filepath = path.join(pathname, filename);

  return new Promise((resolve) => {
    fs.writeFile(filepath, svg, (err) => {
      if (err) {
        console.log(err);
        resolve({ repoId, filename: 'pending.svg' });
      } else {
        resolve({ repoId, filename });
      }
    });
  });
};

const getSVG = (score) => `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="20">\
<linearGradient id="b" x2="0" y2="100%">\
<stop offset="0" stop-color="#bbb" stop-opacity=".1" />\
<stop offset="1" stop-opacity=".1" />\
</linearGradient>\
<mask id="a">\
<rect width="112" height="20" rx="3" fill="#fff" />\
</mask>\
<g mask="url(#a)">\
<path fill="#555" d="M0 0h76v20H0z" />\
<path fill="#5fcc0b" d="M76 0h36v20H76z" />\
<path fill="url(#b)" d="M0 0h112v20H0z" />\
</g>\
<g fill="#fff" text-anchor="middle" font-family="DejaVu Sans,Verdana,Geneva,sans-serif" font-size="11">\
<text x="46" y="15" fill="#010101" fill-opacity=".3">Score</text>\
<text x="46" y="14">Score</text>\
<text x="93" y="15" fill="#010101" fill-opacity=".3">${score}%</text>\
<text x="93" y="14">${score}%</text>\
</g>\
<svg viewBox="120 -8 60 60">\
<path d="M23.013 0C10.333.009.01 10.22 0 22.762v.058l3.914 2.275.053-.036a11.291 11.291 0 0 1 8.352-1.767 10.911 10.911 0 0 1 5.5 2.726l.673.624.38-.828c.368-.802.793-1.556 1.264-2.24.19-.276.398-.554.637-.851l.393-.49-.484-.404a16.08 16.08 0 0 0-7.453-3.466 16.482 16.482 0 0 0-7.705.449C7.386 10.683 14.56 5.016 23.03 5.01c4.779 0 9.272 1.84 12.651 5.18 2.41 2.382 4.069 5.35 4.807 8.591a16.53 16.53 0 0 0-4.792-.723l-.292-.002a16.707 16.707 0 0 0-1.902.14l-.08.012c-.28.037-.524.074-.748.115-.11.019-.218.041-.327.063-.257.052-.51.108-.75.169l-.265.067a16.39 16.39 0 0 0-.926.276l-.056.018c-.682.23-1.36.511-2.016.838l-.052.026c-.29.145-.584.305-.899.49l-.069.04a15.596 15.596 0 0 0-4.061 3.466l-.145.175c-.29.36-.521.666-.723.96-.17.247-.34.513-.552.864l-.116.199c-.17.292-.32.57-.449.824l-.03.057a16.116 16.116 0 0 0-.843 2.029l-.034.102a15.65 15.65 0 0 0-.786 5.174l.003.214a21.523 21.523 0 0 0 .04.754c.009.119.02.237.032.355.014.145.032.29.049.432l.01.08c.01.067.017.133.026.197.034.242.074.48.119.72.463 2.419 1.62 4.836 3.345 6.99l.078.098.08-.095c.688-.81 2.395-3.38 2.539-4.922l.003-.029-.014-.025a10.727 10.727 0 0 1-1.226-4.956c0-5.76 4.545-10.544 10.343-10.89l.381-.014a11.403 11.403 0 0 1 6.651 1.957l.054.036 3.862-2.237.05-.03v-.056c.006-6.08-2.384-11.793-6.729-16.089C34.932 2.361 29.16 0 23.013 0" fill="#F01F7A" fill-rule="evenodd"/>\
</svg>\
</svg>`;
