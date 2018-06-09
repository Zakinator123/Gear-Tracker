import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import LoginDialog from '../Components/LoginDialog'
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import ClubLogo from './ClubLogo'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    flex: {},
    logo: {
        [theme.breakpoints.only('xs')]: {
            marginRight: 'auto',
            marginLeft: 'auto',
            paddingRight: '4vw',
            width: '8vh'
        },
        [theme.breakpoints.only('sm')]: {
            marginRight: 'auto',
            marginLeft: 'auto',
            paddingRight: '4vw',
            width: '8vw'
        },
        [theme.breakpoints.up('md')]: {
            marginRight: 'auto',
            marginLeft: 'auto',
            marginTop: '1vh',
            paddingRight: '4vw',
            marginBottom: '1vh',
            width: '5vw'
        },
    }
});


function TopBar(props) {
    const {classes} = props;

    let loginLogoutButton;

    if (props.connected == false)
        loginLogoutButton = <Button style={{visibility: 'hidden' }} color="primary" variant="contained" ><Typography variant="button" style={{visibility: 'hidden'}}>Login</Typography> </Button>;
    else if (props.loggedIn === false)
        loginLogoutButton = (
            <Slide in={true} style={{transitionDelay: 300}} mountOnEnter unmountOnExit>
                <LoginDialog logIn={props.logIn} apiHost={props.apiHost}/>
            </Slide>
        );
    else
        loginLogoutButton = (
            <Button color="primary" variant="contained" onClick={props.logOut}>
                <Typography variant="button" style={{color: "#FFFFFF"}}>Logout</Typography>
            </Button>
        );

    let titleVariant;
    if (window.matchMedia("(min-width: 800px)").matches)
        titleVariant = "title";
    else
        titleVariant = "body2";

    let logo = <ClubLogo classes={classes}/>;


    return (
        <div className="TopBar">
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant={titleVariant} color="inherit" align="left" className={classes.flex}>
                            Outdoors at UVA <br/>Gear Inventory
                        </Typography>
                        {logo}
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