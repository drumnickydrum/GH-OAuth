import {
  AppBar,
  Toolbar,
  Avatar,
  Typography,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Box,
  Grid,
  Button,
  Tooltip,
} from '@material-ui/core';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import ForkIcon from '@material-ui/icons/CallSplit';
import WatchersIcon from '@material-ui/icons/Visibility';
import { useEffect, useState } from 'react';
import useStyles from './Dashboard.styles';
import { copyToClipboard } from '../../utils/copyToClipboard';

const INITIAL_USERNAME = '';
const INITIAL_AVATAR = '';
const INITIAL_REPOS = Object.assign({});

export const Dashboard = () => {
  const [username, setUsername] = useState(INITIAL_USERNAME);
  const [avatar, setAvatar] = useState(INITIAL_AVATAR);
  const [repos, setRepos] = useState(INITIAL_REPOS);

  useEffect(() => {
    (async () => {
      let newUsername = INITIAL_USERNAME;
      let newAvatar = INITIAL_AVATAR;
      let newRepos = INITIAL_REPOS;
      try {
        const response = await fetch('/api/user/repos');
        const { user = {}, repos = {} } = await response.json();
        newUsername = user.username;
        newAvatar = user.avatar;
        newRepos = repos;
      } catch (e) {
        console.log(e);
      }
      setUsername(newUsername);
      setAvatar(newAvatar);
      setRepos(newRepos);
    })();
  }, []);

  const logout = () => (window.location.href = '/api/user/logout');

  const theme = useTheme();
  const classes = useStyles(theme);
  return (
    <>
      <AppBar>
        <Toolbar className={classes.toolbar}>
          <Avatar
            src={avatar}
            alt={`${username} avatar`}
            className={classes.avatar}
            variant='rounded'
          />
          <h1>Dashboard</h1>
          <Button onClick={logout}>logout</Button>
        </Toolbar>
      </AppBar>
      <Typography variant='h2'>Repositories:</Typography>
      <Grid container className={classes.repoList}>
        {Object.values(repos)
          .sort((a, b) => Date.parse(b.lastUpdated) - Date.parse(a.lastUpdated))
          .map((repo) => (
            <Repo key={repo.id} repo={repo} />
          ))}
      </Grid>
    </>
  );
};

const Repo = ({ repo }) => {
  const copyBadgeURL = (e) => {
    e.stopPropagation();
    let badgeURL = 'http://localhost:4000' + repo.badgeURL.replace(/\\/g, '/');
    copyToClipboard(badgeURL);
  };
  const classes = useStyles();
  return (
    <Grid item>
      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.accordionSummary}>
          <Tooltip title='Repository Link' placement='right' arrow>
            <a
              href={repo.htmlURL}
              target='_blank'
              rel='noreferrer'
              aria-label={`Go to ${repo.name} repository on GithHub`}
              onClick={(e) => e.stopPropagation()}
              onFocus={(e) => e.stopPropagation()}
              className={classes.repoLink}
            >
              <Typography variant='body1' align='center'>
                {repo.name}
              </Typography>
            </a>
          </Tooltip>
          <Tooltip title='Copy Badge URL' placement='right' arrow>
            <img
              src={repo.badgeURL}
              alt={`${repo.name} score`}
              onClick={copyBadgeURL}
              aria-label={`Copy ${repo.name} badge url`}
              onFocus={(e) => e.stopPropagation()}
              className={classes.badge}
            />
          </Tooltip>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Typography variant='subtitle1' align='center'>
            {repo.description}
          </Typography>
          <Divider />
          <Box className={classes.stats}>
            <Box className={classes.stat}>
              <Typography variant='body2'>{repo.stargazers}</Typography>
              <StarOutlineIcon />
            </Box>
            <Box className={classes.stat}>
              <Typography variant='body2'>{repo.forks}</Typography>
              <ForkIcon />
            </Box>
            <Box className={classes.stat}>
              <Typography variant='body2'>{repo.watchers}</Typography>
              <WatchersIcon />
            </Box>
          </Box>
          <Divider />
          <Typography variant='body2'>
            Last Updated: {Date(repo.lastUpdated).toLocaleString()}
          </Typography>
          {repo.private && (
            <Typography variant='body2' className={classes.private}>
              private
            </Typography>
          )}
          {repo.language && (
            <Typography variant='body2'>Language: {repo.language}</Typography>
          )}
          <Typography variant='body2'>Open Issues: {repo.issues}</Typography>
        </AccordionDetails>
      </Accordion>
    </Grid>
  );
};
