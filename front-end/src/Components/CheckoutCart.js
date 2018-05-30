import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Divider from '@material-ui/core/Divider';


const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class CheckoutCart extends React.Component {

    constructor(props)
    {
        super(props);
        this.validateGear = this.validateGear.bind(this);

        this.state = {
            list: [],
            open: false,
            multiple: false,
            textFieldVisible : true,
            textFieldValue: ''
        };
    }

    validateGear() {
        let gearNumber = this.state.textFieldValue;
        let gearList = this.props.data;

        let count = 0;
        let gear;
        for (let i = 0; i < gearList.length; i++)
        {
            gear = gearList[i];
            if (gear['number'] == gearNumber)
            {
                count++;
                this.setState((prevState, props) => {
                    list: prevState.list.push({number: gearNumber, item: gear['item'], description: gear['description']})
                });
            }
        }

        if (count == 0)
            this.setState({open: true});
        else if (count > 1)
            this.setState({multiple: true, open: true});
    }

    handleClose = () => {
        this.setState({ open: false, multiple: false });
    };

    handleChange = (e) => {
        this.setState({textFieldValue: e.target.value});
    };

    render() {
        const { classes } = this.props;

        let dialogMessage;
        if (this.state.multiple == false)
            dialogMessage = <Typography variant="body2">The gear number you entered is not a valid gear number (does not exist in database). Please accession the gear to check it out.</Typography>;
        else
            dialogMessage = <Typography variant="body2">You have entered a gear number that has multiple corresponding entries in the database. All of the entries have been added to the list above - please remove the ones you did not intend to add to the list.</Typography>;

        // List of gear values:
        let validatedGearItemsJSX;

        if (this.state.list.length > 0) {
            let validatedGearItems = this.state.list;
            validatedGearItemsJSX = validatedGearItems.map((gearItem) => (<ListItem>
                <ListItemText
                    primary={gearItem['number'] + ' - ' + gearItem['item']}
                    secondary={gearItem['description']}
                />
                <ListItemSecondaryAction>
                    <Tooltip id="tooltip-icon" title="Delete">
                        <IconButton aria-label="Delete from Cart">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>));
        }
        else
            validatedGearItemsJSX = (
                <ListItem>
                    <ListItemText primary="Cart is Empty - Add Gear by typing into the box below."/>
                    <Divider/>
                </ListItem>
            );


        return (
            <div className={classes.root}>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Invalid Gear Entry</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            <Typography variant="button"  align="left">Ok</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>

                <List dense={true} subheader={<Typography variant="title"> Gear Checkout Cart</Typography>}>

                    {validatedGearItemsJSX}

                    <Divider/>

                    <ListItem>
                        <TextField autoFocus placeholder="Enter a Gear Number" onChange={this.handleChange} value={this.state.textFieldValue}/>
                        <Tooltip id="tooltip-fab" title="Add to Gear Cart">
                            <Button variant="fab" mini onClick={this.validateGear}  color="primary" aria-label="add">
                                <AddIcon />
                            </Button>
                        </Tooltip>
                    </ListItem>
                </List>

            </div>
        );
    }
}

CheckoutCart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckoutCart);