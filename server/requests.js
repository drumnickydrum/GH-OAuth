const axios = require('axios');

// Authorization Request URL (Will return 'code' for exchange and 'state' for verification)
module.exports.getAuthURL = (state) =>
  `https://github.com/login/oauth/authorize?\
client_id=0oaxebd0w120PQAvr5d6&\
scope=read%3Auser%20repo&\
state=${state}`;

module.exports.axios = {
  getToken: (code) =>
    axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        code,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    ),

  getUserRepos: (username, accessToken) =>
    axios.get(`https://api.github.com/users/${username}/repos`, {
      headers: {
        authorization: `bearer ${accessToken}`,
        accept: 'application/vnd.github.v3+json',
      },
      params: {
        type: 'all',
      },
    }),
};
