import React, { Component } from 'react';
import TopBar from './Layouts/TopBar';
import BottomBar from './Layouts/BottomBar';
import EnhancedTable from './Components/Table';
import LinearIndeterminate from './Components/Loading';
import "./index.css";
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';

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
            data: null
        }
    }

    componentDidMount() {
        fetch('http://gear-app.com:5000/gear/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {

                console.log(myJson.length);

                //Needs to be converted to a map function
                for (let i = 0; i < myJson.length; i++)
                {
                    myJson[i]['id'] = i;

                    switch(parseInt(myJson[i]['condition_level'])) {
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
                    }
                }
                console.log(myJson);
                this.setState({data: myJson, loading: false});
            });
    }

    render() {

        if (this.state.loading)
        {
            return (
                <div className="App-Container" style={{width:'100vw'}}>
                    <TopBar />
                    <LinearIndeterminate />
                    <BottomBar />
                </div>
            );
        }
        else {
            return (
                <MuiThemeProvider theme={theme} className="App-Container">
                    <TopBar loginButtonText="gearmaster login"/>
                    <div style={{height:'70vh'}}>
                        {/*<EnhancedTable  data={this.state.data}/>*/}
                    </div>
                    <BottomBar />
                </MuiThemeProvider>
            );
        }
    }
}

export default App;
