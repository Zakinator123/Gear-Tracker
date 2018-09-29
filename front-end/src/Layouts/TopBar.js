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
import MenuIcon from '@material-ui/icons/Menu';
import IconButton from '@material-ui/core/IconButton';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';




const styles = theme => ({
    root: {
        flexGrow: 1,
    },
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


class TopBar extends React.Component {
    constructor(props) {
        super (props);

        this.state = {
            drawerOpen: false,
        }
    }

    //TODO: Refactor
    toggleDrawerOpen = () => {
        this.setState({drawerOpen: true})
    };

    toggleDrawerClose = () => {
        this.setState({drawerOpen: false})
    };

    render() {
        const {classes} = this.props;

        let loginLogoutButton;

        if (this.props.connected == false)
            loginLogoutButton =
                <Button style={{visibility: 'hidden'}} color="primary" variant="contained"><Typography variant="button"
                                                                                                       style={{visibility: 'hidden'}}>Login</Typography>
                </Button>;
        else if (this.props.loggedIn === false)
            loginLogoutButton = (
                <Slide in={true} style={{transitionDelay: 300}} mountOnEnter unmountOnExit>
                    <LoginDialog logIn={this.props.logIn} apiHost={this.props.apiHost}/>
                </Slide>
            );
        else
            loginLogoutButton = (
                <Button color="primary" variant="contained" onClick={this.props.logOut}>
                    <Typography variant="button" style={{color: "#FFFFFF"}}>Logout</Typography>
                </Button>
            );

        // let titleVariant;
        // if (window.matchMedia("(min-width: 800px)").matches)
        //     titleVariant = "title";
        // else
        //     titleVariant = "body2";

        let logo = <ClubLogo classes={classes}/>;


        return (
            <div className="TopBar">
                <div className={classes.root}>
                    <AppBar position="static">
                        <Toolbar>
                            {/*<Typography variant={titleVariant} color="inherit" align="left" className={classes.flex}>*/}
                            {/*Outdoors at UVA <br/>Gear Inventory*/}
                            {/*</Typography>*/}
                            <IconButton
                                className={classes.menuButton}
                                color="inherit"
                                aria-label="Menu"
                                style={{marginRight: '5vh'}}
                                onClick={this.toggleDrawerOpen}
                            >
                                <MenuIcon/>
                            </IconButton>
                            {logo}
                            {loginLogoutButton}
                        </Toolbar>
                        {/*<Drawer open={this.state.drawerOpen} onClose={() => null}>*/}
                            {/*<div*/}
                                {/*tabIndex={0}*/}
                                {/*role="button"*/}
                                {/*onClick={this.toggleDrawerClose}*/}
                                {/*onMouseLeave={this.toggleDrawerClose}*/}
                            {/*>*/}
                                {/*<div>*/}
                                    {/*<List>*/}
                                        {/*<ListItem button>*/}
                                          {/*<ListItemText primary="Trash" />*/}
                                        {/*</ListItem>*/}
                                    {/*</List>*/}
                                    {/*<Divider />*/}
                                {/*</div>*/}
                            {/*</div>*/}
                        {/*</Drawer>*/}
                    </AppBar>
                </div>
            </div>
        );
    }
}

TopBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);