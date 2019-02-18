import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
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
    constructor(props) {
        super(props);
        this.state = {
            itemTypes: [],
            conditionLevels: []
        };
    }

    handleClose = () => {
        this.props.onClose(this.props.selectedValue);
    };

    handleListItemClick = value => {
        this.props.onClose(value);
    };

    componentDidMount() {
        fetch(this.props.apiHost + '/item_type/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                this.setState({itemTypes: myJson.sort()});
            })
            .catch(() => {
                this.setState({
                    snackbarVisible: true,
                    snackbarMessage: 'An error occurred. Please contact the developer and provide screenshots and specific information regarding what caused the error.',
                    variant: 'error',
                    list: [],
                })
            });

        fetch(this.props.apiHost + '/condition/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                for (let i = 0; i < myJson.length; i++) {
                    switch (parseInt(myJson[i], 10)) {
                        case 0:
                            myJson[i] = "Brand New";
                            break;
                        case 1:
                            myJson[i] = "Good";
                            break;
                        case 2:
                            myJson[i] = "Fair";
                            break;
                        case 3:
                            myJson[i] = "Poor";
                            break;
                        default:
                            myJson[i] = "Unknown condition level";
                            break;
                    }
                }
                this.setState({conditionLevels: myJson});
            })
            .catch(() => {
                this.setState({
                    snackbarVisible: true,
                    snackbarMessage: 'An error occurred. Please contact the developer and provide screenshots and specific information regarding what caused the error.',
                    variant: 'error',
                    list: [],
                })
            });
    }

    render() {
        const {classes, onClose, selectedValue, ...other} = this.props;

        let listItems;
        let cellInfo = this.props.currentCell;
        let dialogText;
        if (cellInfo.column.id === 'item') {
            dialogText = " an Item Type";
            listItems = this.state.itemTypes;
        }
        else if (cellInfo.column.id === 'condition_level') {
            dialogText = " a Condition Descriptor";
            listItems = this.state.conditionLevels;
        }

        return (
            <Dialog
                onClose={this.handleClose}
                aria-labelledby="simple-dialog-title"
                scroll="body"
                {...other}
            >
                <DialogTitle>
                    <Typography
                        variant="h6"
                        style={{margin: '0.5vh'}}
                        color="primary"
                    >
                        Select{dialogText}
                    </Typography>
                </DialogTitle>
                <div>
                    <List style={{marginTop: '-2vh'}} dense>
                        {listItems.map(item => (
                            <ListItem button onClick={() => this.handleListItemClick(item)} key={item}>
                                <ListItemText primary={item}/>
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
