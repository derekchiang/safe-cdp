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
import web3 from '../../utilities/web3provider.js'
import * as web3Utils from 'web3-utils';

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
    depositAmount: '',
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  updateDepositAmount = (ev) => {
    this.setState({
      depositAmount: web3Utils.toBN(ev.target.value).mul(web3Utils.toBN(10).pow(web3Utils.toBN(18)))
    })
  }

  Submit = async () => {
    this.setState({open: false});
    let contractJSON = require("../../contracts/Sponsor.json");
    const networkId = await window.web3.eth.net.getId();
    const deployedAddress = contractJSON.networks[networkId].address;
    const sponsorContract = new window.web3.eth.Contract(contractJSON.abi, deployedAddress);
    let account = (await window.web3.eth.getAccounts())[0];
    console.log(window.web3.eth.accounts[0]);
    await sponsorContract.methods.deposit(this.state.depositAmount).send({
      "from": account,
    });
  };

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
            <InvestForm
            updateDepositAmount={this.updateDepositAmount}
            />
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
