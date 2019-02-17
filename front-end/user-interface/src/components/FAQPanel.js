import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';

const ExpansionPanel = withStyles({
  root: {
    border: '1px solid rgba(0,0,0,.125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
      borderBottom: 0,
    },
    '&:before': {
      display: 'none',
    },
  },
  expanded: {
    margin: 'auto',
  },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
  root: {
    backgroundColor: 'rgba(0,0,0,.03)',
    borderBottom: '1px solid rgba(0,0,0,.125)',
    marginBottom: -1,
    minHeight: 56,
    '&$expanded': {
      minHeight: 56,
    },
  },
  content: {
    '&$expanded': {
      margin: '12px 0',
    },
  },
  expanded: {},
})(props => <MuiExpansionPanelSummary {...props} />);

ExpansionPanelSummary.muiName = 'ExpansionPanelSummary';

const ExpansionPanelDetails = withStyles(theme => ({
  root: {
    padding: theme.spacing.unit * 2,
  },
}))(MuiExpansionPanelDetails);

class CustomizedExpansionPanel extends React.Component {
  state = {
    expanded: 'panel1',
  };

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false,
    });
  };

  render() {
    const { expanded } = this.state;
    return (
      <div>
        <ExpansionPanel
          square
          expanded={expanded === 'panel1'}
          onChange={this.handleChange('panel1')}
        >
          <ExpansionPanelSummary>
            <Typography><h2>What the heck is CDP?</h2></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className="answer">
            CDP is Collateral Debt Position in full. A CDP helps in generating a <br/>
            specific amount of DAI stablecoin (USD pegged tokens) against the <br/>
            collateral (which is ETH currently) to lock up in the CDP to secure the <br/>
            loan i.e. the DAI you generated.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          square
          expanded={expanded === 'panel2'}
          onChange={this.handleChange('panel2')}
        >
          <ExpansionPanelSummary>
            <Typography><h2>What are the benefits of opening a CDP?</h2></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className="answer">
            You can generate liquidity by generating DAI stablecoins without giving <br/>
            up ownerships of your collateral (in this case, your collateralised ETH) , <br/>
            making sure your CDP holds enough collateral to cover the value of the <br/>
            collateral ETH.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          square
          expanded={expanded === 'panel3'}
          onChange={this.handleChange('panel3')}
        >
          <ExpansionPanelSummary>
            <Typography><h2>How does it work?</h2></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className="answer">
            Connect your wallet. Determine the amount of loan you want to borrow, <br/>
            then decide the amount of ETH you want to lock in the CDP, you <br/>
            generate the DAI stablecoins against the ETH you locked up, and spend <br/>
            them as you wish. You can pay back the DAI stablecoins when you no <br/>
            longer need the liquidity, together with stability price (which will be <br/>
            added to the overall debt), and then you can redeem the collateral you <br/>
            locked up.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          square
          expanded={expanded === 'panel4'}
          onChange={this.handleChange('panel4')}
        >
          <ExpansionPanelSummary>
            <Typography><h2>Is there any risk involved in creating a CDP?</h2></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className="answer">
            Always make sure that the value of ETH locked up is always more than <br/>
            150% of the DAI stablecoins that you’ve generated. Which means, you <br/>
            can only take DAI loan up to 66% of the total ETH collateral value in USD. <br/>
            If the value of the collateral comes near 66%, in this case you can add <br/>
            more collateral or pay back some of your debt. If the value of the issue / <br/>
            collateral ratio falls above 66% then your CDP will break i.e will be <br/>
            liquidated. This means that your collateral will be sold in order to cover <br/>
            the value of the DAI stablecoins you generated. Otherwise, any leftover <br/>
            collateral will be returned to your CDP, so you can redeem it.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <ExpansionPanel
          square
          expanded={expanded === 'panel5'}
          onChange={this.handleChange('panel5')}
        >
          <ExpansionPanelSummary>
            <Typography><h2>What are our fees?</h2></Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Typography className="answer">
            At the moment, there are no platform fees for SafeCDP users. The only <br/>
            fee drawn is the gas fee needed to pay for the transaction on the <br/>
            Ethereum network and 1% stability fees paid in ETH to MakerDAO <br/>
            protocol. Note, that your wallet address must hold a certain amount of <br/>
            ETH in order to pay for the fees.
            </Typography>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      </div>
    );
  }
}

export default CustomizedExpansionPanel;