import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import * as web3Utils from 'web3-utils';

import SecureCDPButton from '../buttons/SecureCDPButton';
import '../CSS/SecureModal.css';
import PaybackButton from '../buttons/PaybackButton';
import GiveupButton from '../buttons/GiveupButton';

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

const RAY_POWER = web3Utils.toBN(27)
const SECONDS_IN_DAYS = web3Utils.toBN(24 * 60 * 60)

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

  updateTargetCollateralization = (ev) => {
    this.setState({
      targetCollateralization: web3Utils.toBN(ev.target.value).mul(web3Utils.toBN(10).pow(RAY_POWER)).div(web3Utils.toBN(100))
    })
  }

  updateMarginCallThreshold = (ev) => {
    this.setState({
      marginCallThreshold: web3Utils.toBN(ev.target.value).mul(web3Utils.toBN(10).pow(RAY_POWER)).div(web3Utils.toBN(100))
    })
  }

  updateMarginCallDuration = (ev) => {
    this.setState({
      marginCallDuration: web3Utils.toBN(ev.target.value).mul(SECONDS_IN_DAYS)
    })
  }

  updateReward = (ev) => {
    this.setState({
      reward: web3Utils.toBN(ev.target.value)
    })
  }

  submit = () => {
    this.props.onSubmit(
      this.state.targetCollateralization,
      this.state.marginCallThreshold,
      this.state.marginCallDuration,
      this.state.reward)
    this.setState({ open: false })
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
        <div variant="outlined" color="primary" onClick={this.handleClickOpen} className='example-format3'>
          <GiveupButton />
        </div>
        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            Forfeit collateral and close out position?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Give Up
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
