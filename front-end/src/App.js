import React, { Component } from 'react';
import TopBar from './Layouts/TopBar';
import BottomBar from './Layouts/BottomBar';
import InventoryTable from './Components/Table';
import LinearIndeterminate from './Components/Loading';
import FullWidthTabs from './Layouts/NavigationTabs'
import "./index.css";
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import 'react-table/react-table.css'

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
            loading: true,
            data: null,
            loggedIn: false,
        };

        this.gearmasterLoggedIn = this.gearmasterLoggedIn.bind(this);
        this.gearmasterLoggedOut = this.gearmasterLoggedOut.bind(this);
    }

    componentDidMount() {
        fetch('http://192.168.99.100:5000/gear/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {

                //Needs to be converted to a map function
                for (let i = 0; i < myJson.length; i++)
                {
                    myJson[i]['id'] = i;

                    switch(parseInt(myJson[i]['condition_level'], 10)) {
                        case 0:
                            myJson[i]['condition_level'] = "Brand New";
                            break;
                        case 1:
                            myJson[i]['condition_level'] = "Good";
                            break;
                        case 2:
                            myJson[i]['condition_level'] = "Fair";
                            break;
                        case 3:
                            myJson[i]['condition_level'] = "Poor";
                            break;
                        default:
                            myJson[i]['condition_level'] = "Unknown condition level";
                            break;
                    }

                    switch(myJson[i]['status_level']) {
                        case 0:
                            myJson[i]['status_level'] = "Checked In";
                            break;
                        case 1:
                            myJson[i]['status_level'] = "Checked Out";
                            break;
                        case 2:
                            myJson[i]['status_level'] = "Missing";
                            break;
                        case 3:
                            myJson[i]['status_level'] = "Permanent";
                            break;
                        default:
                            myJson[i]['status_level'] = "Unknown status level";
                            break;
                    }
                }
                this.setState({data: myJson, loading: false});
            });
    }

    gearmasterLoggedIn() {
        this.setState({loggedIn: true})
    }

    gearmasterLoggedOut() {
        // Call the logout API here.
        sessionStorage.removeItem('token');
        this.setState({loggedIn: false})
    }

    render() {

        if (this.state.loading)
        {
            return (
                <div className="App-Container">
                    <MuiThemeProvider theme={theme} >
                        <TopBar loggedIn={this.state.loggedIn} logIn={this.gearmasterLoggedIn} logOut={this.gearmasterLoggedOut}/>
                        <div>
                            <LinearIndeterminate />
                        </div>
                        <BottomBar />
                    </MuiThemeProvider>
                </div>
            );
        }
        else {

            let app_container_when_API_connection_established;

            if (this.state.loggedIn)
            {
                app_container_when_API_connection_established = (
                    <div className="App-Container">
                        <MuiThemeProvider theme={theme} >
                            <TopBar loggedIn={this.state.loggedIn} logIn={this.gearmasterLoggedIn} logOut={this.gearmasterLoggedOut}/>
                            <FullWidthTabs data={this.state.data} loggedIn={this.state.loggedIn}/>
                            <BottomBar />
                        </MuiThemeProvider>
                    </div>
                );
            }
            else
                app_container_when_API_connection_established = (
                    <div className="App-Container">
                        <MuiThemeProvider theme={theme} >
                            <TopBar loggedIn={this.state.loggedIn} logIn={this.gearmasterLoggedIn} logOut={this.gearmasterLoggedOut}/>
                            <InventoryTable data={this.state.data} loggedIn={this.state.loggedIn}/>
                            <BottomBar />
                        </MuiThemeProvider>
                    </div>
                );

            return app_container_when_API_connection_established;
        }
    }
}

export default App;
