import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit
  },
  dense: {
    marginTop: 16
  },
  menu: {
    width: 200
  }
});

class SearchId extends React.Component {
  state = {

  };

  handleChange = ev => {
    window.cdp = ev.target.value
  };

  render() {
    const { classes } = this.props;

    return (
      <form className={classes.container} noValidate autoComplete="off">
        <TextField
          id="outlined-with-placeholder"
          label="Search CDP ID"
          placeholder="#CDP"
          className={classes.textField}
          margin="normal"
          variant="outlined"
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

SearchId.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SearchId);
