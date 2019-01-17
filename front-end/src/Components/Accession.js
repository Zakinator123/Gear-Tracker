import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
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
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import OptionSelectorDialog from "./OptionSelectorDialog";
import Button from '@material-ui/core/Button';

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
        padding: theme.spacing.unit * 2,
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
            selectedIndex: 1,
            dialogOpen: false,
            selectedValue: '',
            dialogType: '',
            itemNumber: '',
            itemTypeValue: '',
            itemConditionValueNumber: '',
            itemConditionValueText: '',
            itemDescription: '',
            itemNotes: '',
        };

        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleSnackbarClose = () => {
        this.setState({snackbarVisible: false})
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

        if (this.state.dialogType == 'status_level') {
            switch (inputData) {
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
            this.setState({dialogOpen: false, itemConditionValueText: value, itemConditionValueNumber: inputData});
        }
        else {
            this.setState({dialogOpen: false, itemTypeValue: value})
        }

    };

    handleAutoGenerateNumber = () => {
        fetch(this.props.apiHost + '/get_unused_number')
            .then((response) => {
                console.log(response);
                return response.json();
            })
            .then((myJson) => {
                this.setState({itemNumber: myJson[0]});
            });
    };

    accessionGear = () => {

        if (parseInt(sessionStorage.getItem('token'), 10) === 0) {
            this.setState({
                snackbarMessage: 'Checkout unsuccessful - you are in view-only mode. Please log back in as an officer.',
                snackbarVisible: true,
                variant: 'error'
            });
            return;
        }

        if (this.state.itemNumber === '' || this.state.itemTypeValue === '' || this.state.itemConditionValueText === '' || this.state.itemDescription === '') {
            this.setState({
                snackbarMessage: 'Checkout unsuccessful - please fill out all required fields',
                snackbarVisible: true,
                variant: 'error'
            });
            return;
        }

        let gear = {
            'number': this.state.itemNumber,
            'itemType': this.state.itemTypeValue,
            'itemCondition': this.state.itemConditionValueNumber,
            'description': this.state.itemDescription,
            'notes': this.state.itemNotes,
        };

        console.log(gear);

        fetch(this.props.apiHost + '/gear/accession', {
            method: 'POST',
            body: JSON.stringify({authorization: sessionStorage.getItem('token'), gear: gear}),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {
                console.log(response);
                if (response['status'] === 'Success!') {
                    this.setState({
                        snackbarVisible: true,
                        snackbarMessage: "Successfully accessioned gear number " + response['number'] + "!",
                        variant: 'success',
                        itemNumber: '',
                        itemTypeValue: '',
                        itemConditionValueNumber: '',
                        itemConditionValueText: '',
                        itemDescription: '',
                        itemNotes: '',
                    })
                }
            })
            .catch(error => console.error(error));
    };

    render() {

        let dialog;
        let itemTypeProp = {column: {id: 'item'}};
        let conditionProp = {column: {id: 'condition_level'}};

        if (this.state.dialogOpen) {
            dialog = (
                <OptionSelectorDialog
                    currentCell={(this.state.dialogType == "item" ? itemTypeProp : conditionProp)}
                    selectedValue={this.state.selectedValue}
                    open={this.state.dialogOpen}
                    onClose={this.handleDialogClose}
                    apiHost={this.props.apiHost}
                />
            );
        }

        const {classes} = this.props;

        return (
            <div style={{marginBottom: '12vh'}}>
                {dialog}
                <Paper>
                    <Grid container
                          alignItems='center'
                          alignContent="stretch"
                          spacing={4}
                    >
                        <Grid xs={12} sm={12} md={5} lg={3} item
                              style={{marginTop: '3vh', marginLeft: '3vh', marginBottom: '1vh', marginRight: '1vh'}}>
                            <Typography variant="title">Gear Number: </Typography>
                            <TextField
                                placeholder="Enter a Number"
                                variant='outlined'
                                inputMode="numeric"
                                pattern="[0-9]*"
                                type="number"
                                helperText="Aim to keep numbers unique."
                                required
                                value={this.state.itemNumber}
                                onChange={(event) => this.setState({itemNumber: event.target.value})}
                            />
                            <br/>
                            <div style={{margin: '1vh'}}>
                                <Typography variant="title">Or</Typography>
                            </div>
                            <Button
                                variant="raised"
                                style={{backgroundColor: '#43A047'}}
                                color="primary"
                                onClick={this.handleAutoGenerateNumber}>
                                Auto-Generate an Unused Number
                            </Button>
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="title">Item Type: </Typography>
                            <TextField
                                placeholder="Choose an Item Type"
                                variant='outlined'
                                required
                                readonly
                                onClick={() => this.handleDialogClickOpen('item')}
                                value={this.state.itemTypeValue}
                            />
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="title">Item Condition: </Typography>
                            <TextField
                                placeholder="Choose A Condition"
                                variant='outlined'
                                required
                                readonly
                                onClick={() => this.handleDialogClickOpen('status_level')}
                                value={this.state.itemConditionValueText}
                            />
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="title">Description: </Typography>
                            <TextField
                                multiline
                                variant="outlined"
                                placeholder="Enter a Description"
                                required
                                rows="2"
                                helperText="Enter a qualitative description that ideally includes color and brand information."
                                value={this.state.itemDescription}
                                onChange={(event) => this.setState({itemDescription: event.target.value})}
                            />
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="title">Item Notes: </Typography>
                            <TextField
                                multiline
                                variant="outlined"
                                rows="2"
                                placeholder="Enter Notes"
                                helperText="Notes should include any other information not in the item's description e.g. `This sleeping bag must be kept with its liner` for example"
                                value={this.state.itemNotes}
                                onChange={(event) => this.setState({itemNotes: event.target.value})}
                            />
                        </Grid>
                        <br/>
                    </Grid>
                </Paper>
                <Grid
                    xs={12}
                    container
                    justify='flex-end'
                >
                    <Grid item style={{margin: '3vh'}}>
                        <Button variant="raised" style={{backgroundColor: '#43A047'}} color="primary">
                            <Typography variant="button" style={{color: 'white'}} align="left"
                                        onClick={this.accessionGear}>
                                Accession Gear
                            </Typography>
                        </Button>
                    </Grid>
                </Grid>
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
    close: {marginTop: -20},
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
    const {classes, className, message, onClose, variant, ...other} = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)}/>
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
                    <CloseIcon className={classes.icon}/>
                </IconButton>
            }
            {...other}
        />
    );
}

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

export default withStyles(styles)(Accession);