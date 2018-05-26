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
    constructor(props){
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
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChangeEmail = event => {
        this.setState({email: event.target.value});
    };

    handleChangePassword = event => {
        this.setState({password: event.target.value});
    };

    handleSubmit = () => {

        // console.log(JSON.stringify({email: this.state.email, password: this.state.password}));
        this.setState({error: false, errorMessageVisibility: 'hidden'});

        fetch('https://api.gear-app.com/login', {
          method: 'POST',
          body: JSON.stringify({email: this.state.email, password: this.state.password}),
          headers:{
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        }).then(response => response.json())
        .catch(error => console.error('Error with HTTP request:', error))
        .then(response => {
           if (response['status'] !== 'Success')
                this.setState({error: true, errorMessageVisibility: 'visible', errorMessage: response['message']});
            else {
               sessionStorage.setItem('token', response['token']);
               this.handleClose();
               this.props.logIn();
           }
        });
    };


    render() {
        return (
            <div>
                <Button color="inherit" onClick={this.handleClickOpen}>GearMaster Login</Button>
                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Login</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            Please login using the same login credentials you use to access your officer account on <a href="outdoorsatuva.org"> oudoorsatuva.org </a>. Alternatively, you can login as a read-only user using 'test' for the username and password.
                        </DialogContentText>
                        <div style={{visibility:this.state.errorMessageVisibility}}><br/><Typography style={{color:'red'}}>{this.state.errorMessage}</Typography></div>
                        <form>
                            <TextField
                                autoFocus
                                error={this.state.error}
                                margin="dense"
                                id="name"
                                onChange={this.handleChangeEmail}
                                label="Email Address"
                                type="email"
                                fullWidth
                            />
                            <TextField
                                error={this.state.error}
                                margin="dense"
                                id="pass"
                                label="Password"
                                onChange={this.handleChangePassword}
                                type="password"
                                fullWidth
                            />
                        </form>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button style={{backgroundColor: '#43A047'}} onClick={this.handleSubmit} color="primary">
                            <Typography variant="button" style={{color:'white'}} align="left">Login</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}