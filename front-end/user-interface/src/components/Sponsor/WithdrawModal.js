import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import WithdrawButton from '../../buttons/WithdrawButton';
import WithdrawForm from './WithdrawForm';
import '../../CSS/Sponsor.css';
import web3 from '../../utilities/web3provider.js';

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

  Submit = async () => {
    this.setState({open: false});
    console.log("test");
    let contractJSON = require("../../contracts/Sponsor.json");
    const networkId = await window.web3.eth.net.getId();
    const deployedAddress = contractJSON.networks[networkId].address;

    const sponsorContract = new window.web3.eth.Contract(contractJSON.abi, deployedAddress);
    let account = (await window.web3.eth.getAccounts())[0];
    console.log(window.web3.eth.accounts[0]);
    await sponsorContract.methods.withdraw().send({"from": account});
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
        <div variant="outlined" color="primary" onClick={this.handleClickOpen} className='withdraw'>
          <WithdrawButton />
        </div>
        <Dialog
          fullWidth={this.state.fullWidth}
          maxWidth={this.state.maxWidth}
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="max-width-dialog-title"
        >
          <DialogContent>
            Withdraw all funds?
          </DialogContent>
          <DialogActions>
            <Button onClick={this.Submit} color="primary">
              Confirm
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
