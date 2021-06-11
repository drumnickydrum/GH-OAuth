const axios = require('axios');
const { response } = require('express');

const GH_SCOPE = 'read%3Auser%20repo';
module.exports.getAuthURL = (state) =>
  `https://github.com/login/oauth/authorize?\
client_id=${process.env.GH_CLIENT_ID}&\
scope=${GH_SCOPE}&\
state=${state}`;

module.exports.axios = {
  getToken: (code) =>
    axios
      .post(
        'https://github.com/login/oauth/access_token',
        {
          client_id: process.env.GH_CLIENT_ID,
          client_secret: process.env.GH_CLIENT_SECRET,
          code,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        }
      )
      .then((response) => response.data.access_token)
      .catch((reason) => {
        console.log(reason);
        return null;
      }),

  getUserProfile: (accessToken) =>
    axios
      .get('https://api.github.com/user', {
        headers: {
          Authorization: `bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then((response) => response.data)
      .catch((reason) => {
        console.log(reason);
        return null;
      }),

  getUserRepos: (accessToken) =>
    axios
      .get(`https://api.github.com/user/repos`, {
        headers: {
          Authorization: `bearer ${accessToken}`,
          Accept: 'application/vnd.github.v3+json',
        },
      })
      .then((response) => response.data)
      .catch((reason) => {
        console.log(reason);
        return null;
      }),
};
