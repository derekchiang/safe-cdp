import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import blue from "@material-ui/core/colors/blue";
import "../../CSS/CDPForm.css";

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  margin: {
    margin: 0
  },
  cssLabel: {
    "&$cssFocused": {
      color: blue[900]
    },
    ["@media (max-width:532px)"]: {
      // eslint-disable-line no-useless-computed-key
      fontSize: "12px"
    }
  },
  cssFocused: {},
  cssUnderline: {
    "&:after": {
      borderBottomColor: blue[900]
    }
  },
  cssOutlinedInput: {
    "&$cssFocused $notchedOutline": {
      borderColor: blue[900]
    }
  },
  notchedOutline: {},
  bootstrapRoot: {
    "label + &": {
      marginTop: theme.spacing.unit * 3
    }
  },
  bootstrapInput: {
    borderRadius: 4,
    backgroundColor: theme.palette.common.white,
    border: "1px solid #ced4da",
    fontSize: 16,
    padding: "10px 12px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"'
    ].join(","),
    "&:focus": {
      borderColor: "#80bdff",
      boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)"
    }
  },
  bootstrapFormLabel: {
    fontSize: 18
  },
  position: {
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignContent: "space-between",
    width: "100%",
    padding: "8px"
  },
  group: {
    display: "flex",
    flexDirection: "row",
    width: "100%"
  },
  wholegroup: {
    position: "relative",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "80%",
    ["@media (max-width:532px)"]: {
      // eslint-disable-line no-useless-computed-key
      width: "100%"
    }
  },
  lasttwo: {
    width: "100%"
  }
});

function CustomizedInputs(props) {
  const { classes } = props;

  return (
    <div>
      <FormControl className={`${classes.margin} ${classes.lasttwo}`}>
        <InputLabel
          htmlFor="custom-css-standard-input"
          classes={{
            root: classes.cssLabel,
            focused: classes.cssFocused
          }}
        >
          # of Dai {<span id="example-txt">(Ex. 200)</span>}
        </InputLabel>

        <Input
          id="custom-css-standard-input"
          onChange={props.inputHandler}
          name="PhoneNumber"
          classes={{
            underline: classes.cssUnderline
          }}
        />
      </FormControl>
    </div>
  );
}

CustomizedInputs.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedInputs);
