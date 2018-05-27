import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LoginDialog from '../Components/LoginDialog'
import Button from '@material-ui/core/Button';
// import IconButton from '@material-ui/core/IconButton';
// import MenuIcon from '@material-ui/icons/Menu';
// import LoginModal from '../Components/LoginModal'

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  },
  // menuButton: {
    //   marginLeft: -12,
    //   marginRight: 20,
    // },
};


function TopBar(props) {
    const { classes } = props;

    let loginLogoutButton;

    console.log(props.loggedIn);

    if (props.loggedIn === false)
        loginLogoutButton = <LoginDialog logIn={props.logIn} apiHost={props.apiHost}/>;
    else
        loginLogoutButton = <Button color="inherit" onClick={props.logOut}>Logout</Button>;

    return (
        <div className="TopBar">
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                  {/*<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">*/}
                  {/*<MenuIcon />*/}
                  {/*</IconButton>*/}
                <Typography variant="body2" color="inherit" align="left" className={classes.flex}>
                  Outdoors at UVA <br/>Gear Inventory
                </Typography>
                {loginLogoutButton}
              </Toolbar>
            </AppBar>
          </div>
        </div>
    );
}

TopBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);