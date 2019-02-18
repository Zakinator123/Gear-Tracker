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

class DateTimePicker extends React.Component {
    constructor(props) {
        super(props);
        this.classes = props;

        // Get initial date to populate picker: By default this is 7 days from now.
        let weekFromTodayMilliseconds = new Date(Date.now() + 604800000);
        let weekFromToday = new Date(weekFromTodayMilliseconds);

        let date;
        if (weekFromToday.getDate().toString().length > 1)
            date = weekFromToday.getDate().toString();
        else
            date = "0" + weekFromToday.getDate();

        let month;
        if ((weekFromToday.getMonth() + 1).toString().length > 1)
            month = (weekFromToday.getMonth() + 1).toString();
        else
            month = "0" + (weekFromToday.getMonth() + 1);

        let datetime = weekFromToday.getFullYear() + "-"
            + month + "-"
            + date + "T"
            + "23:59";

        props.setDateTime(datetime);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e){
        let newDateTime = e.target.value;
        this.props.setDateTime(newDateTime);
    }

    render() {
        return (
            <div>
                <Typography variant="h6">Gear Due Date</Typography> <br/>
                <form className={this.classes.container} noValidate>
                    <TextField
                        id="datetime-local"
                        type="datetime-local"
                        value={this.props.datetime}
                        onChange={this.handleChange}
                        className={this.classes.textField}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                </form>
            </div>
        );
    }
}

DateTimePicker.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DateTimePicker);
