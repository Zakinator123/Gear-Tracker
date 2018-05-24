import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

export default class LoginDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            email: '',
            password: '',
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

        console.log(JSON.stringify({email: this.state.email, password: this.state.password}));

        fetch('http://192.168.99.100:5000/login', {
          method: 'POST', // or 'PUT'
          body: JSON.stringify({email: this.state.email, password: this.state.password}),
          headers:{
            'Content-Type': 'application/json'
          },
          mode: 'cors'
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
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
                            Please login using the same login credentials you use to access your officer account on <a href="outdoorsatuva.org"> oudoorsatuva.org </a>. Alternatively, to login as a read-only user, login using 'test' for the username and password.
                        </DialogContentText>
                        <form>
                            <TextField
                                autoFocus
                                margin="dense"
                                id="name"
                                onChange={this.handleChangeEmail}
                                label="Email Address"
                                type="email"
                                fullWidth
                            />
                            <TextField
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
                        <Button onClick={this.handleSubmit} color="primary">
                            Login
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}