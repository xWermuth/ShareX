import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

// MUI
import {
  InputBase,
  withStyles,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import useAutocomplete from "@material-ui/lab/useAutocomplete";

const styles = (theme) => ({
  root: {
    transition: "0.3s ease-in-out",
    width: "100%",
  },

  input: { width: 200 },
  listbox: {
    width: "79%",
    margin: 0,
    marginTop: 5,
    padding: 0,
    zIndex: 1,
    position: "absolute",
    left: "21%",
    listStyle: "none",
    backgroundColor: "#CBD5E0",
    overflow: "auto",
    maxHeight: 500,
    borderRadius: 5,
    transition: "0.3s ease-in-out",

    '& li[data-focus="true"]': {
      backgroundColor: "rgba(255,255,255,.25)",
      cursor: "pointer",
    },
    "& li:active": {
      backgroundColor: "#CBD5E0",
    },
    [theme.breakpoints.down("md")]: {
      width: "86%",
      left: 44,
    },
    [theme.breakpoints.down("sm")]: {
      width: "60%",
      left: "20%",
    },
  },
});
var loading = false;

function Autocomplete(props) {
  const { classes } = props;

  const [inputValue, setValue] = React.useState("");
  const [autoFillList, setList] = React.useState([]);

  const history = useHistory();
  function redirect(event) {
    event.target.value = "";
    setValue(event.target.value);
    setValue("");
    console.log("---", inputValue);
    history.push(`/users/${inputValue}`);
  }

  const onChange = (event) => {
    if (event.target.value.trim().length < 1) {
      return;
    }

    loading = true;

    setValue(event.target.value);

    axios
      .post(`${process.env.REACT_APP_PROXY}/search/`, {
        searchQuery: event.target.value,
      })
      .then((response) => {
        loading = false;
        setList(response.data);
      });
  };

  const {
    getRootProps,
    // getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
  } = useAutocomplete({
    id: "use-autocomplete-demo",
    options: autoFillList,
    getOptionLabel: (option) => option.handle,
  });

  return (
    <div className={classes.root}>
      <div {...getRootProps()}>
        <form onChange={onChange} onSubmit={redirect}>
          <InputBase
            type="text"
            value={inputValue}
            name="input"
            id="input"
            placeholder="Search users"
            className={classes.input}
            {...getInputProps()}
          />
        </form>
      </div>
      {groupedOptions.length > 0 ? (
        loading ? (
          <div
            className={classes.listbox}
            style={{ display: "flex", alignItems: "center" }}
          >
            {loading && (
              <CircularProgress
                size={40}
                color="inherit"
                style={{ padding: 10 }}
              />
            )}
            <Typography variant="body1" style={{ padding: 10, paddingLeft: 5 }}>
              Loading users...
            </Typography>
          </div>
        ) : (
          <List className={classes.listbox} {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <Fragment key={index}>
                <ListItem
                  {...getOptionProps({ option, index })}
                  className={classes.listItem}
                  component={Link}
                  to={`/users/${option.handle}`}
                >
                  <ListItemAvatar>
                    <Avatar src={option.profilePicture} alt="profilePicture" />
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Typography
                        className={classes.fontWeight700}
                        variant="body1"
                        color="inherit"
                        gutterBottom
                        component={Link}
                        to={`/users/${option.handle}`}
                      >
                        {option.handle}
                      </Typography>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </Fragment>
            ))}
          </List>
        )
      ) : null}
    </div>
  );
}

Autocomplete.propTypes = {
  classes: PropTypes.object.isRequired,
  autoFillList: PropTypes.array,
  onChange: PropTypes.func,
  inputValue: PropTypes.string,
};

export default withStyles(styles)(Autocomplete);
