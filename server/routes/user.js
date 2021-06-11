const path = require('path');
const generateBadge = require('../badges/generate');
const { axios } = require('../requests');
const router = require('express').Router();

router.route('/repos').get(ensureAuthenticated, getUserRepos);
module.exports = router;

const BADGES_URL = '/badges';
const PENDING_BADGE_URL = path.join(BADGES_URL, 'pending.svg');

async function ensureAuthenticated(req, res, next) {
  const accessToken = req.signedCookies?.ght;
  if (!accessToken) return res.redirect(`${process.env.CLIENT_URL}/login`);
  try {
    const user = await axios.getUserProfile(accessToken);
    if (!user) throw new Error('error fetching user');
    req.user = { id: user.id, username: user.login, accessToken };
    next();
  } catch (e) {
    console.log('ensureAuthenticated ->', e.message || e.response?.data?.message);
    return res.redirect(`${process.env.CLIENT_URL}/login`);
  }
}

async function getUserRepos(req, res) {
  const payload = {
    user: {
      id: req.user.id,
      username: req.user.username,
    },
  };
  try {
    let repos = await axios.getUserRepos(req.user.accessToken);
    if (!repos) throw new Error('error fetching repos');
    repos = repos.map((repo) => [
      repo.id,
      {
        id: repo.id,
        name: repo.name,
        htmlURL: repo.html_url,
        cloneURL: repo.clone_url,
        lastUpdated: repo.pushed_at,
        percentComplete: 0,
        score: 'pending',
        badgeURL: PENDING_BADGE_URL,
      },
    ]);
    payload.repos = Object.fromEntries(repos);
    await getScores(payload);
    await getBadges(payload);
    return res.json(payload);
  } catch (e) {
    console.log('/user/repos ->', e.message || e.response?.data?.message);
    return res.redirect(`${process.env.CLIENT_URL}/oops`);
  }
}

async function getScores(payload) {
  try {
    Object.values(payload.repos).forEach((repo) => {
      repo.percentComplete = 100;
      repo.score = Math.floor(Math.random() * 100);
    });
  } catch (e) {
    console.log('error retrieving scores');
  }
}

async function getBadges({ user: { id: userId }, repos }) {
  try {
    let promises = [];
    for (let [repoId, { score }] of Object.entries(repos)) {
      if (score === 'pending') continue;
      promises.push(generateBadge({ userId, repoId, score }));
    }
    const badges = await Promise.all(promises);
    badges.forEach((badge) => {
      let filepath;
      if (badge.filename.match(/pending/)) filepath = PENDING_BADGE_URL;
      else filepath = path.join(BADGES_URL, String(userId), badge.filename);
      repos[badge.repoId].badgeURL = filepath;
    });
  } catch (e) {
    console.log('error retrieving badges');
  }
}
