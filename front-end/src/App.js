import React, { Component } from 'react';
import TopBar from './Layouts/TopBar';
import BottomBar from './Layouts/BottomBar';
import InventoryTable from './Components/Table';
import LoadingBar from './Components/Loading';
import FullWidthTabs from './Layouts/NavigationTabs'
import "./index.css";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
        };

        // this.apiHost = 'http://192.168.99.100:5000';
        this.apiHost = 'https://api.gear-app.com';

        this.gearmasterLoggedIn = this.gearmasterLoggedIn.bind(this);
        this.gearmasterLoggedOut = this.gearmasterLoggedOut.bind(this);
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
                <div className="App-Container">
                        <MuiThemeProvider theme={theme} >
                            <TopBar loggedIn={this.state.loggedIn} connected={true} apiHost={this.apiHost} logIn={this.gearmasterLoggedIn} logOut={this.gearmasterLoggedOut}/>
                            {(this.state.loggedIn) ? <FullWidthTabs data={this.state.data} loggedIn={this.state.loggedIn} apiHost={this.apiHost}/> : <InventoryTable loggedIn={this.state.loggedIn} apiHost={this.apiHost}/>}
                            <BottomBar />
                        </MuiThemeProvider>
                    </div>
            );
        }
}

export default App;
