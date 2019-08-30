import React from 'react'
import MemberSearch from './MemberAutocomplete'
import CheckoutCart from './CheckoutCart'
import DateTimePicker from './DatePicker'
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import {withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import {showErrorSnackbarIfInReadOnlyMode, getUserName, getBearerAccessToken} from './Utilites';

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


class Checkout extends React.Component {

    constructor(props) {
        super(props);

        let message = '';
        let visible = false;
        if (parseInt(sessionStorage.getItem('token'), 10) === 0) {
            message = 'You are in view-only mode. This means that none of your actions will be saved to the database.';
            visible = false;
        }

        this.state = {
            member: '',
            memberEmail: '',
            memberId: '',
            list: [],
            datetime: '',
            snackbarVisible: visible,
            snackbarMessage: message,
            variant: 'info'
        };
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

    setDateTime = (newDateTime) => {
        this.setState({datetime: newDateTime})
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

    checkoutGear = () => {

        if (showErrorSnackbarIfInReadOnlyMode(this.setState.bind(this)))
            return;

        if (this.state.member === '') {
            this.setState({
                snackbarMessage: 'Checkout unsuccessful - please enter a valid member name.',
                snackbarVisible: true,
                variant: 'error'
            });
            return;
        }


        Promise.all([getBearerAccessToken(), getUserName()])
            .then(auth =>
                fetch(this.props.apiHost + '/gear/checkout', {
                    method: 'POST',
                    body: JSON.stringify({
                        gear: this.state.list,
                        officerName: auth[1],
                        member: this.state.member,
                        memberEmail: this.state.memberEmail,
                        dueDate: this.state.datetime
                    }),
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': auth[0]
                    },
                    mode: 'cors'
                }).then(response => response.json())
                    .then(response => {
                        if (response['status'] === 'Success!') {
                            this.setState({
                                snackbarVisible: true,
                                snackbarMessage: response['gear'].length.toString() + ' piece(s) of gear were successfully checked out to ' + response['member'],
                                variant: 'success',
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

    setMember = (memberInfo) => {
        this.setState({member: memberInfo.c_full_name, memberEmail: memberInfo.c_email, memberId: memberInfo.c_uid});
    };


    render() {
        return (
            <div style={{marginBottom: '12vh'}}>
                <Paper>
                    <Grid container
                          alignItems='center'
                          alignContent="stretch"
                          spacing={16}
                    >
                        <Grid xs={12} sm={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="h6">Member: </Typography>
                            <MemberSearch setMember={this.setMember} apiHost={this.props.apiHost}/>
                        </Grid>
                        <Grid xs={12} sm={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <CheckoutCart addGearToList={this.addGearToList} removeGear={this.removeGear}
                                          list={this.state.list} apiHost={this.props.apiHost} data={this.props.data}/>
                        </Grid>
                        <Grid xs={12} sm={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <DateTimePicker setDateTime={this.setDateTime} datetime={this.state.datetime}/>
                        </Grid>
                        <br/>
                    </Grid>
                </Paper>
                <Grid
                    container
                    justify='flex-end'
                >
                    <Grid item style={{margin: '3vh'}}>
                        <Button variant="contained" style={{backgroundColor: '#43A047'}} color="primary">
                            <Typography
                                variant="button"
                                onClick={this.checkoutGear}
                                style={{color: 'white'}}
                                align="left"
                            >
                                Checkout Gear
                            </Typography>
                        </Button>
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

export default withStyles(styles)(Checkout);