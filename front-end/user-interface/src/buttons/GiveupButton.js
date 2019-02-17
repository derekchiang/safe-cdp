import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import purple from '@material-ui/core/colors/purple';


const theme = createMuiTheme({
    palette: {
      primary: purple,
    },
    typography: {
      useNextVariants: true,
    },
  });

function ButtonSizes(props) {
  const { classes } = props;
  return (
      <div>
           <MuiThemeProvider theme={theme}>
        <Button variant="contained" size="medium" color="primary" className={classes.margin}>
        {' '}GIVE UP{' '}
        </Button>
        </MuiThemeProvider>
      </div>
  );
}

ButtonSizes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(theme)(ButtonSizes);