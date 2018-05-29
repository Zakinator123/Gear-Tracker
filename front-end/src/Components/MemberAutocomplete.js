import React from 'react';
import PropTypes from 'prop-types';
import keycode from 'keycode';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from  '@material-ui/core/Typography';

// const suggestions = [
//     { label: 'Afghanistan' },
//     { label: 'Aland Islands' },
//     { label: 'Albania' },
//     { label: 'Algeria' },
//     { label: 'American Samoa' },
//     { label: 'Andorra' },
//     { label: 'Angola' },
//     { label: 'Anguilla' },
//     { label: 'Antarctica' },
//     { label: 'Antigua and Barbuda' },
//     { label: 'Argentina' },
//     { label: 'Armenia' },
//     { label: 'Aruba' },
//     { label: 'Australia' },
//     { label: 'Austria' },
//     { label: 'Azerbaijan' },
//     { label: 'Bahamas' },
//     { label: 'Bahrain' },
//     { label: 'Bangladesh' },
//     { label: 'Barbados' },
//     { label: 'Belarus' },
//     { label: 'Belgium' },
//     { label: 'Belize' },
//     { label: 'Benin' },
//     { label: 'Bermuda' },
//     { label: 'Bhutan' },
//     { label: 'Bolivia, Plurinational State of' },
//     { label: 'Bonaire, Sint Eustatius and Saba' },
//     { label: 'Bosnia and Herzegovina' },
//     { label: 'Botswana' },
//     { label: 'Bouvet Island' },
//     { label: 'Brazil' },
//     { label: 'British Indian Ocean Territory' },
//     { label: 'Brunei Darussalam' },
// ];

const styles = theme => ({
    root: {
        flexGrow: 1,
        // height: 250,
    },
    container: {
        flexGrow: 1,
        position: 'relative',
    },
    paper: {
        position: 'absolute',
        zIndex: 1,
        marginTop: theme.spacing.unit,
        left: 0,
        right: 0,
    },
    chip: {
        margin: `${theme.spacing.unit / 2}px ${theme.spacing.unit / 4}px`,
    },
    inputRoot: {
        flexWrap: 'wrap',
    },
});

class MemberSearch extends React.Component {

    constructor(props) {
        super(props);
        this.suggestions = "Loading suggestions, please wait";
        let url = this.props.apiHost + '/get_active_members';
        fetch(url, {
            method: 'GET',
            headers:{
                'Authorization': sessionStorage.getItem('token')
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {
                console.log(response);
                if (response['status'] !== 'Success')
                    this.suggestions = response;
                else {
                    console.log("Something went wrong with the API request.")
                }
            });
    }

    getSuggestions(inputValue) {
        let count = 0;

        return this.suggestions.filter(suggestion => {
            const keep =
                (!inputValue || suggestion.c_full_name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) &&
                count < 5;
            if (keep) {
                count += 1;
            }
            return keep;
        });
    }

    renderSuggestion({ suggestion, index, itemProps, highlightedIndex, selectedItem }) {
        const isHighlighted = highlightedIndex === index;
        const isSelected = (selectedItem || '').indexOf(suggestion.c_full_name) > -1;

        return (
            <MenuItem
                {...itemProps}
                key={suggestion.c_full_name}
                selected={isHighlighted}
                component="div"
                style={{
                    fontWeight: isSelected ? 500 : 400,
                }}
            >
                {suggestion.c_full_name} <br/> {suggestion.c_email}
            </MenuItem>
        );
    }

    renderInput(inputProps) {
        const { InputProps, classes, ref, ...other } = inputProps;

        return (
            <TextField
                InputProps={{
                    inputRef: ref,
                    classes: {
                        root: classes.inputRoot,
                    },
                    ...InputProps,
                }}
                {...other}
            />
        );
    }

    render() {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Downshift
                onChange={selection => {
                    console.log(selection);
                    this.props.setMember(selection);
                }}
                >
                    {({getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex}) => (
                        <div className={classes.container}>
                            {this.renderInput({
                                fullWidth: true,
                                classes,
                                InputProps: getInputProps({
                                    placeholder: 'Search for Club Members',
                                    id: 'integration-downshift-simple',
                                }),
                            })}
                            {isOpen ? (
                                <Paper className={classes.paper} square>
                                    {this.getSuggestions(inputValue).map((suggestion, index) =>
                                        this.renderSuggestion({
                                            suggestion,
                                            index,
                                            itemProps: getItemProps({item: suggestion.c_full_name}),
                                            highlightedIndex,
                                            selectedItem,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    )}
                </Downshift>
            </div>
        )
    }
}

MemberSearch.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MemberSearch);
