import React from 'react';
import ReactTable from "react-table";
import Typography from '@material-ui/core/Typography';
import matchSorter from 'match-sorter'
import LoadingBar from './Loading';
import 'react-table/react-table.css'
import './Table.css';
import Fade from '@material-ui/core/Fade';


class InventoryTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            fetched: false
        };
    }

    componentDidMount() {
        fetch(this.props.apiHost + '/gear/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
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
                this.setState({data: myJson, fetched: true});
                if (!this.props.loggedIn)
                    this.props.connectionEstablished();
            });
    }


    render() {

        let divClassName;
        let explanationText;
        if (this.props.loggedIn) {
            divClassName = 'LoggedIn';
            explanationText = null;
        }
        else {
            divClassName = 'LoggedOut';
            explanationText = <Typography variant="body2" color="inherit" align="center"> Scroll, sort, and search through the table below to view Outdoors at UVA's Gear Inventory!</Typography>
        }

        let jsx;
        if (this.state.fetched)
        {
            jsx = (
                <div className={divClassName}>

                    {explanationText}
                    <Fade in={true} mountOnEnter unmountOnExit>

                        <ReactTable
                            style={{height:'100%'}}
                            data={this.state.data}
                            filterable
                            defaultFilterMethod={(filter, row) =>
                            String(row[filter.id]) === filter.value}
                            showPaginationBottom={false}
                            defaultPageSize={this.state.data.length}
                            minRows={this.state.data.length}

                            columns={[
                                {
                                    /*Need to figure out how to modify header styling*/
                                    style: {fontColor:'green'},
                                    columns: [
                                        {
                                            Header: "Number",
                                            /*Need to find out what 'id' does - look in react-table documentatinon*/
                                            id: "number",
                                            minWidth: 53,
                                            accessor: d => d.number,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["number"] }),
                                            filterAll: true
                                        },
                                        {
                                            Header: "Item Type",
                                            accessor: "item",
                                            /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["item"] }),
                                            filterAll: true
                                        },
                                        {
                                            Header: "Description",
                                            accessor: "description",
                                            minWidth: 200,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["description"] }),
                                            filterAll: true
                                        },
                                        {
                                            Header: "Condition",
                                            minWidth: 60,
                                            accessor: "condition_level",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["condition_level"] }),
                                            filterAll: true
                                        },
                                        {
                                            Header: "Status",
                                            accessor: "status_level",
                                            minWidth: 78,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["status_level"] }),
                                            filterAll: true
                                        },
                                        {
                                            Header: "Notes",
                                            accessor: "notes",
                                            minWidth: 150,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, { keys: ["notes"] }),
                                            filterAll: true
                                        },
                                    ]
                                }
                            ]}
                            className="-striped -highlight"
                        />
                    </Fade>
                </div>
            );
        }
        else
            jsx =(
                <div className={divClassName}>
                    <LoadingBar/>;
                </div>
            );

        return <div>{jsx}</div>;
    }
}

export default InventoryTable;