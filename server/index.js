const express = require('express');
const path = require('path');

require('dotenv').config();

const app = express();

// Serve React App
const buildFolder = path.join(__dirname, '../client/build');
app.use(express.static(buildFolder));
app.get('/', (_, res) => {
  res.sendFile(path.join(buildFolder, 'index.html'));
});

app.get('/auth', (req, res) => {
  // generate state string
  // store state in cookie
  // get auth url (pass in state string)
  // redirect client to github auth endpoint
});

app.get('/auth/callback', (req, res) => {
  // if req.query.error, status 400, return redirect to login
  // parse cookies for state and access_token
  // if neither, same ⬆
  // validate req.query.state === state
  // if not, same ⬆
  // set access_token cookie
  //
  // redirect user to dashboard
});

const ensureAuthenticated = (req, res, next) => {
  // parse cookies for access_token
  // if none, redirect to login
  // get user from GitHub
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
