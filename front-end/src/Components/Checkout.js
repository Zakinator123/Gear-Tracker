import React from 'react'
import MemberSearch from './MemberAutocomplete'
import CheckoutCart from './CheckoutCart'
import DateTimePicker from './DatePicker'
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles';


const styles = theme => ({
    root: {
        flexGrow: 1,
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

class Checkout extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            member: '',
            list : [],
        };

        this.setMember = this.setMember.bind(this);
        this.removeGear = this.removeGear.bind(this);
        this.addGearToList = this.addGearToList.bind(this);
        this.checkoutGear = this.checkoutGear.bind(this);
    }

    removeGear(uid) {
        for (let i = 0; i < this.state.list.length; i++)
        {
            if (this.state.list[i]['uid'] == uid)
                this.setState(prevState=>{
                    prevState.list.splice(i, 1);
                    return {list: [...prevState.list]};
                });
        }
    }

    addGearToList(response) {
        let count = 0;
        for (let i = 0; i < response.length; i++) {
            let gear = response[i];
            this.setState(prevState => ({
                list: [...prevState.list, {
                    number: gear['number'],
                    item: gear['item'],
                    description: gear['description'],
                    uid: gear['uid']
                }]
            }));
            count++;
        }

        return count;
    }

    checkoutGear() {

        let gear_uids = (this.state.list).map(gear => gear['uid']);
        let member = this.state.member;
        console.log(gear_uids);

        // fetch(this.props.apiHost + '/login', {
        //     method: 'POST',
        //     body: JSON.stringify({email: this.state.email, password: this.state.password}),
        //     headers:{
        //         'Content-Type': 'application/json'
        //     },
        //     mode: 'cors'
        // }).then(response => response.json())
        //     .catch(error => console.error('Error with HTTP request:', error))
        //     .then(response => {
        //         if (response['status'] !== 'Success')
        //             this.setState({error: true, errorMessageVisibility: 'visible', errorMessage: response['message']});
        //         else {
        //             sessionStorage.setItem('token', response['token']);
        //             this.handleClose();
        //             this.props.logIn();
        //         }
        //     });
    }

    setMember(member) {
        this.setState({member: member});
        console.log(member);
    }


    render() {
        const { classes } = this.props;

        return(
            <div>
                <Grid container
                      alignItems='center'
                      direction="column"
                      alignContent="stretch"
                >
                    <Grid md={6} lg={6} xl={6}  item>
                        <Paper className={classes.paper}>
                            <Typography variant="title">Member: </Typography>
                            <MemberSearch setMember={this.setMember} apiHost={this.props.apiHost}/>
                        </Paper>
                    </Grid>
                </Grid>
                <Grid container
                      style={{marginBottom: '12vh'}}
                      direction="column"
                      alignItems='center'
                      className={classes.root}
                      spacing={8}>
                    <Grid item>
                        <Grid container
                              alignItems='center'
                              direction="row"
                              justify='center'
                              spacing={8}>

                            <Grid item>
                                <Paper className={classes.paper}>
                                    <CheckoutCart addGearToList={this.addGearToList} removeGear={this.removeGear} list={this.state.list} apiHost={this.props.apiHost} data={this.props.data}/>
                                </Paper>
                            </Grid>

                            <Grid item>
                                <Grid container
                                      direction="column"
                                      alignItems="stretch">
                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <Typography variant="title">Checkout Notes: </Typography>
                                            <TextField
                                                multiline
                                                label="(Optional)"/>
                                        </Paper>
                                    </Grid>
                                    <Grid item>
                                        <Paper className={classes.paper}>
                                            <DateTimePicker/>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </Grid>

                        </Grid>
                    </Grid >
                    <Grid item>
                        <Button variant="raised" style={{backgroundColor: '#43A047'}} color="primary">
                            <Typography variant="button" onClick={this.checkoutGear} style={{color:'white'}} align="left">Checkout Gear</Typography>
                        </Button>
                    </Grid>
                </Grid>
            </div>
        );
    }
}

export default withStyles(styles)(Checkout);