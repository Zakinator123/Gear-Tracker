import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import PersonIcon from '@material-ui/icons/Person';
import AddIcon from '@material-ui/icons/Add';
import Typography from '@material-ui/core/Typography';
import blue from '@material-ui/core/colors/blue';

const emails = ['username@gmail.com', 'user02@gmail.com'];
const styles = {
    avatar: {
        backgroundColor: blue[100],
        color: blue[600],
    },
};

class OptionSelectorDialog extends React.Component {
    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    handleListItemClick = value => {
        this.props.onClose(value);
    };

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;

        console.log("The current cell is: " + this.props.currentCell.toString());
        console.log(this.props.currentCell);

        let listItems;
        let cellInfo = this.props.currentCell;
        let dialogText;
        if (cellInfo.column.id == 'item') {
            dialogText = " an Item Type";
            listItems = ["Walkie Talkie",
                "Sleeping Bag",
                "Climbing Shoes",
                "Cooking",
                "Harness",
                "Belay Device",
                "Webbing",
                "Guide Book",
                "Climbing Protection",
                "Sleeping Pad",
                "Backpack",
                "X-Country Ski Poles",
                "Caving Helmet",
                "Helmet",
                "Backpack Rain Cover",
                "Tools",
                "Snowshoes",
                "Gaiters",
                "Stove",
                "X-Country Skis",
                "Ski Shoes",
                "Water Bladder",
                "Snowshoe Tails",
                "Ground Tarp",
                "Tent",
                "Pillow",
                "Rope Bag",
                "First Aid Kit",
                "Water Filter",
                "Compass",
                "Reel Bag",
                "Tackle Box",
                "Stuff Sack",
                "DVD",
                "Stoves",
                "Headlamp",
                "Locking Carabiner",
                "Crash Pad",
                "Slacklining Tree Pad",
                "Hammock",
                "Chalkbag",
                "GoPro",
                "Disk Golf",
                "Gloves",
                "Water Pouch",
                "Chalk Bag",
                "Trekking Poles",
                "Bear Container",
                "REI travel sack",
                "Candles",
                "Haul Bag",
                "Tripod",
                "Stick Clip",
                "Work Gloves",
                "Caving",
                "Emergency Blanket",
            ]
        }
        else if (cellInfo.column.id == 'condition_level') {
            dialogText = " a condition descriptor.";
            listItems = [0,1,2,3];
        }

        return (
            <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                <DialogTitle id="simple-dialog-title">Select{dialogText}</DialogTitle>
                <div>
                    <List>
                        {listItems.map(item => (
                            <ListItem button onClick={() => this.handleListItemClick(item)} key={item}>
                                <ListItemText primary={item} />
                            </ListItem>
                        ))}
                    </List>
                </div>
            </Dialog>
        );
    }
}

OptionSelectorDialog.propTypes = {
    classes: PropTypes.object.isRequired,
    onClose: PropTypes.func,
    selectedValue: PropTypes.string,
};

export default withStyles(styles)(OptionSelectorDialog);
