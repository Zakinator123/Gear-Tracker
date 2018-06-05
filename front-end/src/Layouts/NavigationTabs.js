import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import InventoryTable from '../Components/Table';
import Checkout from '../Components/Checkout'
import CheckoutTable from '../Components/CheckoutTable.js'

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
});

class ScrollableTabsButtonAuto extends React.Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <AppBar position="static" color="default">
                    <Tabs
                        value={value}
                        onChange={this.handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                        scrollable
                        scrollButtons="auto"
                    >

                        <Tab label="Check Out Gear" />
                        <Tab label="View Checkouts" />
                        {/*<Tab label="Check In Gear" />*/}
                        <Tab label="Inventory" />
                        {/*<Tab label="Item Five" />*/}
                        {/*<Tab label="Item Six" />*/}
                        {/*<Tab label="Item Seven" />*/}
                    </Tabs>
                </AppBar>
                {value === 0 && <TabContainer> <Checkout apiHost={this.props.apiHost} data={this.props.data} /> </TabContainer>}
                {value === 1 && <CheckoutTable apiHost={this.props.apiHost}/>}
                {/*{value === 1 && <TabContainer> To be completed. </TabContainer>}*/}
                {value === 2 &&  <InventoryTable loggedIn={this.props.loggedIn} data={this.props.data}/> }
                {/*{value === 4 && <TabContainer>Item Five</TabContainer>}*/}
                {/*{value === 5 && <TabContainer>Item Six</TabContainer>}*/}
                {/*{value === 6 && <TabContainer>Item Seven</TabContainer>}*/}
            </div>
        );
    }
}

ScrollableTabsButtonAuto.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ScrollableTabsButtonAuto);