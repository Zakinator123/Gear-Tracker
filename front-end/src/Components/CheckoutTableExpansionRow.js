import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Icon from '@material-ui/core/Icon';
import EmailIcon from '@material-ui/icons/Email';
import RenewIcon from '@material-ui/icons/Autorenew';
import ReturnIcon from '@material-ui/icons/AssignmentReturned'


export default class SubRowComponent extends React.Component{
    constructor(props)
    {
        super(props);
        this.classes = props;
    }

    render() {
        return (
            <Paper style={{margin: '1vh', width:'98vw'}} elevation={1}>
                <Button style={{width: '34vw', marginRight: '1vw'}} onClick={this.props.handleButtonPress} size="small" color="primary" variant="contained">
                    Check In
                    <ReturnIcon style={{marginLeft: '1vh'}}/>
                </Button>
                <Button style={{width: '30vw', marginRight: '1vw'}} onClick={this.props.handleButtonPress} variant="contained" color="secondary" >
                    Renew
                    <RenewIcon style={{marginLeft: '1vh'}}/>
                </Button>
                <Button variant="contained" onClick={this.props.handleButtonPress} style={{width: '30vw'}}>
                    Email
                    <EmailIcon style={{marginLeft: '1vh'}}/>
                </Button>
            </Paper>
        );
    }
}

