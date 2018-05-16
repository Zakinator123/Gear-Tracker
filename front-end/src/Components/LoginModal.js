import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';


const theme1 = createMuiTheme({
    palette: {
        primary: {
            main: '#2e7d32',
            dark: '#005005',
            contrastText: '#fff',
        },
        secondary: {
            main: '#6f74dd',
            dark: '#00227b',
            contrastText: '#fff',
        },
    },
});

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const styles = theme => ({
  paper: {
    position: 'relative',
    width: 'fit-content',
    height: 'fit-content',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
});

class LoginModal extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

    render() {
        const { classes } = this.props;

        return (
            <div>
              <Button color="inherit" onClick={this.handleOpen}>GearMaster Login</Button>
              <MuiThemeProvider theme={theme1}>
              <Modal
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  open={this.state.open}
                  onClose={this.handleClose}>

                  <div style={getModalStyle()} className={classes.paper}>
                    <Typography variant="body2" id="modal-title">
                      Gearmaster and Officer Login
                    </Typography> <br/>
                    <Typography variant="caption" id="simple-modal-description">
                      Please login using the same login credentials you use to access your officer account on <a href="outdoorsatuva.org"> oudoorsatuva.org </a>
                    </Typography>

                    <form className={classes.container} noValidate autoComplete="off">
                      <TextField
                          required
                          id="required"
                          label="Email"
                          className={classes.textField}
                          margin="normal"
                      /> <br/>
                      <TextField
                          required
                          id="password-input"
                          label="Password"
                          className={classes.textField}
                          type="password"
                          autoComplete="current-password"
                          margin="normal"
                      />
                    </form>

                    <br/>
                      <Button style={{backgroundColor: '#43A047'}}> <Typography variant="button" fontColor="white" align="left" className={classes.flex}>Login</Typography> </Button>
                    <Button color="inherit" onClick={this.handleClose}> Cancel </Button>
                  </div>
              </Modal>
              </MuiThemeProvider>


      </div>
    );
  }
}

LoginModal.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoginModal);