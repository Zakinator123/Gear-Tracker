import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import EmailIcon from '@material-ui/icons/Email';
import RenewIcon from '@material-ui/icons/Autorenew';
import ReturnIcon from '@material-ui/icons/AssignmentReturned'


const styles = theme => ({
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit*5,
    },
    paper : {
        margin: theme.spacing.unit
    },
});

class SubRowComponent extends React.Component{
    constructor(props)
    {
        super(props);
        this.classes = props;
    }


    render() {
        return (<Paper className={this.classes.paper}>
            <Button style={{backgroundColor: '#81C784'}} variant="contained" className={this.classes.button}>
                Check In
                <ReturnIcon style={{marginLeft: '1vh'}}/>
            </Button>
            <Button variant="contained" style={{marginLeft: '1vh'}} color="primary" >
                Renew
                <RenewIcon className={this.classes.rightIcon}/>
            </Button>
            <Button variant="contained" style={{marginLeft: '1vh'}} color="secondary" >
                Email
                <EmailIcon className={this.classes.rightIcon}/>
            </Button>
        </Paper>);
    }
}

export default withStyles(styles)(SubRowComponent);
