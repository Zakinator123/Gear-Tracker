import React from 'react'
import MemberSearch from './MemberAutocomplete'
import CheckoutCart from './CheckoutCart'
import DateTimePicker from './DatePicker'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider';


export default class Checkout extends React.Component{

    constructor(props){
        super(props);
        this.state = {}
    }

    render() {
        return(
            <div style={{marginBottom: '12vh'}}>
                <Typography variant="title">Member: </Typography>
                <MemberSearch />
                <br/><br/>
                <CheckoutCart />
                <br/>
                <Divider/>
                <br/>
                <DateTimePicker/>
                <br/>
                <Button style={{backgroundColor: '#43A047'}} color="primary">
                    <Typography variant="button" style={{color:'white'}} align="left">Checkout Gear</Typography>
                </Button>
            </div>
        );
    }
}