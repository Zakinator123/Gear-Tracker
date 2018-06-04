import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';

const styles = theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
});

// let id = 0;
// function createData(name, calories, fat, carbs, protein) {
//   id += 1;
//   return { id, name, calories, fat, carbs, protein };
// }
//
// const data = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

class CheckoutTable extends React.Component {

    constructor(props){
        super(props);
        this.classes = props;
        this.state = {
            data : [],
            fetched : false
        };

        fetch(props.apiHost + '/checkout/all')
            .then((response) => {
                return response.json();
            })
            .then((myJson) => {
                this.setState({data: myJson,
                    fetched: true})
            });
    }


    render() {

        let jsx;
        if (this.state.fetched) {
            jsx =  this.state.data.map((checkout) => (<ListItem button key={checkout['checkout_id']}>
                <ListItemText
                    primary={'Gear ID: ' + checkout['gear_uid'] + " - " + 'Due Date: ' + checkout['date_due']}
                    secondary={'Checked out by: ' + checkout['member'] + ' on ' + checkout['date_checked_out']}
                /> <Divider/>
                {/*<ListItemSecondaryAction>*/}
                {/*<Tooltip id="tooltip-icon" title="Delete">*/}
                {/*<IconButton onClick={(e) => this.props.removeGear(gearItem['uid'])} aria-label="Delete from Cart">*/}
                {/*<DeleteIcon />*/}
                {/*</IconButton>*/}
                {/*</Tooltip>*/}
                {/*</ListItemSecondaryAction>*/}
            </ListItem>));
        }
        else
            jsx = null;

        return (
            <Grid container
                  alignItems='center'
                  direction="column"
                  alignContent="stretch"
            >
                <Grid item>
                    <Paper style={{marginBottom: '12vh'}} className={this.classes.root}>
                        <List>
                            {jsx}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

CheckoutTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CheckoutTable);