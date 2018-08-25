import React from 'react';
import { withStyles } from '@material-ui/core/styles';
// import { Typography } from 'material-ui/core';
import GitHubLogo from './GitHub_Logo_White.png';
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
                <a href="https://github.com/Zakinator123/Gear-Tracker/" ><div className="Author-text">Gear Tracker by Zakey Faieq</div></a>
                <a href="https://github.com/Zakinator123/Gear-Tracker/"> <img className="Github" src={GitHubLogo} alt="Github"/></a>
            </div>
    )
};

export default withStyles(styles)(BottomBar);