import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { AppBar, Toolbar, Typography, Button, IconButton } from 'material-ui';
import MenuIcon from '@material-ui/icons/Menu';
import LoginModal1 from '../Components/LoginModal'

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
                <LoginModal1 />
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