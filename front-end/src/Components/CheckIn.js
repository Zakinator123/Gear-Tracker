import React from 'react'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import CheckInCart from './CheckInCart'
import {showErrorSnackbarIfInReadOnlyMode} from './utilites';


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


class CheckIn extends React.Component {

    constructor(props) {
        super(props);

        let message = '';
        let visible = false;
        if (parseInt(sessionStorage.getItem('token'), 10) === 0) {
            message = 'You are in view-only mode. This means that none of your actions will be saved to the database.';
            visible = false;
        }

        this.state = {
            list: [],
            datetime: '',
            snackbarVisible: visible,
            snackbarMessage: message,
            variant: 'info'
        };

        this.removeGear = this.removeGear.bind(this);
        this.addGearToList = this.addGearToList.bind(this);
        this.checkInGear = this.checkInGear.bind(this);
    }


    componentDidMount() {
        setTimeout(function () {
            if (parseInt(sessionStorage.getItem('token'), 10) === 0) {
                this.setState({snackbarVisible: true});
            }
        }.bind(this), 2000);
    }

    removeGear = (uid) => {
        for (let i = 0; i < this.state.list.length; i++) {
            if (this.state.list[i]['uid'] === uid)
                this.setState(prevState => {
                    prevState.list.splice(i, 1);
                    return {list: [...prevState.list]};
                });
        }
    };

    addGearToList = (response) => {
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
    };

    handleSnackbarClose = () => {
        this.setState({snackbarVisible: false})
    };


    checkInGear = () => {

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

        fetch(this.props.apiHost + '/gear/checkin', {
            method: 'POST',
            body: JSON.stringify({
                authorization: sessionStorage.getItem('token'),
                gear: this.state.list,
                date_checked_in: datetime
            }),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .then(response => {
                if (response['status'] === 'Success!') {
                    this.setState({
                        snackbarVisible: true,
                        snackbarMessage: response['count'].toString() + ' piece(s) of gear were successfully checked in.',
                        variant: 'success',
                        list: [],
                    })
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
    };


    render() {
        const {classes} = this.props;

        return (
            <div style={{marginBottom: '12vh'}}>
                <Grid container
                      alignItems='center'
                      direction="column"
                      alignContent="stretch">

                    <Grid md={6} lg={6} xl={6} item>
                        <Paper className={classes.paper}>
                            <CheckInCart addGearToList={this.addGearToList} removeGear={this.removeGear}
                                         list={this.state.list} apiHost={this.props.apiHost} data={this.props.data}/>
                        </Paper>
                    </Grid>

                    <Grid md={6} lg={6} xl={6} item>
                        <Grid container
                              justify="flex-end"
                              direction="column">
                            <Grid item>
                                <Button variant="contained" style={{backgroundColor: '#43A047'}} color="primary">
                                    <Typography variant="button" onClick={this.checkInGear} style={{color: 'white'}}
                                                align="left">Check In Gear</Typography>
                                </Button>
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

export default withStyles(styles)(CheckIn);