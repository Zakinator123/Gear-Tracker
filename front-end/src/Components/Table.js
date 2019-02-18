import React from 'react';
import ReactTable from "react-table";
import matchSorter from 'match-sorter'
import LoadingBar from './Loading';
import 'react-table/react-table.css'
import './Table.css';
import Fade from '@material-ui/core/Fade';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import OptionSelectorDialog from './OptionSelectorDialog'
import {showErrorSnackbarIfInReadOnlyMode} from './utilites';

class InventoryTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            currentCell: {},
            fetched: false,
            snackbarVisible: false,
            snackbarMessage: '',
            variant: '',
            dialogOpen: false,
            selectedValue: '',
        };
    }

    handleSnackbarClose = () => {
        this.setState({snackbarVisible: false})
    };

    handleDialogClickOpen = (currentCell) => {
        this.setState({dialogOpen: true, currentCell: currentCell});
    };

    handleDialogClose = value => {
        if (value === '') {
            this.setState({dialogOpen: false});
            return;
        }

        if (showErrorSnackbarIfInReadOnlyMode(this.setState.bind(this)))
            return;

        let cell = this.state.currentCell;
        let oldValue = this.state.data[cell.index][cell.column.id];
        let column = cell.column.id;
        let inputData = value;
        let gear_uid = cell.original.uid;

        if (oldValue === inputData || inputData == null || inputData === undefined)
            this.setState({dialogOpen: false});

        if (column === "condition_level") {
            switch (inputData) {
                case "Brand New":
                    inputData = 0;
                    break;
                case "Good":
                    inputData = 1;
                    break;
                case "Fair":
                    inputData = 2;
                    break;
                case "Poor":
                    inputData = 3;
                    break;
                default:
                    inputData = 1;
            }
        }

        fetch(this.props.apiHost + '/gear/edit', {
            method: 'POST',
            body: JSON.stringify({
                authorization: sessionStorage.getItem('token'),
                column: column,
                input_data: inputData,
                gear_uid: gear_uid
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {
                if (response['status'] === 'Success!') {
                    const data = [...this.state.data];
                    data[cell.index][cell.column.id] = value;
                    let message = 'Gear #' + cell.original.number + "'s '" + column + "' value changed from '" + oldValue + "' to '" + value + "'.";
                    this.setState({data: data, snackbarMessage: message, snackbarVisible: true, variant: 'success'});
                }
            })
            .catch(error => console.error(error));

        this.setState({dialogOpen: false});
    };

    //TODO: Figure out if any risks should be mitigated here (by checking/cleaning input)
    renderEditable = (cellInfo) => {

        if (!this.props.loggedIn)
            return this.state.data[cellInfo.index][cellInfo.column.id];

        let editable = true;
        let column = cellInfo.column.id;
        if (column === 'item' || column === 'condition_level')
            editable = false;

        return (
            <div
                style={{backgroundColor: "#fafafa"}}
                contentEditable={editable}
                onClick={() => {
                    if (column === 'item' || column === 'condition_level')
                        this.handleDialogClickOpen(cellInfo)
                }}
                suppressContentEditableWarning
                onKeyPress={e => {
                    if (e.key === "Enter")
                        e.target.blur();
                }}
                onBlur={e => {
                    if (showErrorSnackbarIfInReadOnlyMode(this.setState.bind(this)))
                        return;

                    let oldValue = this.state.data[cellInfo.index][cellInfo.column.id];
                    let column = cellInfo.column.id;
                    let inputData = e.target.innerHTML;
                    let gear_uid = cellInfo.original.uid;

                    if (oldValue === inputData)
                        return;

                    fetch(this.props.apiHost + '/gear/edit', {
                        method: 'POST',
                        body: JSON.stringify({
                            authorization: sessionStorage.getItem('token'),
                            column: column,
                            input_data: inputData,
                            gear_uid: gear_uid
                        }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        mode: 'cors'
                    }).then(response => response.json())
                        .catch(() => {
                            this.setState({
                                snackbarVisible: true,
                                snackbarMessage: 'An error occurred. Please contact the developer and provide screenshots and specific information regarding what caused the error.',
                                variant: 'error',
                                list: [],
                            })
                        })
                        .then(response => {
                            if (response['status'] === 'Success!') {
                                const data = [...this.state.data];
                                data[cellInfo.index][cellInfo.column.id] = inputData;
                                let message = 'Gear #' + cellInfo.original.number + "'s '" + column + "' value changed from '" + oldValue + "' to '" + inputData + "'.";
                                this.setState({
                                    data: data,
                                    snackbarMessage: message,
                                    snackbarVisible: true,
                                    variant: 'success'
                                });
                            }
                        })
                        .catch(() => {
                            this.setState({
                                snackbarVisible: true,
                                snackbarMessage: 'An error occurred. Please contact the developer and provide screenshots and specific information regarding what caused the error.',
                                variant: 'error',
                                list: [],
                            })
                        });
                }}
                dangerouslySetInnerHTML={{
                    __html: this.state.data[cellInfo.index][cellInfo.column.id]
                }}
            />
        );
    };

    componentDidMount() {
        fetch(this.props.apiHost + '/gear/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                for (let i = 0; i < myJson.length; i++) {
                    myJson[i]['id'] = i;

                    switch (parseInt(myJson[i]['condition_level'], 10)) {
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

                    switch (myJson[i]['status_level']) {
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
            })
            .catch(() => {
                this.setState({
                    snackbarVisible: true,
                    snackbarMessage: 'An error occurred. Please contact the developer and provide screenshots and specific information regarding what caused the error.',
                    variant: 'error',
                    list: [],
                })
            });
    }


    render() {

        let divClassName;
        let explanationText;
        let dialog;

        if (this.props.loggedIn) {
            divClassName = 'LoggedIn';
            explanationText = null;
            if (this.state.dialogOpen) {
                dialog = (
                    <OptionSelectorDialog
                        currentCell={this.state.currentCell}
                        selectedValue={this.state.selectedValue}
                        open={this.state.dialogOpen}
                        onClose={this.handleDialogClose}
                        apiHost={this.props.apiHost}
                    />
                );
            }
            else
                dialog = null;
        }
        else {
            divClassName = 'LoggedOut';
            explanationText = null;
            dialog = null;
        }

        let jsx;
        if (this.state.fetched) {
            jsx = (
                <div className={divClassName}>

                    {explanationText}
                    <Fade in={true} mountOnEnter unmountOnExit>

                        <ReactTable
                            style={{height: '100%'}}
                            data={this.state.data}
                            // filterable
                            // defaultFilterMethod={(filter, row) =>
                            // String(row[filter.id]) === filter.value}
                            showPaginationBottom={false}
                            defaultPageSize={this.state.data.length}
                            minRows={this.state.data.length}
                            columns={[
                                {
                                    /*Need to figure out how to modify header styling*/
                                    style: {fontColor: 'green'},
                                    columns: [
                                        {
                                            Header: () => (
                                                <div style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px'
                                                }}>
                                                    Gear #
                                                </div>
                                            ),
                                            /*Need to find out what 'id' does - look in react-table documentatinon*/
                                            id: "number",
                                            minWidth: 60,
                                            accessor: d => d.number,
                                            filterMethod: (filter, row) => row[filter.id] !== undefined ? String(row[filter.id]).contains(filter.value) : true,
                                            filterAll: true,
                                            Cell: this.renderEditable,
                                        },
                                        {
                                            Header: () => (
                                                <div style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px'
                                                }}>
                                                    Item Type
                                                </div>
                                            ),
                                            accessor: "item",
                                            /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["item"]}),
                                            filterAll: true,
                                            Cell: this.renderEditable,
                                        },
                                        {
                                            Header: () => (
                                                <div style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px'
                                                }}>
                                                    Description
                                                </div>
                                            ),
                                            accessor: "description",
                                            minWidth: 200,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["description"]}),
                                            filterAll: true,
                                            Cell: this.renderEditable,
                                        },
                                        {
                                            Header: () => (
                                                <div style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px'
                                                }}>
                                                    Condition
                                                </div>
                                            ),
                                            minWidth: 80,
                                            accessor: "condition_level",
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["condition_level"]}),
                                            filterAll: true,
                                            Cell: this.renderEditable,
                                        },
                                        {
                                            Header: () => (
                                                <div style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px'
                                                }}>
                                                    Status
                                                </div>
                                            ),
                                            accessor: "status_level",
                                            minWidth: 78,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["status_level"]}),
                                            filterAll: true,
                                        },
                                        {
                                            Header: () => (
                                                <div style={{
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    fontWeight: 'bold',
                                                    fontSize: '15px'
                                                }}>
                                                    Notes
                                                </div>
                                            ),
                                            accessor: "notes",
                                            minWidth: 150,
                                            filterMethod: (filter, rows) =>
                                                matchSorter(rows, filter.value, {keys: ["notes"]}),
                                            filterAll: true,
                                            Cell: this.renderEditable,
                                        },
                                    ]
                                }
                            ]}
                            defaultSorted={[
                                {
                                    id: "number",
                                    desc: false
                                }
                            ]}
                            className="-striped -highlight"
                        />
                    </Fade>


                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        style={{margin: '2vh'}}
                        open={this.state.snackbarVisible}
                        autoHideDuration={4500}
                        onClose={this.handleSnackbarClose}
                    >
                        <SnackbarContentWrapper
                            onClose={this.handleSnackbarClose}
                            variant={this.state.variant}
                            message={this.state.snackbarMessage}
                        />
                    </Snackbar>

                </div>
            );
        }
        else
            jsx = (
                <div className={divClassName}>
                    <LoadingBar/>;
                </div>
            );

        return (
            <div>
                {jsx}
                {dialog}
            </div>
        );
    }
}

export default InventoryTable;

// The following is for the delete button functionality
// this.props.loggedIn &&
//     {
//     Header: () => (
//     <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
//          Delete Item
//     </div>
// ),
//     minWidth: 120,
//         Cell: <IconButton size="small"><DeleteIcon fontSize='small'/></IconButton>
// },