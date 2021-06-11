const path = require('path');
const { axios } = require('../requests');
const router = require('express').Router();

router.route('/repos').get(ensureAuthenticated, getUserRepos);
module.exports = router;

const BADGES_URL = path.join(__dirname, 'badges');

async function ensureAuthenticated(req, res, next) {
  const accessToken = req.signedCookies?.ght;
  if (!accessToken) return res.redirect(`${process.env.CLIENT_URL}/login`);
  try {
    const response = await axios.getUserProfile(accessToken);
    const user = response?.data;
    if (!user) throw new Error('error fetching user');
    req.user = { id: user.id, name: user.name, accessToken };
    next();
  } catch (e) {
    console.log('ensureAuthenticated ->', e.message || e.response?.data?.message);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
}

async function getUserRepos(req, res) {
  const payload = { user: { id: req.user.id, name: req.user.name } };
  try {
    const response = await axios.getUserRepos(req.user.accessToken);
    let repos = response?.data;
    if (!repos) throw new Error('error fetching repos');
    repos = repos.map((repo) => ({
      id: repo.id,
      name: repo.name,
      htmlURL: repo.html_url,
      cloneURL: repo.clone_url,
      lastUpdated: repo.pushed_at,
      percentComplete: 0,
      score: 'pending',
      badgeURL: `${BADGES_URL}/pending.svg`,
    }));
    await getScores(repos, payload);
    await getBadges(repos, payload);
    return res.json(payload);
  } catch (e) {
    console.log('/user/repos ->', e.message || e.response?.data?.message);
    return res.redirect(`${process.env.CLIENT_URL}/oops`);
  }
}

async function getScores() {
  console.log('getScores');
}

async function getBadges() {
  console.log('getBadges');
}
