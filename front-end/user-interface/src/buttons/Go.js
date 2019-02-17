import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
  margin: {
    margin: theme.spacing.unit,
  },
  extendedIcon: {
    marginRight: theme.spacing.unit,
  },
});

function ButtonSizes(props) {
  const { classes } = props;
  return (
      <div>
        <Button variant="contained" size="medium" color="primary" className={classes.margin}>
          Go
        </Button>
      </div>
  );
}

ButtonSizes.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ButtonSizes);