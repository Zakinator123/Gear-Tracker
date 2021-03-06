import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';

export default class LoginDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            email: '',
            password: '',
            error: false,
            errorMessageVisibility: 'hidden',
            errorMessage: ''
        };
    }

    handleClickOpen = () => {
        this.setState({open: true,});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    handleChangeEmail = event => {
        this.setState({email: event.target.value});
    };

    handleChangePassword = event => {
        this.setState({password: event.target.value});
    };

    handleSubmit = () => {
        this.setState({error: false, errorMessageVisibility: 'hidden'});

        fetch(this.props.apiHost + '/login', {
            method: 'POST',
            body: JSON.stringify({email: this.state.email, password: this.state.password}),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .then(response => {
                if (response['status'] !== 'Success')
                    this.setState({error: true, errorMessageVisibility: 'visible', errorMessage: response['message']});
                else {
                    sessionStorage.setItem('token', response['token']);
                    this.handleClose();
                    this.props.logIn();
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

    handleSubmitReadOnly = () => {
        this.setState({error: false, errorMessageVisibility: 'hidden'});

        fetch(this.props.apiHost + '/login', {
            method: 'POST',
            body: JSON.stringify({email: 'readonly', password: 'readonly'}),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .then(response => {
                if (response['status'] !== 'Success')
                    this.setState({error: true, errorMessageVisibility: 'visible', errorMessage: response['message']});
                else {
                    sessionStorage.setItem('token', response['token']);
                    this.handleClose();
                    this.props.logIn();
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
        return (
            <div style={this.props.style}>
                <Button color="primary" variant="contained" onClick={this.handleClickOpen}><Typography variant="button"
                                                                                                       style={{color: "#ffffff"}}>Login</Typography>
                </Button>
                <Dialog
                    open={this.state.open}
                    scroll="body"
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Officer Login</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            <Typography variant="caption">Please login using the same login credentials you use to
                                access your officer account on <a href="http://outdoorsatuva.org"> oudoorsatuva.org </a>.
                            </Typography>
                        </DialogContentText>
                        <div style={{visibility: this.state.errorMessageVisibility}}><br/><Typography variant="caption"
                                                                                                      style={{color: 'red'}}>{this.state.errorMessage}</Typography>
                        </div>
                        <TextField
                            error={this.state.error}
                            margin="dense"
                            id="name"
                            onChange={this.handleChangeEmail}
                            label="Email Address"
                            type="email"
                            autoComplete="email"
                            fullWidth
                        />
                        <TextField
                            error={this.state.error}
                            margin="dense"
                            id="pass"
                            label="Password"
                            onChange={this.handleChangePassword}
                            type="password"
                            autoComplete="current-password"
                            fullWidth
                        />

                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            <Typography variant="button" style={{color: 'red'}} align="left">Cancel</Typography>
                        </Button>
                        <Button style={{align: 'left', backgroundColor: '#0000FF'}} onClick={this.handleSubmitReadOnly}
                                color="primary">
                            <Typography variant="button" style={{color: 'white'}} align="left">Dev Login</Typography>
                        </Button>
                        <Button style={{backgroundColor: '#43A047'}} onClick={this.handleSubmit} color="primary">
                            <Typography variant="button" style={{color: 'white'}} align="left">Login</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}