import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import ethlogo from '../assets/imgs/ethlogo.png';
import '../CSS/CollateralCard.css';

const styles = {
  card: {
    maxWidth: 586,
    minHeight: 235,
    marginTop: 50
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)"
  },
  title: {
    fontSize: 23,
    fontWeight: 600,
    color: "#95aac9",
    fontFamily: "Cerebri Sans, sans-serif",
    paddingTop: 10
  },
  pos: {
    marginBottom: 12
  },
  data:{
    fontSize: 38,
    fontWeight: 600,
    color: "#95aac9",
    fontFamily: "Cerebri Sans, sans-serif",
    position: 'relative',
    left:40,
    bottom:20,
  },
};

function SimplerCard(props) {
  const { classes } = props;
  const bull = <span className={classes.bullet}>•</span>;

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography
          className={classes.title}
          color="textSecondary"
          gutterBottom
        >
          Collateral (ETH)
        </Typography>
        <div className='img'>
        <img src={ethlogo} alt='eth logo' height='72' width='100'/>
        </div>
        
          <Typography
          className={classes.data}
          color="textSecondary">
          1 ETH
          </Typography>
          <div>
            <br/> <br/>
          </div>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}

SimplerCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimplerCard);
