import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import { Dashboard } from './Dashboard';

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

function Oops() {
  return <div>Oops! Something went wrong</div>;
}
