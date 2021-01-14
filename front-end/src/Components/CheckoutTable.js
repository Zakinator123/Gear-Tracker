import React from 'react';
import ReactTable from 'react-table-6';
import LoadingBar from './Loading';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import CheckoutDialog from './CheckoutDialog'
import SnackbarContentWrapper from './SnackbarContentWrapper';
import {getBearerAccessToken, getUserName, showErrorSnackbarIfInReadOnlyMode} from './Utilites';

class CheckoutTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: [],
            fetched: false,
            snackbarVisible: false,
            snackbarMessage: '',
            variant: 'info',
            dialogOpen: false,
            dialogData: {},
        };
    }

    componentDidMount() {
        this.fetchCheckouts();
    }

    fetchCheckouts = () =>
        getBearerAccessToken().then(token =>
        fetch(this.props.apiHost + this.props.checkoutURL,
            {headers: {'Authorization': token}})
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                this.setState({
                    data: myJson,
                    fetched: true
                });
            }));

    handleButtonPress = () => {
        this.setState({
            snackbarVisible: true,
            snackbarMessage: "Action unsuccessful - This feature has not been implemented yet.",
            variant: 'error'
        })
    };

    dialogClose = () => {
        this.setState({dialogOpen: false, dialogData: {}});
    };

    handleCheckIn = () => {
        if (showErrorSnackbarIfInReadOnlyMode(this.setState.bind(this)))
            return;

        let today = new Date(Date.now() + 1);
        let date;
        if (today.getDate().toString().length > 1)
            date = today.getDate().toString();
        else
            date = "0" + today.getDate();

        let month;
        if ((today.getMonth() + 1).toString().length > 1)
            month = (today.getMonth() + 1).toString();
        else
            month = "0" + (today.getMonth() + 1);

        let datetime = today.getFullYear() + "-"
            + month + "-"
            + date + "T"
            + "23:59";

        Promise.all([getBearerAccessToken(), getUserName()]).then(auth =>
            fetch(this.props.apiHost + '/gear/checkin', {
                method: 'POST',
                body: JSON.stringify({
                    gear: [{uid: this.state.dialogData.original.gear_uid}],
                    date_checked_in: datetime,
                    officerName: auth[1]
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': auth[0]
                },
                mode: 'cors'
            }).then(response => response.json())
                .then(response => {
                    console.log(response);
                    if (response['status'] === 'Success!') {

                        this.fetchCheckouts();

                        this.setState({
                            snackbarVisible: true,
                            snackbarMessage: response['count'].toString() + ' piece(s) of gear were successfully checked in.',
                            variant: 'success',
                            dialogOpen: false,
                            dialogData: {},
                            list: [],
                        })
                    }
                    else throw "Error";
                })
                .catch(() => {
                    this.setState({
                        snackbarVisible: true,
                        snackbarMessage: 'An error occurred. Please contact the developer and provide screenshots and specific information regarding what caused the error.',
                        variant: 'error',
                        list: [],
                    })
                }));
    };


    handleSnackbarClose = () => {
        this.setState({snackbarVisible: false})
    };

    getOverdueSeverityColor = (date_due) => {
        var date1 = new Date(date_due);
        var date2 = new Date();
        var timeDiff = date2.getTime() - date1.getTime();
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

        let color;
        if (diffDays > 0) {
            if (diffDays > 30) {
                diffDays = 30;
            }
            color = this.shadeColor2("#FF0000", 1 - ((Math.abs(diffDays)) / 45));
        }
        else if (diffDays < 0)
            color = "#E2FEE2";
        else
            color = "#FFFFFF";

        return color;
    };

    shadeColor2 = (color, percent) => {
        var f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent,
            R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
        return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    };

    render() {
        let jsx;
        if (this.state.fetched)
            jsx = (
                <Fade in={true} mountOnEnter unmountOnExit>

                    <ReactTable
                        style={{height: '100%', fontSize: '11px'}}
                        data={this.state.data}
                        showPaginationBottom={false}
                        defaultPageSize={this.state.data.length}
                        minRows={this.state.data.length}
                        getTrProps={(state, rowInfo, column) => {
                            return {
                                onClick: () => {
                                    this.setState({dialogOpen: true, dialogData: rowInfo})
                                },
                                style: {
                                    backgroundColor: (!this.props.pastCheckouts ? this.getOverdueSeverityColor(rowInfo.row.date_due) : 'white'),
                                    cursor: 'pointer',
                                }
                            };
                        }}
                        columns={[
                            {
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
                                        minWidth: 85,

                                        /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                                    },
                                    {
                                        Header: () => (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                fontSize: '15px'
                                            }}>
                                                Checked Out To
                                            </div>
                                        ),
                                        accessor: "member_name",
                                        minWidth: 130,

                                    },
                                    {
                                        Header: () => (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                fontSize: '15px'
                                            }}>
                                                Checkout Date
                                            </div>
                                        ),
                                        minWidth: 120,
                                        accessor: "date_checked_out",
                                    },
                                    {
                                        Header: () => (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                fontSize: '15px'
                                            }}>
                                                Date Due
                                            </div>
                                        ),
                                        accessor: "date_due",
                                        minWidth: 80,
                                    },
                                    {
                                        Header: () => (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                fontSize: '15px'
                                            }}>
                                                Officer Out
                                            </div>
                                        ),
                                        accessor: "officer_out",
                                        minWidth: 100,
                                    },
                                    this.props.pastCheckouts &&
                                    {
                                        Header: () => (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                fontSize: '15px'
                                            }}>
                                                Check-in Date
                                            </div>
                                        ),
                                        accessor: "date_checked_in",
                                        minWidth: 100,
                                    },
                                    this.props.pastCheckouts &&
                                    {
                                        Header: () => (
                                            <div style={{
                                                width: '100%',
                                                textAlign: 'left',
                                                fontWeight: 'bold',
                                                fontSize: '15px'
                                            }}>
                                                Officer In
                                            </div>
                                        ),
                                        accessor: "officer_in",
                                        minWidth: 100,
                                    }
                                ]
                            }
                        ]}
                        className="-striped -highlight"
                    />
                </Fade>
            );
        else
            jsx = <LoadingBar/>;

        return (
            <div style={{marginBottom: '12vh', height: '100%',}}>

                {jsx}

                <CheckoutDialog
                    apiHost={this.props.apiHost}
                    onClose={this.dialogClose}
                    dialogOpen={this.state.dialogOpen}
                    rowData={this.state.dialogData}
                    handleCheckIn={this.handleCheckIn}
                    handleRenew={this.handleButtonPress}
                    pastCheckouts={this.props.pastCheckouts}
                />
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    style={{margin: '2vh'}}
                    open={this.state.snackbarVisible}
                    autoHideDuration={7000}
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
}

export default CheckoutTable;