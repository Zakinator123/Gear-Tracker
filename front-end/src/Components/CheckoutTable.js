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
import SubRowComponent from './CheckoutTableExpansionRow'


class CheckoutTable extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data : [],
            fetched : false,
            snackbarVisible: true,
            snackbarMessage: 'To check in, renew, or send a late reminder email for any piece of gear, press the row expansion arrows to the left!',
            variant: 'info'
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

    handleCheckIn() {
        this.setState({snackbarVisible: true, snackbarMessage: "Action unsuccessful - you are in view-only mode. Please log back in as an officer.", variant: 'error'})
    }

    handleSnackbarClose = () => {
        this.setState({snackbarVisible : false})
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
                        SubComponent={row => {
                            return (
                                <SubRowComponent handleCheckIn={this.handleCheckIn} handleButtonPress={this.handleButtonPress} row={row}/>
                            );
                        }}

                        columns={[
                            {
                                columns: [
                                    {
                                        Header: "Gear #",
                                        /*Need to find out what 'id' does - look in react-table documentatinon*/
                                        id: "number",
                                        minWidth: 50,
                                        accessor: d => d.number,
                                    },
                                    {
                                        Header: "Item Type",
                                        accessor: "item",
                                        minWidth: 70,

                                        /*Eventually needs to be a dropdown menu based on a list of ItemTypes.*/
                                    },
                                    {
                                        Header: "Checked Out To",
                                        accessor: "member",
                                        minWidth: 100,

                                    },
                                    {
                                        Header: "Checkout Date",
                                        minWidth: 100,
                                        accessor: "date_checked_out",
                                    },
                                    {
                                        Header: "Due Date",
                                        accessor: "date_due",
                                        minWidth: 80,
                                    },
                                    {
                                        Header: "Officer Out",
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