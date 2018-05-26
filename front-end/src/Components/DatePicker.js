import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 'auto',
    },
});

function DateTimePicker(props) {
    const { classes } = props;

    let weekFromTodayMilliseconds = new Date(Date.now() + 604800000);
    console.log(weekFromTodayMilliseconds.getMilliseconds());
    let weekFromToday = new Date(weekFromTodayMilliseconds);

    let datetime = weekFromToday.getFullYear() + "-"
        + "0" + (weekFromToday.getMonth()+1) + "-"
        + "0" + weekFromToday.getDate() +  "T"
        + "23:59";

    console.log(datetime);

    return (
        <div>
            <Typography variant="title">Gear Due Date</Typography> <br/>
            <form className={classes.container} noValidate>
                <TextField
                    id="datetime-local"
                    type="datetime-local"
                    defaultValue={datetime}
                    className={classes.textField}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </form>
        </div>
    );
}

DateTimePicker.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateTimePicker);
