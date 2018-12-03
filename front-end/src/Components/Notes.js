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
import {withStyles} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';


class Notes extends React.Component {
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

        this.handleButtonPress = this.handleButtonPress.bind(this);
        this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
        // this.handleCheckIn = this.handleCheckIn.bind(this);
        // this.fetchCheckouts = this.fetchCheckouts.bind(this);
    }

    // componentDidMount() {
    //     this.fetchCheckouts();
    // }
    //
    // fetchCheckouts() {
    //     fetch(this.props.apiHost + this.props.checkoutURL)
    //         .then((response) => {
    //             return response.json();
    //         })
    //         .then((myJson) => {
    //             this.setState({
    //                 data: myJson,
    //                 fetched: true
    //             });
    //         });
    // }

    handleButtonPress() {
        this.setState({
            snackbarVisible: true,
            snackbarMessage: "Action unsuccessful - This feature has not been implemented yet.",
            variant: 'error'
        })
    }

    dialogClose = () => {
        this.setState({dialogOpen: false, dialogData: {}});
    };

    // handleCheckIn() {
    //     if (sessionStorage.getItem('token') == 0) {
    //             this.setState({snackbarMessage: 'Check In unsuccessful - you are in view-only mode. Please log back in as an officer.', snackbarVisible: true, variant: 'error'});
    //             return;
    //     }
    //
    //     let today = new Date(Date.now() + 1);
    //     let date;
    //     if (today.getDate().toString().length > 1)
    //         date = today.getDate().toString();
    //     else
    //         date = "0" + today.getDate();
    //
    //     let month;
    //     if ((today.getMonth() + 1).toString().length > 1)
    //         month = (today.getMonth() + 1).toString();
    //     else
    //         month = "0" + (today.getMonth() + 1);
    //
    //     let datetime = today.getFullYear() + "-"
    //         + month + "-"
    //         + date + "T"
    //         + "23:59";
    //
    //     fetch(this.props.apiHost + '/gear/checkin', {
    //         method: 'POST',
    //         body: JSON.stringify({authorization: sessionStorage.getItem('token'), gear: [{uid: this.state.dialogData.original.gear_uid}], date_checked_in: datetime}),
    //         headers:{
    //             'Content-Type': 'application/json'
    //         },
    //         mode: 'cors'
    //     }).then(response => response.json())
    //         .catch(error => console.error('Error with HTTP request:', error))
    //         .then(response => {
    //             console.log(response);
    //             if (response['status'] == 'Success!') {
    //
    //                 this.fetchCheckouts();
    //
    //                 this.setState({
    //                     snackbarVisible: true,
    //                     snackbarMessage: response['count'].toString() + ' piece(s) of gear were successfully checked in.',
    //                     variant: 'success',
    //                     dialogOpen: false,
    //                     dialogData: {},
    //                     list: [],
    //                 })
    //             }
    //         })
    //         .catch(error => console.error(error));
    // }


    handleSnackbarClose = () => {
        this.setState({snackbarVisible: false})
    };

    getOverdueSeverityColor(date_due) {
        var date1 = new Date(date_due);
        var date2 = new Date();
        var timeDiff = Math.abs(date1.getTime() - date2.getTime());
        var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
        // if (diffDays < 0)

    };

    render() {
        //
        // let jsx;
        // if (this.state.fetched)
        //     jsx = null;
        // else
        //     jsx = <LoadingBar/>;

        return (
            <div style={{marginBottom: '12vh', height: '100%',}}>

                {/*{jsx}*/}


                <Grid container spacing={16}>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Typography variant="title">
                                    Notes Functionality coming soon!
                                </Typography>
                                <br/>
                                <Typography color="textSecondary">
                                    Last edited by Zakey Faieq on 12/1 at 1:00pm
                                </Typography>
                                <Typography component="p">
                                    See adjacent sample note for an idea of what this would look like.
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    // onClick={this.handleClose}
                                    color="primary"
                                >
                                    <Typography
                                        variant="button"
                                        style={{color: 'red'}}
                                        align="left">
                                        Delete Note
                                    </Typography>
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Typography variant="title">
                                    (Example) Kendall Benoit has a couple blue slings
                                </Typography>
                                <br/>
                                <Typography color="textSecondary">
                                    Last edited by Bill Talley on 11/23 at 1:00pm
                                </Typography>
                                <Typography component="p">
                                    Kendall has a 2 double length blue slings
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    // onClick={this.handleClose}
                                    color="primary"
                                >
                                    <Typography
                                        variant="button"
                                        style={{color: 'red'}}
                                        align="left">
                                        Delete Note
                                    </Typography>
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                </Grid>


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
    close: {marginTop: -20},
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
    const {classes, className, message, onClose, variant, ...other} = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)}/>
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
                    <CloseIcon className={classes.icon}/>
                </IconButton>
            }
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

export default Notes;