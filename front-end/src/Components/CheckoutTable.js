import React from 'react';
import ReactTable from "react-table";
import LoadingBar from './Loading';
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
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import CheckoutDialog from './CheckoutDialog'

class CheckoutTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data : [],
            fetched : false,
            snackbarVisible: false,
            snackbarMessage: '',
            variant: 'info',
            dialogOpen: false,
            dialogData: {},
        };


        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleCheckIn = this.handleCheckIn.bind(this);
        this.fetchCheckouts = this.fetchCheckouts.bind(this);
    }

    componentDidMount() {
        this.fetchCheckouts();
    }

    fetchCheckouts() {
        fetch(this.props.apiHost + this.props.checkoutURL)
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                this.setState({
                    data: myJson,
                    fetched: true
                });
            });
    }

    handleButtonPress() {
        this.setState({snackbarVisible: true, snackbarMessage: "Action unsuccessful - This feature has not been implemented yet.", variant: 'error'})
    }

    dialogClose = () => {
        this.setState({dialogOpen: false, dialogData: {} });
    };

    handleCheckIn() {
        if (sessionStorage.getItem('token') == 0) {
                this.setState({snackbarMessage: 'Check In unsuccessful - you are in view-only mode. Please log back in as an officer.', snackbarVisible: true, variant: 'error'});
                return;
        }

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

        fetch(this.props.apiHost + '/gear/checkin', {
            method: 'POST',
            body: JSON.stringify({authorization: sessionStorage.getItem('token'), gear: [{uid: this.state.dialogData.original.gear_uid}], date_checked_in: datetime}),
            headers:{
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {
                console.log(response);
                if (response['status'] == 'Success!') {

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
            })
            .catch(error => console.error(error));
    }


    handleSnackbarClose = () => {
        this.setState({snackbarVisible : false})
    };

    getOverdueSeverityColor(date_due) {
        var date1 = new Date(date_due);
        var date2 = new Date();
        var timeDiff = Math.abs(date1.getTime() - date2.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // if (diffDays < 0)

    };

    render() {

        let jsx;
        if (this.state.fetched)
            jsx = (
                <Fade in={true} mountOnEnter unmountOnExit>

                    <ReactTable
                        style={{height:'100%', fontSize:'11px'}}
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
                                    background: 'white', //getOverDueSeverityColor(rowInfo.row.date_due)
                                    cursor: 'pointer',
                                }
                            };
                        }}
                        columns={[
                            {
                                columns: [
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
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
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Item Type
                                            </div>
                                        ),
                                        accessor: "item",
                                        minWidth: 85,

                                        /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                                    },
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Checked Out To
                                            </div>
                                        ),
                                        accessor: "member_name",
                                        minWidth: 130,

                                    },
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Checkout Date
                                            </div>
                                        ),
                                        minWidth: 120,
                                        accessor: "date_checked_out",
                                    },
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Date Due
                                            </div>
                                        ),
                                        accessor: "date_due",
                                        minWidth: 80,
                                    },
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Officer Out
                                            </div>
                                        ),
                                        accessor: "officer_out",
                                        minWidth: 100,
                                    },
                                ]
                            }
                        ]}
                        className="-striped -highlight"
                    />
                </Fade>
            );
        else
            jsx = <LoadingBar />;

        return (
            <div style={{marginBottom: '12vh', height: '100%', }}>

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
                    <MySnackbarContentWrapper
                        onClose={this.handleSnackbarClose}
                        variant={this.state.variant}
                        message={this.state.snackbarMessage}
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


const styles1 = theme => ({
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
                    {message}
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

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

export default CheckoutTable;