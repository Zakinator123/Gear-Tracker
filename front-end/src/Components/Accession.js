import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
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
import IconButton from '@material-ui/core/IconButton';
import classNames from 'classnames';
import Slide from '@material-ui/core/Slide'
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import OptionSelectorDialog from "./OptionSelectorDialog";

const options = [
    'Show some love to Material-UI',
    'Show all notification content',
    'Hide sensitive notification content',
    'Hide all notification content',
];

const styles = theme => ({
    root: {
        flexGrow: 1,

    },
    menu: {
        width: '100%',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
    demo: {
        height: '100%',
    },
    paper: {
        padding: theme.spacing.unit*2,
        margin: theme.spacing.unit,
        height: '100%',
        color: theme.palette.text.secondary,
    },
    control: {
        padding: theme.spacing.unit * 2,
    },
});

class Accession extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            number: 0,
            anchorEl: null,
            selectedIndex: 1,
            dialogOpen: false,
            selectedValue: '',
            dialogType: '',
            itemTypeValue: '',
            itemConditionValueNumber: '',
            itemConditionValueText: '',
            itemDescription: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleDialogClickOpen = (value) => {
        this.setState({dialogOpen: true, dialogType: value});
    };

    handleDialogClose = (value) => {

        if (value == '') {
            this.setState({dialogOpen: false});
            return;
        }

        let inputData = value;

        if (this.state.dialogType == 'status_level')
        {
            switch(inputData) {
                case "Brand New":
                    inputData = 0;
                    break;
                case "Good":
                    inputData = 1;
                    break;
                case "Fair":
                    inputData = 2;
                    break;
                case "Poor":
                    inputData = 3;
                    break;
                default:
                    inputData = 1;
            }
            this.setState({dialogOpen: false, itemConditionValueText: value, itemConditionValueNumber: inputData });
        }
        else {
            this.setState({dialogOpen: false, itemTypeValue: value})
        }

    };

    handleClickListItem = event => {
        this.setState({anchorEl: event.currentTarget});
    };

    handleMenuItemClick = (event, index) => {
        this.setState({selectedIndex: index, anchorEl: null});
    };

    handleClose = () => {
        this.setState({anchorEl: null});
    };

    render() {

        let dialog;
        let itemTypeProp = {column : {id: 'item'}};
        let conditionProp = {column : {id: 'condition_level'}};

        if (this.state.dialogOpen) {
            dialog = (
                <OptionSelectorDialog
                    currentCell={ (this.state.dialogType=="item" ? itemTypeProp : conditionProp) }
                    selectedValue={this.state.selectedValue}
                    open={this.state.dialogOpen}
                    onClose={this.handleDialogClose}
                />
            );}

        const {classes} = this.props;
        const { anchorEl } = this.state;

        return (
            <div style={{marginBottom: '12vh'}}>
                {dialog}
                <Grid container
                      alignItems='center'
                      direction="column"
                      alignContent="stretch">
                    <Grid xs={12} md={6} lg={6} xl={6} item>
                        <Paper className={classes.paper}>
                            <Typography variant="title"> Gear Number: </Typography>

                            {/* Make this a red error if it is not valid, otherwise make it green. */}
                            <TextField
                                placeholder="Enter a Number"
                                value={this.state.gearNumber}
                                onChange={this.handleChange('number')}
                            />
                        </Paper>
                    </Grid>

                    <Grid xs={12} sm={12} md={6} lg={6} xl={6} item>
                        <Paper className={classes.paper}>
                            <Typography variant="title"> Item Type: </Typography>

                            <TextField
                                placeholder="Choose an Item Type"
                                onClick={() => this.handleDialogClickOpen('item')}
                                value={this.state.itemTypeValue}
                            />
                        </Paper>
                    </Grid>

                    <Grid xs={12} md={6} lg={6} xl={6} item>
                        <Paper className={classes.paper}>
                            <Typography variant="title"> Condition: </Typography>

                            <TextField
                                placeholder="Choose an a Condition Level"
                                onClick={() => this.handleDialogClickOpen('status_level')}
                                value={this.state.itemConditionValueText}
                            />
                        </Paper>
                    </Grid>

                    <Grid xs={12} md={6} lg={6} xl={6} item>
                        <Paper className={classes.paper}>
                            <Typography variant="title"> Description: </Typography>
                            <TextField
                                multiline
                                placeholder="Enter a Description"
                                value={this.state.itemDescription}
                                onChange={(event) => this.setState({itemDescription: event.target.value})}
                            />
                        </Paper>
                    </Grid>


                </Grid>
            </div>
        );
    }
}


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

export default withStyles(styles)(Accession);