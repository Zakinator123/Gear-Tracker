import React from 'react';
import {withStyles} from '@material-ui/core/styles';
import {Typography} from '@material-ui/core';
import {Grid} from '@material-ui/core';
import ODC from './ODC-Bottom-Bar.png';
import './BottomBar.css';


export const BottomBar = () => {
    return (
        <div className="App-footer">
            {/*<a href="https://github.com/Zakinator123/Gear-Tracker/" ><div className="Author-text">Gear Tracker by Zakey Faieq</div></a>*/}
            {/*<a href="http://outdoorsatuva.org"> <img className="ODC_Logo" src={ODC} alt="Github"/></a>*/}

            <Grid
                container
                alignItems="center"
                justify="center"
                spacing={16}
            >
                <Grid
                    item
                >
                    <div
                        style={{fontFamily: 'Permanent Marker'}}
                        className="geartracker"
                    >
                        Gear Tracker
                    </div>
                </Grid>
                <Grid
                    item
                    style={{paddingTop: '2vh'}}
                >
                    <div
                        className="geartracker"
                    >
                        <a
                            width="130"
                            height="40"
                            href="https://auth0.com/?utm_source=oss&utm_medium=gp&utm_campaign=oss" target="_blank"
                            alt="Single Sign On & Token Based Authentication - Auth0"
                        >
                            <img
                                width="150"
                                height="50"
                                alt="JWT Auth for open source projects"
                                src="//cdn.auth0.com/oss/badges/a0-badge-dark.png"
                            />
                        </a>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
};

export default BottomBar;