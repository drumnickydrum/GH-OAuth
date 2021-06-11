const parseIDTokenPayload = (token) => {
  if (!token || typeof token !== 'string') return;
  const parts = token.split('.');
  const payload = parts[1];
  if (!payload || typeof payload !== 'string') return;
  return Buffer.from(payload, 'base64').toString('ascii');
};

module.exports = { parseIDTokenPayload };
