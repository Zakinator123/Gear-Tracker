import React from 'react';
import { withStyles } from 'material-ui/styles';
import GitHubLogo from './GitHub_Logo_White.png';
import logo from './logo.svg';
import './BottomBar.css';
import Paper from 'material-ui/Paper';


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
            <Paper elevation={0}>
          <div className="App-footer">
              <img src={logo} className="App-logo" />
              <p>Gear App by Zakey Faieq <br></br><a href="https://github.com/Zakinator123/Gear-App/"> <img src={GitHubLogo} alt="Github"/></a></p>
          </div>
            </Paper>
        )
    };

export default withStyles(styles)(BottomBar);