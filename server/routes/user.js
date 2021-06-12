const path = require('path');
const generateBadge = require('../badges/generate');
const { axios } = require('../requests');
const router = require('express').Router();

let db = { users: {}, repos: {} };
const BADGES_URL = '/badges';
const PENDING_BADGE_URL = path.join(BADGES_URL, 'pending.svg');

router
  .route('/')
  .get(ensureAuthenticated, (_, res) => res.redirect(`${process.env.CLIENT_URL}/dashboard`));
router.route('/repos').get(ensureAuthenticated, getUserReposFromDB, getUserRepos);
router.route('/logout').get(logoutUser);
module.exports = router;

async function ensureAuthenticated(req, res, next) {
  const accessToken = req.signedCookies?.ght;
  if (!accessToken) throw new Error('no access token');
  const uid = req.signedCookies?.uid;
  const dbUser = db.users[uid];
  if (dbUser) {
    req.user = {
      id: dbUser.id,
      username: dbUser.username,
      avatar: dbUser.avatar,
      accessToken,
    };
    return next();
  }
  try {
    const user = await axios.getUserProfile(accessToken);
    if (!user) throw new Error('error fetching user');
    req.user = { id: user.id, username: user.login, avatar: user.avatar_url };
    db.users[user.id] = { ...req.user };
    req.user.accessToken = accessToken;
    res.cookie('uid', user.id, {
      signed: true,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      //   // secure: true // in production
    });
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
      avatar: req.user.avatar,
    },
  };
  try {
    const repos = await axios.getUserRepos(req.user.accessToken);
    if (!repos) throw new Error('error fetching repos');
    payload.repos = Object.fromEntries(getRepoEntries(repos));
    await getScores(payload);
    await getBadges(payload);
    setUserReposToDB(payload);
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

function logoutUser(req, res, next) {
  res.clearCookie('ght');
  res.clearCookie('uid');
  return res.redirect(`${process.env.CLIENT_URL}/login`);
}

function getUserReposFromDB(req, res, next) {
  if (db.repos[req.user.id]) return res.json(db.repos[req.user.id]);
  else next();
}

function setUserReposToDB(payload) {
  db.repos[payload.user.id] = payload;
}

function getRepoEntries(repos) {
  return repos.map((repo) => [
    repo.id,
    {
      id: repo.id,
      name: repo.name,
      description: repo.description,
      private: repo.private,
      language: repo.language,
      stargazers: repo.stargazers_count,
      forks: repo.forks_count,
      watchers: repo.watchers_count,
      issues: repo.open_issues_count,
      htmlURL: repo.html_url,
      cloneURL: repo.clone_url,
      lastUpdated: repo.pushed_at,
      percentComplete: 0,
      score: 'pending',
      badgeURL: PENDING_BADGE_URL,
    },
  ]);
}
