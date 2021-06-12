import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {},
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    maxWidth: '900px',
    width: '100%',
    margin: '0 auto',
  },
  avatar: {
    height: '75px',
    width: '75px',
  },
  repoList: {
    marginTop: '2rem',
    justifyContent: 'center',
  },
  accordion: {
    maxWidth: '400px',
    margin: '1rem',
    border: `1px solid ${theme.palette.primary.main}`,
    borderRadius: '8px',
  },
  accordionSummary: {
    flexDirection: 'column',
    '& .MuiAccordionSummary-content': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alginItems: 'center',
    },
  },
  repoLink: {
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    width: '112px',
    height: '20px',
    cursor: 'pointer',
    margin: '.5rem auto',
    border: '1px solid rgba(0,0,0,0)',
    '&:hover': {
      borderColor: ' white',
    },
  },
  accordionDetails: {
    flexDirection: 'column',
    '& .MuiTypography-body2': {
      margin: '.5rem 0',
    },
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  stat: {
    display: 'flex',
    alignItems: 'center',
    '& *': { margin: '.25rem' },
  },
  private: {
    fontWeight: 'bold',
    color: theme.palette.warning.main,
  },
}));

export default useStyles;
