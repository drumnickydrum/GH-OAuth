const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const { getAuthURL, axios } = require('./requests');

require('dotenv').config();

const CLIENT_URL = 'http://localhost:3000';

const app = express();
app.use(cookieParser(process.env.COOKIE_SECRET));

// Serve React App
const buildFolder = path.join(__dirname, '../client/build');
app.use(express.static(buildFolder));
app.get('/', (_, res) => {
  return res.sendFile(path.join(buildFolder, 'index.html'));
});

app.get('/auth', (req, res) => {
  const state = encodeURIComponent(crypto.randomBytes(28).toString('base64'));
  res.cookie('ghState', state, { signed: true });
  const url = getAuthURL(state);
  return res.redirect(url);
});

app.get('/auth/callback', async (req, res) => {
  if (req.query?.error) return res.status(400).redirect('/login');
  const { state: newState, code } = req.query;
  const oldState = decodeURIComponent(req.signedCookies?.ghState);
  if (!code || !newState || newState !== oldState) {
    console.log('Authentication failed');
    return res.redirect(`${CLIENT_URL}/login`);
  }
  res.clearCookie('ghState');
  try {
    const response = await axios.getToken(code);
    const accessToken = response.data?.access_token;
    if (!accessToken) return res.redirect(`${CLIENT_URL}/login`);
    res.cookie('ght', accessToken, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365,
      //   // secure: true // in production
    });
    return res.redirect(`${CLIENT_URL}/dashboard`);
  } catch (e) {
    console.log(`Error retrieving access token`);
    console.log(e.response?.data?.message);
    return res.redirect(`${CLIENT_URL}/login`);
  }
});

const ensureAuthenticated = async (req, res, next) => {
  const accessToken = req.signedCookies?.ght;
  if (!accessToken) return res.redirect(`${CLIENT_URL}/login`);
  try {
    const res = await axios.getUserProfile(accessToken);
    console.log(res?.data);
  } catch (e) {
    console.log('Error during auth check ->');
    console.log(e.response?.data?.message);
  }
  res.end();
  // if fail, redirect to login
  // else call next()
};

app.get('/user/repos', ensureAuthenticated, (req, res) => {
  // parse cookies for access_token
  // get repos from GitHub
  // get scores for repos
  // get badges for repos
  // send list of repos with scores and badges
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Server listening on port ${port}`));
