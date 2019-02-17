import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import BalanceButton from "../../buttons/BalanceButton";
import '../../CSS/Balance.css';


const styles = {
  card: {
    minWidth: 586,
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

class SimpleCard extends React.Component {
  state = {}

  async componentDidMount() {
    let contractJSON = require("../../contracts/SafeCDPFactory.json")
    const networkId = await window.web3.eth.net.getId()
    const deployedAddress = contractJSON.networks[networkId].address
    const safeCDPFactory = new window.web3.eth.Contract(contractJSON.abi, deployedAddress)

    // We are just getting the first one, which is wrong and hacky.
    let safeCDPAddr = await safeCDPFactory.methods.userToSafeCDPs(account, 0).call()
    contractJSON = require("../../contracts/SafeCDP.json")
    const safeCDP = new window.web3.eth.Contract(contractJSON.abi, safeCDPAddr)
    let debt = await safeCDP.methods.totalAccuredDebt().call()
    this.setState({
      safeCDP: safeCDP,
      debt: debt,
    })
  }

  onClick = async () => {
    let account = (await window.web3.eth.getAccounts())[0]
    await this.state.safeCDP.respondToMarginCalls().send({
      from: account,
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className='balance'>
        <Card className={classes.card}>
          <CardContent>
            <Typography
              className={classes.title}
              color="textSecondary"
              gutterBottom
            >
              Outstanding Balance: {this.state.debt}
            </Typography>

          </CardContent>
          <CardActions>
            <BalanceButton onClick=onClick />
          </CardActions>
        </Card>
      </div>
    )
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
