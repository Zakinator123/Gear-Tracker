import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Fab from '@material-ui/core/Fab';
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
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper'

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});


class CheckInCart extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            list: [],
            open: false,
            multiple: false,
            textFieldValue: '',
            validating: false,
            alreadyAdded: false,
            snackbarVisible: false,
            snackbarMessage: '',
            variant: 'info'
        };
    }

    validateGear = () => {
        let gearNumber = this.state.textFieldValue;
        if (gearNumber === '')
            return this.setState({open: true});

        for (let i = 0; i < this.props.list.length; i++) {
            if (parseInt(gearNumber, 10) === this.props.list[i]['number']) {
                this.setState({open: true, alreadyAdded: true});
                return;
            }
        }

        this.setState({validating: true});

        let url = this.props.apiHost + '/gear/' + gearNumber;
        fetch(url, {
            method: 'GET',
            mode: 'cors'
        }).then(response => response.json())
            .then(response => {

                let checked_out_gear = response.filter(gear => gear['status_level'] !== 0);
                let count = this.props.addGearToList(checked_out_gear);
                let checkedInList = [];
                for (let i = 0; i < response.length; i++)
                    if (response[i]['status_level'] === 0)
                        checkedInList.push(response[i]);


                if (count === 0)
                    this.setState({open: true});
                else if (count > 1)
                    this.setState({multiple: true, open: true});

                this.setState({validating: false, textFieldValue: ''});
                // if (checkedInList.length == 1)
                //     this.setState({
                //         variant: 'warning', snackbarVisible: true, snackbarMessage: 'Gear Item #' +
                //         checkedInList[0]['number'] + ' is already checked in. Checking it in again will cause no changes to be made.'
                //     });
                // else if (checkedInList.length > 1)
                // {
                //     let messageList = checkedInList[0]['number'].toString();
                //     for (let i=1; i < checkedInList.length; i++)
                //         messageList = messageList + ', ' + checkedInList[i]['number'];
                //
                //     this.setState({variant: 'warning', snackbarVisible: true, snackbarMessage: 'The following gear numbers are already checked in: ' + messageList +
                //     'Checking them in again will cause no changes to be made.'});
                // }
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

    handleClose = () => {
        this.setState({open: false, multiple: false, alreadyAdded: false});
    };

    handleSnackbarClose = () => {
        this.setState({snackbarVisible: false})
    };

    handleChange = (event) => {
        this.setState({textFieldValue: event.target.value});
    };

    render() {
        const {classes} = this.props;

        let dialogMessage;
        let dialogTitle;
        if (this.state.alreadyAdded === true) {
            dialogMessage = <Typography variant="body2">The gear number you entered has already been added to the
                cart.</Typography>;
            dialogTitle = "Duplicate Gear Entry";
        }
        else if (this.state.multiple === false) {
            dialogMessage =
                <Typography variant="body2">This may have occurred because: <br/><br/>
                    1. All pieces of gear with this number are already checked in. <br/><br/>
                    2. The gear number you entered is not a valid gear number (meaning it does not exist in
                    the inventory). Please accession the gear to add it to the inventory.
                </Typography>;
            dialogTitle = "Invalid Gear Entry";
        }
        else if (this.state.multiple) {
            dialogMessage =
                <Typography variant="body2">You have entered a gear number that has multiple corresponding entries in
                    the database (that are checked out). All of the entries have been added to the list above - please
                    remove the ones you did not intend to add to the list.</Typography>;
            dialogTitle = "Multiple Gear Items Added";
        }

        // List of gear values:
        let validatedGearItemsJSX;

        if (this.props.list.length > 0) {
            let validatedGearItems = this.props.list;
            validatedGearItemsJSX = validatedGearItems.map((gearItem) => (<ListItem key={gearItem['uid']}>
                <ListItemText
                    primary={gearItem['number'] + ' - ' + gearItem['item']}
                    secondary={gearItem['description']}
                />
                <ListItemSecondaryAction>
                    <Tooltip id="tooltip-icon" title="Delete">
                        <IconButton onClick={(e) => this.props.removeGear(gearItem['uid'])}
                                    aria-label="Delete from Cart">
                            <DeleteIcon/>
                        </IconButton>
                    </Tooltip>
                </ListItemSecondaryAction>
            </ListItem>));
        }
        else
            validatedGearItemsJSX = (
                <ListItem>
                    <ListItemText primary="Cart is Empty, enter a valid gear number below (e.g. 954) to add to cart."/>
                    <Divider/>
                </ListItem>
            );

        let validating;
        if (this.state.validating === true)
            validating = (
                <ListItem>
                    <CircularProgress/>
                </ListItem>);
        else
            validating = null;


        return (
            <div className={classes.root}>

                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                    }}
                    style={{margin: '2vh'}}
                    open={this.state.snackbarVisible}
                    autoHideDuration={7000}
                    onClose={this.handleSnackbarClose}
                >
                    <SnackbarContentWrapper
                        onClose={this.handleSnackbarClose}
                        variant={this.state.variant}
                        message={this.state.snackbarMessage}
                    />
                </Snackbar>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">{dialogTitle}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {dialogMessage}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} color="primary">
                            <Typography variant="button" align="left">Ok</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>

                <List dense={true} subheader={<Typography variant="h6" color="textPrimary"> Gear Check In Cart</Typography>}>

                    {validatedGearItemsJSX}

                    {validating}

                    <Divider/>

                    <ListItem>
                        <TextField
                            label="Add Gear to Cart"
                            min="0"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            type="number"
                            placeholder="Enter a Gear Number"
                            onChange={this.handleChange}
                            value={this.state.textFieldValue}
                        />
                        <Tooltip id="tooltip-fab" title="Add to Gear Cart">
                            <Fab size="small" onClick={this.validateGear} color="primary" aria-label="add">
                                <AddIcon/>
                            </Fab>
                        </Tooltip>
                    </ListItem>
                </List>

            </div>
        );
    }
}

CheckInCart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckInCart);