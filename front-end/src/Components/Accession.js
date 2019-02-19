import React from 'react';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContentWrapper from './SnackbarContentWrapper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import OptionSelectorDialog from "./OptionSelectorDialog";
import Button from '@material-ui/core/Button';
import {showErrorSnackbarIfInReadOnlyMode} from './Utilites';

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

        if (value === '') {
            this.setState({dialogOpen: false});
            return;
        }

        let inputData = value;

        if (this.state.dialogType === 'status_level') {
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
                return response.json();
            })
            .then((myJson) => {
                this.setState({itemNumber: myJson[0]});
            });
    };

    accessionGear = () => {

        if (showErrorSnackbarIfInReadOnlyMode(this.setState.bind(this)))
            return;

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

        fetch(this.props.apiHost + '/gear/accession', {
            method: 'POST',
            body: JSON.stringify({authorization: sessionStorage.getItem('token'), gear: gear}),
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors'
        }).then(response => response.json())
            .then(response => {
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
                else throw "Error";
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

    render() {

        let dialog;
        let itemTypeProp = {column: {id: 'item'}};
        let conditionProp = {column: {id: 'condition_level'}};

        if (this.state.dialogOpen) {
            dialog = (
                <OptionSelectorDialog
                    currentCell={(this.state.dialogType === "item" ? itemTypeProp : conditionProp)}
                    selectedValue={this.state.selectedValue}
                    open={this.state.dialogOpen}
                    onClose={this.handleDialogClose}
                    apiHost={this.props.apiHost}
                />
            );
        }

        return (
            <div style={{marginBottom: '12vh'}}>
                {dialog}
                <Paper>
                    <Grid container
                          alignItems='center'
                          alignContent="stretch"
                          spacing={8}
                    >
                        <Grid xs={12} sm={12} md={5} lg={3} item
                              style={{marginTop: '3vh', marginLeft: '3vh', marginBottom: '1vh', marginRight: '1vh'}}>
                            <Typography variant="h6">Gear Number: </Typography>
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
                                <Typography variant="h6">Or</Typography>
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
                            <Typography variant="h6">Item Type: </Typography>
                            <TextField
                                placeholder="Choose an Item Type"
                                variant='outlined'
                                required
                                disabled={this.state.editItemType}
                                onClick={() => this.handleDialogClickOpen('item')}
                                value={this.state.itemTypeValue}
                            />
                            {/*<br/>*/}
                            {/*<div style={{margin: '1vh'}}>*/}
                            {/*<Typography variant="h6">Or</Typography>*/}
                            {/*</div>*/}
                            {/*<Button*/}
                            {/*variant="raised"*/}
                            {/*style={{backgroundColor: '#43A047'}}*/}
                            {/*color="primary"*/}
                            {/*onClick={this.handleAutoGenerateNumber}>*/}
                            {/*Create a new Item Type*/}
                            {/*</Button>*/}
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="h6">Item Condition: </Typography>
                            <TextField
                                placeholder="Choose A Condition"
                                variant='outlined'
                                required
                                // disabled
                                onClick={() => this.handleDialogClickOpen('status_level')}
                                value={this.state.itemConditionValueText}
                            />
                        </Grid>
                        <Grid sm={12} xs={12} md={5} lg={3} item style={{margin: '3vh'}}>
                            <Typography variant="h6">Description: </Typography>
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
                            <Typography variant="h6">Item Notes: </Typography>
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
                    <SnackbarContentWrapper
                        onClose={this.handleSnackbarClose}
                        variant={this.state.variant}
                        message={this.state.snackbarMessage}
                    />
                </Snackbar>
            </div>
        );
    }
}

export default withStyles(styles)(Accession);