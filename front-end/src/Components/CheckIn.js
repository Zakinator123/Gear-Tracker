import React from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles';
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
import CheckInCart from './CheckInCart'
import Slide from '@material-ui/core/Slide';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    demo: {
        height: '100%',
    },
    paper: {
        padding: theme.spacing.unit * 2,
        margin: theme.spacing.unit,
        height: '100%',
        color: theme.palette.text.secondary,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
});


class CheckIn extends React.Component{

    constructor(props){
        super(props);

        let message = '';
        let visible = false;
        if (sessionStorage.getItem('token') == 0) {
            message = 'You are in view-only mode. This means that none of your actions will be saved to the database.';
            visible = false;
        }

        this.state = {
            member: '',
            list : [],
            datetime : '',
            snackbarVisible: visible,
            snackbarMessage: message,
            variant: 'info'
        };

        this.removeGear = this.removeGear.bind(this);
        this.addGearToList = this.addGearToList.bind(this);
        this.checkInGear = this.checkInGear.bind(this);
    }


    componentDidMount() {
        setTimeout(function() {if (sessionStorage.getItem('token') == 0) {this.setState({snackbarVisible: true});}}.bind(this), 2000);
    }

    removeGear(uid) {
        for (let i = 0; i < this.state.list.length; i++)
        {
            if (this.state.list[i]['uid'] == uid)
                this.setState(prevState=>{
                    prevState.list.splice(i, 1);
                    return {list: [...prevState.list]};
                });
        }
    }

    addGearToList(response) {
        let count = 0;
        for (let i = 0; i < response.length; i++) {
            let gear = response[i];
            this.setState(prevState => ({
                list: [...prevState.list, {
                    number: gear['number'],
                    item: gear['item'],
                    description: gear['description'],
                    uid: gear['uid']
                }]
            }));
            count++;
        }

        return count;
    }

    handleSnackbarClose = () => {
        this.setState({snackbarVisible : false})
    };


    checkInGear() {

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
            body: JSON.stringify({authorization: sessionStorage.getItem('token'), gear: this.state.list, date_checked_in: datetime}),
            headers:{
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {
                console.log(response);
                if (response['status'] == 'Success!') {
                    this.setState({
                        snackbarVisible: true,
                        snackbarMessage: response['count'].toString() + ' piece(s) of gear were successfully checked in.',
                        variant: 'success',
                        list: [],
                    })
                }
            })
            .catch(error => console.error(error));
    }


    render() {
        const { classes } = this.props;

        return(
            <div style={{marginBottom: '12vh'}}>
                <Grid container
                      alignItems='center'
                      direction="column"
                      alignContent="stretch">

                    <Grid md={6} lg={6} xl={6} item>
                        <Slide in={true}  style={{ transitionDelay: 100}} direction="up" mountOnEnter unmountOnExit>
                            <Paper className={classes.paper}>
                                <CheckInCart addGearToList={this.addGearToList} removeGear={this.removeGear} list={this.state.list} apiHost={this.props.apiHost} data={this.props.data}/>
                            </Paper>
                        </Slide>
                    </Grid>

                    <Grid md={6} lg={6} xl={6} item>
                        <Grid container
                              justify="flex-end"
                              direction="column">
                            <Grid item>
                                <Slide in={true}  style={{ transitionDelay: 200}} direction="up" mountOnEnter unmountOnExit>
                                    <Button variant="raised" style={{backgroundColor: '#43A047'}} color="primary">
                                        <Typography variant="button" onClick={this.checkInGear} style={{color:'white'}} align="left">Check In Gear</Typography>
                                    </Button>
                                </Slide>
                            </Grid>
                        </Grid>
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

export default withStyles(styles)(CheckIn);