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
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

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
            aboutDialog: false,
            handbookDialog: false,
        }
    }

    //TODO: Refactor
    toggleDrawerOpen = () => {
        this.setState({drawerOpen: true})
    };

    toggleDrawerClose = () => {
        this.setState({drawerOpen: false})
    };

    openDialog = (dialog) => {
        this.setState({[dialog]: true})
    };

    closeDialog = (dialog) => {
        this.setState({[dialog]: false})
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
                        <Drawer open={this.state.drawerOpen} onClose={this.toggleDrawerClose}>
                            <div
                                tabIndex={0}
                                role="button"
                                onClick={this.toggleDrawerClose}
                            >
                                <div>
                                    <List>
                                        <ListItem
                                            button
                                            style={{width: '200px'}}
                                            onClick={() => this.openDialog('aboutDialog')}
                                        >
                                            <ListItemText primary="About" />
                                        </ListItem>
                                        <Divider />
                                        <ListItem
                                            button
                                            onClick={() => this.openDialog('handbookDialog')}
                                            style={{width: '200px'}}
                                        >
                                            <ListItemText primary="Gear Handbook" />
                                        </ListItem>
                                        <Divider />
                                    </List>
                                </div>
                            </div>
                        </Drawer>
                    </AppBar>
                </div>


                <Dialog onClose={() => this.closeDialog('aboutDialog')} scroll="body" open={this.state.aboutDialog} >
                    <DialogTitle id="form-dialog-title"> About Gear Tracker</DialogTitle>
                    <DialogContent>
                        <Typography>
                            Gear Tracker is an application created to help the Outdoors Club at UVA manage its gear inventory. It is currently in Beta and is being actively worked on.
                            Please report any errors or bugs to the author by sending an email with screenshots to <a href="mailto:zakey.faieq@willowtreeapps.com">zakey.faieq@willowtreeapps.com</a>.
                        </Typography>

                        {/*<Typography variant='caption'>Github:</Typography>*/}
                        {/*<a href="https://github.com/Zakinator123/Gear-Tracker">*/}
                            {/*<img src="./GitHub_Logo.png"/>*/}
                        {/*</a>*/}

                    </DialogContent>
                    <DialogActions style={{marginBottom: '1vh'}}>

                        <Button onClick={() => this.closeDialog('aboutDialog')} color="primary">
                            <Typography variant="button" style={{color:'grey'}} align="left">Close</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>

                <Dialog onClose={() => this.closeDialog('handbookDialog')} scroll="body" open={this.state.handbookDialog} >
                    <DialogTitle id="form-dialog-title"> The Outdoors at UVA Gear Handbook</DialogTitle>
                    <DialogContent>
                        <Typography>The Gear Handbook contains everything you need to know about our gear inventory, including information on where and how to check out gear, our gear treatment guidelines, and our gear policies. Below is the download link for the gear handbook PDF.</Typography>

                        <a
                            href="https://gear-tracker.com/Gear-Handbook.pdf"
                            download
                        >Download Link</a>

                    </DialogContent>
                    <DialogActions style={{marginBottom: '1vh'}}>
                        <Button onClick={() => this.closeDialog('handbookDialog')} color="primary">
                            <Typography variant="button" style={{color:'grey'}} align="left">Close</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        );
    }
}

TopBar.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);