import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
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
