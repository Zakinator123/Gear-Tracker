import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import {getBearerAccessToken, showErrorSnackbarIfInReadOnlyMode} from './Utilites';

const styles = theme => ({
    root: {
        flexGrow: 1,

    },
    menu: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
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

class AddMember extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            memberName: '',
            memberEmail: '',
            memberPhoneNumber: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSnackbarClose = () => {
        this.setState({snackbarVisible: false})
    };

    accessionGear = () => {

        if (showErrorSnackbarIfInReadOnlyMode(this.setState.bind(this)))
            return;

        if (this.state.memberName === '' || this.state.memberEmail === '' || this.state.memberPhoneNumber === '') {
            this.setState({
                snackbarMessage: 'Invalid member information - please fill out all required fields',
                snackbarVisible: true,
                variant: 'error'
            });
            return;
        }

        let member = {
            'member_name': this.state.memberName,
            'member_email': this.state.memberEmail,
            'member_phone_number': this.state.memberPhoneNumber
        };

        getBearerAccessToken().then(token =>
            fetch(this.props.apiHost + '/users/new', {
                method: 'POST',
                body: JSON.stringify({member_information: member}),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                mode: 'cors'
            }).then(response => response.json())
                .then(response => {
                    if (response['status'] === 'Success!') {
                        this.setState({
                            snackbarVisible: true,
                            snackbarMessage: response['message'],
                            variant: 'success',
                            memberName: '',
                            memberEmail: '',
                            memberPhoneNumber: '',
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
                })
        );
    };

    render() {
        return (
            <div style={{marginBottom: '12vh'}}>
                <Paper>
                    <Grid container
                          alignItems='center'
                          alignContent="stretch"
                          spacing={8}
                    >
                      <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="h6">Full Name: </Typography>
                            <TextField
                                placeholder="Enter the Member Full Name"
                                variant='outlined'
                                helperText="Be sure this member doesn't already show up in the member-autocomplete."
                                required
                                value={this.state.memberName}
                                onChange={(event) => this.setState({memberName: event.target.value})}
                            />
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="h6">Email: </Typography>
                            <TextField
                                placeholder="Enter the Member Email Address"
                                helperText="Email address should be one that the member checks frequently."
                                variant='outlined'
                                required
                                value={this.state.memberEmail}
                                onChange={(event) => this.setState({memberEmail: event.target.value})}
                            />
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="h6">Phone Number: </Typography>
                            <TextField
                                placeholder="Enter the Member's Phone Number"
                                helperText="Phone number format should be (XXX) XXX-XXXX"
                                variant='outlined'
                                required
                                value={this.state.memberPhoneNumber}
                                onChange={(event) => this.setState({memberPhoneNumber: event.target.value})}
                              />
                        </Grid>
                        <br/>
                    </Grid>
                </Paper>
                <Grid
                    xs={12}
                    container
                    justify='flex-end'
                >
                    <Grid item style={{margin: '3vh'}}>
                        <Button variant="raised" style={{backgroundColor: '#43A047'}} color="primary">
                            <Typography variant="button" style={{color: 'white'}} align="left"
                                        onClick={this.accessionGear}>
                                Save Member Information
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

export default withStyles(styles)(AddMember);
