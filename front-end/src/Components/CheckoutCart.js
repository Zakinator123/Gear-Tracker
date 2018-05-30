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
        this.addTextField = this.addTextField.bind(this);
        this.validateGear = this.validateGear.bind(this);
        this.addPlus = this.addPlus.bind(this);

        this.state = {
            list: [],
            open: false,
            multiple: false,
            plusVisible : true,
            textFieldVisible : false,
            textFieldValue: ''
        };
    }

    validateGear(e) {
        let gearNumber = e.target.value;
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
            this.setState({multiple: true, open: true})

    }

    addPlus(e) {
        this.setState({plusVisible: true, textFieldValue : e.target.value});
    }

    addTextField() {
        this.setState({
            plusVisible: false,
            textFieldVisible: true,
            textFieldValue: ''
        });
    }

    handleClose = () => {
        this.setState({ open: false, multiple: false });
    };

    render() {
        const { classes } = this.props;

        console.log("plus state visible" + this.state.plusVisible);

        let dialogMessage;
        if (this.state.multiple)
            dialogMessage = <Typography variant="body2">The gear number you entered is not a valid gear number (does not exist in database). Please accession the gear to check it out.</Typography>;
        else
            dialogMessage = <Typography variant="body2">You have entered a gear number that has multiple corresponding entries in the database. All of the entries have been added to the list above - please remove the ones you did not intend to add to the list.</Typography>;

        let plus;
        if (this.state.plusVisible)
            plus = (
                <ListItem>
                    <Tooltip id="tooltip-fab" title="Add to Gear Cart">
                        <Button variant="fab" mini onClick={this.addTextField} style={{margin: 'auto'}} color="primary" aria-label="add">
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </ListItem>
            );
        else
            plus = null;

        let textField;
        if (this.state.textFieldVisible)
            textField = (
                <ListItem>
                    <TextField autoFocus onChange={this.addPlus} onBlur={this.validateGear} placeholder="Add Gear Number Here" value={this.state.textFieldValue}/>
                    <Tooltip id="tooltip-icon" title="Delete">
                        <IconButton aria-label="Delete">
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </ListItem>
            );
        else
            textField = null;

        // List of gear values:
        let validatedGearItems = this.state.list;

                let validatedGearItemsJSX = validatedGearItems.map((gearItem) => (<ListItem>
                        <ListItemText
                            inset={true}
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

        // {/*let validatedGearItemsJSX;*/}
        // {/*for (let i = 0; i < validatedGearItems.length; i++)*/}
        // {/*{*/}
        //     {/*let gearItem = validatedGearItems[i];*/}
        //     {/*let gearItemPrimary = gearItem['number'] + gearItem['item'];*/}
        //
        //     {/*validatedGearItemsJSX += <ListItem>*/}
        //                 {/*<ListItemText*/}
        //                     {/*inset={true}*/}
        //                     {/*primary={gearItemPrimary}*/}
        //                     secondary={gearItem['description']}
        //                 />
        //                 <ListItemSecondaryAction>
        //                     <Tooltip id="tooltip-icon" title="Delete">
        //                         <IconButton aria-label="Delete from Cart">
        //                             <DeleteIcon />
        //                         </IconButton>
        //                     </Tooltip>
        //                 </ListItemSecondaryAction>
        //             </ListItem>
        // }


        return (
            <div className={classes.root}>

                <Dialog
                    open={this.state.open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
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
                    {textField}
                    {plus}

                </List>

            </div>
        );
    }
}

CheckoutCart.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckoutCart);

//
// <ListItem>
//                         <ListItemText
//                             primary="Single-line item"
//                             secondary={'Secondary text'}
//                         />
//                         <ListItemSecondaryAction>
//                             <Tooltip id="tooltip-icon" title="Delete">
//                                 <IconButton aria-label="Delete from Cart">
//                                     <DeleteIcon />
//                                 </IconButton>
//                             </Tooltip>
//                         </ListItemSecondaryAction>
//                     </ListItem>
//                     <ListItem>
//                         <ListItemText
//                             primary="Single-line item"
//                             secondary={'Secondary text'}
//                         />
//                         <ListItemSecondaryAction>
//                             <Tooltip id="tooltip-icon" title="Delete">
//                                 <IconButton aria-label="Delete">
//                                     <DeleteIcon />
//                                 </IconButton>
//                             </Tooltip>
//                         </ListItemSecondaryAction>
//                     </ListItem>