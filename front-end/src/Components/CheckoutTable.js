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
import Typography from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import CheckoutDialog from './CheckoutDialog'

class CheckoutTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data : [],
            fetched : false,
            snackbarVisible: true,
            snackbarMessage: 'To check in, renew, or send a late reminder email for any piece of gear, press the row expansion arrows to the left!',
            variant: 'info',
            dialogOpen: false,
            dialogData: {},
        };

        fetch(props.apiHost + '/checkout/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                this.setState({data: myJson,
                    fetched: true});
                console.log(myJson[0]['date_due'].substring(0, 10));
                let date1 = new Date(myJson['date_due']);
                console.log(date1);
            });

        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        this.handleCheckIn = this.handleCheckIn.bind(this);
    }

    handleButtonPress() {
        this.setState({snackbarVisible: true, snackbarMessage: "Action unsuccessful - you are in view-only mode. Please log back in as an officer.", variant: 'error'})
    }

    dialogClose = () => {
        this.setState({dialogOpen: false})
    };

    handleCheckIn() {
        this.setState({snackbarVisible: true, snackbarMessage: "Action unsuccessful - you are in view-only mode. Please log back in as an officer.", variant: 'error'})
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
                                        minWidth: 50,
                                        accessor: d => d.number,
                                    },
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Item Type
                                            </div>
                                        ),
                                        accessor: "item",
                                        minWidth: 70,

                                        /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                                    },
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Checked Out To
                                            </div>
                                        ),
                                        accessor: "member_name",
                                        minWidth: 100,

                                    },
                                    {
                                        Header: () => (
                                            <div style={{width: '100%', textAlign: 'left', fontWeight: 'bold', fontSize: '15px'}}>
                                                 Checkout Date
                                            </div>
                                        ),
                                        minWidth: 100,
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
                                        minWidth: 70,
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


                <CheckoutDialog apiHost={this.props.apiHost} onClose={this.dialogClose} dialogOpen={this.state.dialogOpen} rowData={this.state.dialogData}/>
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