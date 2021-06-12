import { Container, createMuiTheme, CssBaseline, ThemeProvider } from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import { BrowserRouter, Route } from 'react-router-dom';
import { Dashboard } from './Dashboard';
import { Login } from './Login';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: indigo[600],
    },
    type: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth='md'>
        <BrowserRouter>
          <Route path='/' exact component={UserCheck} />
          <Route path='/login' component={Login} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/oops' component={Oops} />
        </BrowserRouter>
      </Container>
    </ThemeProvider>
  );
}

export default App;

function UserCheck() {
  window.location.href = '/api/user';
  return null;
}

function Oops() {
  return <div>Oops! Something went wrong</div>;
}
