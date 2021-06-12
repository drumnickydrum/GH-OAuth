import { Container, Card, Typography, Button, Icon } from '@material-ui/core';
import GitHubIcon from './icons/github.svg';
import useStyles from './Login.styles';

export const Login = () => {
  const signIn = () => (window.location.href = '/api/auth');

  const classes = useStyles();
  return (
    <Container className={classes.root}>
      <Card className={classes.card}>
        <Typography variant='h6' component='h1' className={classes.header}>
          Please sign in
        </Typography>
        <Button id='signIn' variant='outlined' startIcon={svgIcon} onClick={signIn}>
          Sign in with GitHub
        </Button>
      </Card>
    </Container>
  );
};

const svgIcon = (
  <Icon>
    <img alt='edit' src={GitHubIcon} />
  </Icon>
);
