import React from 'react';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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

        console.log(this.props.row.original);

        return (
            <Paper style={{margin: '1vw', width:'96vw'}} elevation={1}>
                <Button style={{width: '35%', marginLeft: '1.5%', marginRight: '1%'}} onClick={this.props.handleCheckIn} size="small" color="primary" variant="contained">
                    Check In
                    <ReturnIcon style={{marginLeft: '1vh'}}/>
                </Button>


                <Button style={{width: '30%', marginRight: '1%'}} onClick={this.props.handleButtonPress} variant="contained" color="secondary" >
                    Renew
                    <RenewIcon style={{marginLeft: '1vh'}}/>
                </Button>


                <Button variant="contained" onClick={this.props.handleButtonPress} style={{width: '30%', marginRight: '1%'}}>
                    Email
                    <EmailIcon style={{marginLeft: '1vh'}}/>
                </Button>
            </Paper>
        );
    }
}

