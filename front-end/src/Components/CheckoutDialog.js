import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import RenewIcon from '@material-ui/icons/Autorenew';
import ReturnIcon from '@material-ui/icons/AssignmentReturned'
import { withStyles } from '@material-ui/core/styles';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Tooltip from '@material-ui/core/Tooltip';


import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import ListItemText from '@material-ui/core/ListItemText';

class CheckoutDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            gearData: {number: 'Loading', item: 'Loading', description: 'Loading'},
            memberData: {c_email: 'Loading', c_full_name: 'Loading', c_phone_number: 'Loading'},
            fetched : false,
            tooltipOpenEmail: false,
            tooltipOpenPhoneNumber: false,
        };
    }

    handleTooltipClose = () => {
        this.setState({ tooltipOpen: false });
    };

    handleClose = () => {
        this.props.onClose();
        this.setState({fetched: false, gearData: {number: 'Loading', item: 'Loading', description: 'Loading'}});
    };

    copyToClipboard = (key, formattedCheckoutDetails) => {
        navigator.clipboard.writeText(formattedCheckoutDetails[key]);
        if (key === "Member Email")
            this.setState({ tooltipOpenEmail: true });
        else if (key === "Member Phone Number")
            this.setState({tooltipOpenPhoneNumber: true});

        setTimeout(() => this.setState({tooltipOpenEmail: false, tooltipOpenPhoneNumber: false}), 2000)
    };

    getCheckoutDetails = () => {
        if (this.props.dialogOpen) {
            const checkoutData = this.props.rowData.original;

            //Fetch Gear Data
            if (!this.state.fetched) {
                fetch(this.props.apiHost + '/gear/uid/' + checkoutData.gear_uid)
                    .then((response) => {
                        return response.json();
                    })
                    .then((myJson) => {
                        console.log(myJson);
                        this.setState({
                            gearData: myJson[0],
                            fetched: true
                        });
                    });
            }

            //Fetch User Contact Info
            if (!this.state.fetched) {
                fetch(this.props.apiHost + '/user/' + checkoutData.member_uid)
                    .then((response) => {
                        return response.json();
                    })
                    .then((myJson) => {
                        console.log(myJson);
                        this.setState({
                            memberData: myJson,
                            fetched: true
                        });
                    });
            }


            let formattedCheckoutDetails = {
                "Gear Number": this.state.gearData.number,
                "Checked Out To": this.state.memberData.c_full_name,
                "Member Email": this.state.memberData.c_email,
                "Member Phone Number": this.state.memberData.c_phone_number,
                "Gear Type": this.state.gearData.item,
                "Gear Description": this.state.gearData.description ,
                "Checkout Date": checkoutData.date_checked_out,
                "Due Date": checkoutData.date_due,
                "Officer Out": checkoutData.officer_out,
            };

            return Object.keys(formattedCheckoutDetails).map((key) => {
                let tooltipOpener;
                if (key === "Member Email")
                    tooltipOpener = this.state.tooltipOpenEmail;
                else if (key === "Member Phone Number")
                    tooltipOpener = this.state.tooltipOpenPhoneNumber;

                return (<ListItem>
                    <Grid container>
                        <Grid item>
                            <ListItemText
                                key={key} //needs to be an id
                                primary={key}
                                secondary={formattedCheckoutDetails[key]}
                            />
                        </Grid>
                        {(key === "Member Email" || key === "Member Phone Number") &&
                        <Grid item>
                            <Tooltip
                                placement="right"
                                onClose={this.handleTooltipClose}
                                open={tooltipOpener}
                                disableFocusListener
                                disableHoverListener
                                disableTouchListener
                                title="Copied"
                            >
                                <Button onClick={() => this.copyToClipboard(key, formattedCheckoutDetails)} color="primary"> Copy </Button>
                            </Tooltip>
                        </Grid>}
                    </Grid>
                </ListItem>);
            })
        }
    };

    render() {
        return (
            <Dialog onClose={this.handleClose} scroll="body" open={this.props.dialogOpen} >
                <DialogTitle id="form-dialog-title">Checkout Details</DialogTitle>
                <DialogContent>
                    <Grid container spacing={8}>
                        <Grid item xs={12} md={6}>
                            <div>
                                <List dense={true}>
                                    {this.getCheckoutDetails()}
                                </List>

                            </div>
                        </Grid>
                    </Grid>

                </DialogContent>
                <DialogActions style={{marginBottom: '1vh'}}>
                    <Grid container spacing={16} alignItems='stretch' justify='center' style={{margin:'1vh'}}>
                        <Grid item xs={12} sm={4}>
                            <Button onClick={this.props.handleCheckIn} fullWidth size="small" color="primary" variant="contained">
                                Check In
                                <ReturnIcon style={{marginLeft: '1vh'}}/>
                            </Button>
                        </Grid>

                        <Grid item xs={12} sm={4} >
                            <Button onClick={this.props.handleRenew} fullWidth size="small" variant="contained" color="secondary" >
                                Renew
                                <RenewIcon style={{marginLeft: '1vh'}}/>
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>

            </Dialog>
        )
    }

}

export default CheckoutDialog;
