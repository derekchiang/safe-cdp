import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import '../../CSS/sponsorPage.css';
import web3 from '../../utilities/web3provider.js'
import * as web3Utils from 'web3-utils';

const styles = {
  card: {
    minWidth: 786,
    minHeight: 235,
    marginTop: 50
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 15,
    fontWeight: 600,
    color: "#95aac9",
    fontFamily: "Cerebri Sans, sans-serif",
    paddingTop: 10
  },
  pos: {
    marginBottom: 12
  }
};

class SponsorCard extends React.Component{
  state = {}

  async componentDidMount(){
    this.setState({open: false});
    let contractJSON = require("../../contracts/Sponsor.json");
    let contractTokenJSON = require("../../contracts/DaiToken.json");
    const networkId = await window.web3.eth.net.getId();
    const deployedAddress = contractJSON.networks[networkId].address;
    const tokenAddress = "0xC4375B7De8af5a38a93548eb8453a498222C4fF2";

    const sponsorContract = new window.web3.eth.Contract(contractJSON.abi, deployedAddress);
    const tokenContract = new window.web3.eth.Contract(contractTokenJSON.abi, tokenAddress);
    let account = (await window.web3.eth.getAccounts())[0];
    console.log(await window.web3.eth.accounts[0]);
    const sponsorPoolBalance = await sponsorContract.methods.checkContractTokenBalance().call();
    const userPoolBalance = await sponsorContract.methods.sponsorDepositBalance(account).call();
    console.log(account);
    console.log(sponsorPoolBalance);
    console.log(userPoolBalance);
    this.setState({
      sponsorPoolBalance: sponsorPoolBalance/(Math.pow(10,18)),
      userPoolBalance: userPoolBalance/(Math.pow(10,18)),
    })
  }
  render(props){

    const { classes } = this.props;
    return (
  <div className="sponsorCard">
    <Card className={classes.card}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Pool Details
        </Typography>
        <div>
          <p>Pool's Total: {this.state.sponsorPoolBalance}</p>
          <p>User's Total: {this.state.userPoolBalance}</p>
        </div>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>as */}
    </Card>
  </div>
  );
}}

SponsorCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SponsorCard);
