import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Route path='/' exact render={() => <Redirect to='/login' />} />
      <Route path='/login' component={Login} />
      <Route path='/dashboard' component={Dashboard} />
      <Route path='/oops' component={Oops} />
    </BrowserRouter>
  );
}

export default App;

function Login() {
  const signIn = () => (window.location.href = '/api/auth');

  return (
    <div>
      <h1>Please sign in</h1>
      <button id='signIn' onClick={signIn}>
        Sign in with GitHub
      </button>
    </div>
  );
}

const INITIAL_USERNAME = '';
const INITIAL_REPOS = {};

function Dashboard() {
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
        {Object.values(repos).map((repo) => {
          return (
            <li key={repo.id}>
              <div>{repo.name}</div>
              <img src={repo.badgeURL} alt={`${repo.name} score`} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Oops() {
  return <div>Oops! Something went wrong</div>;
}
