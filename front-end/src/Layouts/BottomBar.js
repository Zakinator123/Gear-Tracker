import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import ODC from './ODC-Bottom-Bar.png';
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
            {/*<a href="https://github.com/Zakinator123/Gear-Tracker/" ><div className="Author-text">Gear Tracker by Zakey Faieq</div></a>*/}
            <a href="http://outdoorsatuva.org"> <img className="ODC_Logo" src={ODC} alt="Github"/></a>

            <div
                style={{fontFamily: 'Permanent Marker'}}
                className="geartracker"
            >
                Gear Tracker
            </div>
        </div>
    )
};

export default withStyles(styles)(BottomBar);