import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import dailogo from '../assets/imgs/dailogo.jpg';
import '../CSS/CollateralCard.css';
import CircleStatus from "./CircleStatus";


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

function SimpleCard(props) {
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
          Debt (DAI)
        </Typography>
        <div className='img'>
        <img src={dailogo} alt='dai logo' height='75' width='70'/>
        </div>
        <Typography
          className={classes.data}
          color="textSecondary">
          60 DAI
          </Typography>
        <CircleStatus />
        <span className='hours-left'>48.24 hours left</span>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
  );
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SimpleCard);
