import { useEffect, useState } from 'react';
import { copyToClipboard } from './utils/copyToClipboard';

const INITIAL_USERNAME = '';
const INITIAL_REPOS = {};

export const Dashboard = () => {
  const [username, setUsername] = useState(INITIAL_USERNAME);
  const [repos, setRepos] = useState(INITIAL_REPOS);

  useEffect(() => {
    (async () => {
      let newUsername = '';
      let newRepos = {};
      try {
        const response = await fetch('/api/user/repos');
        const { user = {}, repos = {} } = await response.json();
        newUsername = user.username;
        newRepos = repos;
      } catch (e) {
        console.log(e);
      }
      setUsername(newUsername);
      setRepos(newRepos);
    })();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>{username} Repositories:</h2>
      <ul>
        {Object.values(repos).map((repo) => (
          <Repo key={repo.id} repo={repo} />
        ))}
      </ul>
    </div>
  );
};

const Repo = ({ repo }) => {
  const copyBadgeURL = () => {
    let badgeURL = 'http://localhost:4000' + repo.badgeURL.replace(/\\/g, '/');
    copyToClipboard(badgeURL);
  };
  return (
    <li>
      <a href={repo.htmlURL} target='_blank' rel='noreferrer'>
        {repo.name}
      </a>
      <img src={repo.badgeURL} alt={`${repo.name} score`} onClick={copyBadgeURL} />
    </li>
  );
};
