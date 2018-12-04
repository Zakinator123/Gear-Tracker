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
import CircularProgress from '@material-ui/core/CircularProgress';

import classNames from 'classnames';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import blue from '@material-ui/core/colors/blue';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';

const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});


class CheckInCart extends React.Component {

    constructor(props)
    {
        super(props);
        this.validateGear = this.validateGear.bind(this);

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

    validateGear() {
        let gearNumber = this.state.textFieldValue;
        if (gearNumber == '')
            return this.setState({open: true});

        for (let i = 0; i < this.props.list.length; i++) {
            if (gearNumber == this.props.list[i]['number']) {
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
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {

                let checked_out_gear = response.filter(gear => gear['status_level'] !== 0);

                let count = this.props.addGearToList(checked_out_gear);

                let checkedInList = [];
                for (let i = 0; i < response.length; i++)
                    if (response[i]['status_level'] == 0)
                        checkedInList.push(response[i]);

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

                if (count == 0)
                    this.setState({open: true});
                else if (count > 1)
                    this.setState({multiple: true, open: true});

                this.setState({validating: false, textFieldValue: ''});
            });
    }

    handleClose = () => {
        this.setState({ open: false, multiple: false, alreadyAdded: false});
    };

    handleSnackbarClose = () => {
        this.setState({snackbarVisible : false})
    };

    handleChange = (event) => {
        this.setState({textFieldValue: event.target.value});
    };

    render() {
        const { classes } = this.props;

        let dialogMessage;
        let dialogTitle;
        if (this.state.alreadyAdded == true){
            dialogMessage = <Typography variant="body2">The gear number you entered has already been added to the cart.</Typography>;
            dialogTitle = "Duplicate Gear Entry";}
        else if (this.state.multiple == false){
            dialogMessage = <Typography variant="body2">The gear number you entered is not a valid gear number (does not exist in database) or all pieces of gear with this number are already checked in. Please accession the gear to check it out.</Typography>;
            dialogTitle = "Invalid Gear Entry";}
        else if (this.state.multiple){
            dialogMessage = <Typography variant="body2">You have entered a gear number that has multiple corresponding entries in the database (that are checked out). All of the entries have been added to the list above - please remove the ones you did not intend to add to the list.</Typography>;
            dialogTitle = "Multiple Gear Items Added";}

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
                        <IconButton onClick={(e) => this.props.removeGear(gearItem['uid'])} aria-label="Delete from Cart">
                            <DeleteIcon />
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
        if (this.state.validating == true)
            validating = (
                <ListItem>
                    <CircularProgress />
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
                    <MySnackbarContentWrapper
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
                            <Typography variant="button"  align="left">Ok</Typography>
                        </Button>
                    </DialogActions>
                </Dialog>

                <List dense={true} subheader={<Typography variant="title"> Gear Check In Cart</Typography>}>

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

CheckInCart.propTypes = {
    classes: PropTypes.object.isRequired,
};


const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};


const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: '#B71C1C',
    },
    info: {
        backgroundColor: blue[900],
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    close:{marginTop: -20},
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
        </span>
            }
            action={
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="inherit"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>
            }
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);


export default withStyles(styles)(CheckInCart);