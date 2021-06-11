const crypto = require('crypto');

const generateRandomString = (length = 43) => {
  let string = '';
  const valid = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  const validLength = valid.length;
  for (var i = 0; i < length; i++) {
    string += valid.charAt(Math.floor(Math.random() * validLength));
  }
  return string;
};

const generateCodeVerifier = () => encodeURIComponent(generateRandomString(128));

const generateCodeChallenge = (codeVerifier) =>
  cleanString(crypto.createHash('sha256').update(codeVerifier).digest('base64'));

const cleanString = (string) =>
  string.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

module.exports = { generateCodeChallenge, generateCodeVerifier };
