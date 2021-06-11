const crypto = require('crypto');
const { getAuthURL, axios } = require('../requests');
const router = require('express').Router();

router.route('/').get(oAuthRedirect);
router.route('/callback').get(oAuthCallback);
module.exports = router;

function oAuthRedirect(req, res) {
  const state = encodeURIComponent(crypto.randomBytes(28).toString('base64'));
  res.cookie('ghState', state, { signed: true });
  const url = getAuthURL(state);
  return res.redirect(url);
}

async function oAuthCallback(req, res) {
  if (req.query?.error) return res.status(400).redirect('/login');
  const { state: newState, code } = req.query;
  const oldState = decodeURIComponent(req.signedCookies?.ghState);
  if (!code || !newState || newState !== oldState) {
    console.log('Authentication failed');
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
  res.clearCookie('ghState');
  try {
    const response = await axios.getToken(code);
    const accessToken = response.data?.access_token;
    if (!accessToken) return res.redirect(`${process.env.CLIENT_URL}/login`);
    res.cookie('ght', accessToken, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      //   // secure: true // in production
    });
    return res.redirect(`${process.env.CLIENT_URL}/dashboard`);
  } catch (e) {
    console.log(`Error retrieving access token`);
    console.log(e.response?.data?.message);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
}
