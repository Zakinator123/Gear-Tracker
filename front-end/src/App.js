import React, { Component } from 'react';
import TopBar from './Layouts/TopBar';
import BottomBar from './Layouts/BottomBar';
import InventoryTable from './Components/Table';
import FullWidthTabs from './Layouts/NavigationTabs'
import "./index.css";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import {withStyles} from '@material-ui/core/styles';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';

const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#60ad5e',
            main: '#2e7d32',
            dark: '#005005',
            contrastText: '#fff',
        },
        secondary: {
            light: '#6f74dd',
            main: '#3949ab',
            dark: '#00227b',
            contrastText: '#fff',
        },
    },
});

class App extends Component {

    constructor(props)
    {
        super(props);
        this.state = {
            loggedIn: false,
            connected: false,
            addToHomeScreenSnackbar: false,
            deferredPrompt: null,
        };

        // this.apiHost = 'http://localhost:5000';
        this.apiHost = 'https://api.gear-tracker.com';

        this.gearmasterLoggedIn = this.gearmasterLoggedIn.bind(this);
        this.gearmasterLoggedOut = this.gearmasterLoggedOut.bind(this);
        this.connectionEstablished = this.connectionEstablished.bind(this);

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            this.setState({deferredPrompt: e, addToHomeScreenSnackbar: true});
        });
    }

    addToHomeScreen = () => {
        this.handleSnackbarClose();
        this.state.deferredPrompt.prompt();
        this.state.deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                this.setState({deferredPrompt :null});
            });
    };

    handleSnackbarClose = () => {
        this.setState({addToHomeScreenSnackbar: false});
    };

    connectionEstablished() {
        this.setState({connected: true})
    }

// Event handler called upon successful login.
    gearmasterLoggedIn() {
        this.setState({loggedIn: true})
    }

//Event handler called upon logout
    gearmasterLoggedOut() {
        this.setState({loggedIn: false});
        let storedToken = sessionStorage.getItem('token');
        fetch(this.apiHost + '/logout', {
            method: 'POST',
            body: JSON.stringify({token: storedToken}),
            headers:{
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => console.log(response));

        // Remove token from local storage.
        sessionStorage.removeItem('token');
    }

    render() {
        return (
            <div>
                <MuiThemeProvider theme={theme} >
                    <TopBar loggedIn={this.state.loggedIn} connected={this.state.connected} apiHost={this.apiHost} logIn={this.gearmasterLoggedIn} logOut={this.gearmasterLoggedOut}/>
                    {(this.state.loggedIn) ?
                        <FullWidthTabs data={this.state.data} loggedIn={this.state.loggedIn} apiHost={this.apiHost}/> :
                        <InventoryTable  connectionEstablished={this.connectionEstablished} loggedIn={this.state.loggedIn} apiHost={this.apiHost}/>}
                    <BottomBar />
                </MuiThemeProvider>

                <Snackbar
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    open={this.state.addToHomeScreenSnackbar}
                    onClose={this.handleSnackbarClose}
                    style={{margin: '2vh'}}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleSnackbarClose}
                        message="Add to home screen?"
                        variant="success"
                    />
                </Snackbar>

            </div>
        );
    }
}

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};


const snackbarStyles = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: '#B71C1C',
    },
    info: {
        backgroundColor: blue[900],
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    close:{marginTop: -20},
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    <Button onClick={this.addToHomeScreen}> {message} </Button>
                </span>
            }
            action={
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>
            }
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(snackbarStyles)(MySnackbarContent);

export default App;
