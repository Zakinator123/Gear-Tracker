import React, {Component} from 'react';
import TopBar from './Layouts/TopBar';
import BottomBar from './Layouts/BottomBar';
import InventoryTable from './Components/Table';
import FullWidthTabs from './Layouts/NavigationTabs'
import "./index.css";
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles';

import {withStyles} from '@material-ui/core/styles';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
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

    constructor(props) {
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

        // if (sessionStorage.getItem('token') !== '')
        // {
        //     this.gearmasterLoggedIn();
        // }

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later.
            this.setState({deferredPrompt: e, addToHomeScreenSnackbar: true});
        });

        // // Detects if device is on iOS
        // const isIos = () => {
        //     const userAgent = window.navigator.userAgent.toLowerCase();
        //     return /iphone|ipad|ipod/.test( userAgent );
        // };
        //
        // // Detects if device is in standalone mode
        // const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);
        //
        // // Checks if should display install popup notification:
        // if (isIos() && !isInStandaloneMode()) {
        //     this.setState({ showInstallMessage: true });
        // }
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
        sessionStorage.removeItem('access_token')

    }

    render() {
        return (
            <div>
                <MuiThemeProvider theme={theme}>
                    <TopBar loggedIn={this.state.loggedIn}
                            connected={this.state.connected}
                            apiHost={this.apiHost}
                            logIn={this.gearmasterLoggedIn}
                            logOut={this.gearmasterLoggedOut}
                    />
                    {(this.state.loggedIn) ?
                        <FullWidthTabs data={this.state.data} loggedIn={this.state.loggedIn} apiHost={this.apiHost}/> :
                        <InventoryTable connectionEstablished={this.connectionEstablished}
                                        loggedIn={this.state.loggedIn} apiHost={this.apiHost}/>}
                    <BottomBar/>
                </MuiThemeProvider>

                <Snackbar
                    anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                    open={this.state.addToHomeScreenSnackbar}
                    onClose={this.handleSnackbarClose}
                    style={{margin: '2vh'}}
                >
                    <SnackbarContent
                        style={{backgroundColor: green[600]}}
                        aria-describedby="client-snackbar"
                        message={
                            <span
                                id="client-snackbar"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center'
                                }}
                            >
                                <InfoIcon
                                    style={{
                                        opacity: 0.9,
                                        marginRight: theme.spacing.unit,
                                    }}
                                />
                                <Button onClick={this.addToHomeScreen}> Add to home screen? </Button>
                            </span>
                        }
                        action={
                            <IconButton
                                key="close"
                                aria-label="Close"
                                color="inherit"
                                style={{marginTop: '-20'}}
                                onClick={this.handleSnackbarClose}
                            >
                                <CloseIcon style={{marginTop: '-20'}}/>
                            </IconButton>
                        }
                    />
                </Snackbar>

            </div>
        );
    }
}

export default App;
