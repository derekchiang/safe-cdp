import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DepositButton from '../../buttons/DepositButton';
import InvestForm from './InvestForm';
import '../../CSS/Sponsor.css';

const styles = theme => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    margin: 'auto',
    width: 'fit-content',
  },
  formControl: {
    marginTop: theme.spacing.unit * 2,
    minWidth: 120,
  },
  formControlLabel: {
    marginTop: theme.spacing.unit,
  },
});

class MaxWidthDialog extends React.Component {
  state = {
    open: false,
    fullWidth: true,
    maxWidth: 'md',
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  Submit = () => {
    this.setState({open: false})
  }

  handleMaxWidthChange = event => {
    this.setState({ maxWidth: event.target.value });
  };

  handleFullWidthChange = event => {
    this.setState({ fullWidth: event.target.checked });
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <div variant="outlined" color="primary" onClick={this.handleClickOpen} className='invest'>
          <DepositButton />
        </div>
        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
              Enter quantity of Dai you would like to invest
            <InvestForm />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.Submit} color="primary">
              Deposit
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }
}

MaxWidthDialog.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaxWidthDialog);