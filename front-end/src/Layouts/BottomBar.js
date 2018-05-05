import React from 'react';
import { withStyles } from 'material-ui/styles';
import { Typography } from 'material-ui';
import GitHubLogo from './GitHub_Logo_White.png';
import logo from './logo.svg';
import './BottomBar.css';

const styles = {
  root: {
    flexGrow: 1,
  },
  flex: {
    flex: 1,
  }
};

export const BottomBar = () => {
    return (
            <div className="App-footer">
                <img src={logo} className="App-logo" />
                <Typography variant="body1" color="inherit" style={{lineHeight: '1em'}}>Gear App by Zakey Faieq </Typography>
                <a href="https://github.com/Zakinator123/Gear-App/"> <img src={GitHubLogo} alt="Github"/></a>
            </div>
    )
};

export default withStyles(styles)(BottomBar);