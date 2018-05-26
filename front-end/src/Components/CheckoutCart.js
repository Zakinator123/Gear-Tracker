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


const styles = theme => ({
    root: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class CheckoutCart extends React.Component {
    state = {
        checked: ['wifi'],
    };

    handleToggle = value => () => {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked,
        });
    };

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <List dense={true} subheader={<Typography variant="title"> Gear Checkout Cart</Typography>}>
                    <ListItem>
                        <ListItemText
                            primary="Single-line item"
                            secondary={'Secondary text'}
                        />
                        <ListItemSecondaryAction>
                            <Tooltip id="tooltip-icon" title="Delete">
                                <IconButton aria-label="Delete from Cart">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <ListItemText
                            primary="Single-line item"
                            secondary={'Secondary text'}
                        />
                        <ListItemSecondaryAction>
                            <Tooltip id="tooltip-icon" title="Delete">
                                <IconButton aria-label="Delete">
                                    <DeleteIcon />
                                </IconButton>
                            </Tooltip>
                        </ListItemSecondaryAction>
                    </ListItem>
                    <ListItem>
                        <Tooltip id="tooltip-fab" title="Add to Cart">

                            <Button variant="fab" mini style={{margin: 'auto'}} color="primary" aria-label="add" className={classes.button}>
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