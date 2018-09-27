import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import blue from '@material-ui/core/colors/blue';
import Typography from '@material-ui/core/Typography';


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

    // TODO: Make the item type list pull from the API
    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;

        let listItems;
        let cellInfo = this.props.currentCell;
        let dialogText;
        if (cellInfo.column.id == 'item') {
            dialogText = " an Item Type";
            listItems = ([
                "Walkie Talkie",
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
            ].sort())
        }
        else if (cellInfo.column.id == 'condition_level') {
            dialogText = " a Condition Descriptor";
            listItems = ["Brand New", "Good", "Fair", "Poor"];
        }

        return (
                <Dialog onClose={this.handleClose} aria-labelledby="simple-dialog-title" {...other}>
                    <DialogTitle><Typography variant="title" style={{margin:'0.5vh'}} color="primary">Select{dialogText}</Typography></DialogTitle>
                    <div>
                        <List style={{marginTop: '-2vh'}} dense>
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
