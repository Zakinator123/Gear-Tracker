import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { AppBar, Toolbar, Typography, Button, IconButton } from 'material-ui';
import green from 'material-ui/colors/purple';
import MenuIcon from '@material-ui/icons/Menu';

const styles = {
  root: {
    flexGrow: 1,
    primaryColor: green,
    color: green,
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
    return (
        <div style={{height:'10vh'}}>
          <div className={classes.root} style={{height:'10vh'}}>
            <AppBar position="static">
              <Toolbar>
                  {/*<IconButton className={classes.menuButton} color="inherit" aria-label="Menu">*/}
                  {/*<MenuIcon />*/}
                  {/*</IconButton>*/}
                <Typography variant="body2" color="inherit" align="left" className={classes.flex}>
                  Outdoors at UVA <br/>Gear Inventory
                </Typography>
                <Button color="inherit">{props.loginButtonText}</Button>
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