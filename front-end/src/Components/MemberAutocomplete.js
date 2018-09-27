import React from 'react';
import PropTypes from 'prop-types';
import Downshift from 'downshift';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';


const styles = theme => ({
    root: {
        flexGrow: 1,
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

    //TODO: Should suggestions be in state?
    constructor(props) {
        super(props);
        this.suggestions = "Loading suggestions, please wait";
        let url = this.props.apiHost + '/get_active_members';
        this.state = {fetchingMembers : true};
        fetch(url, {
            method: 'GET',
            headers:{
                'Authorization': sessionStorage.getItem('token')
            },
            mode: 'cors'
        }).then(response => response.json())
            .catch(error => console.error('Error with HTTP request:', error))
            .then(response => {
                // console.log(response);
                if (response['status'] !== 'Success') {
                    this.suggestions = response;
                    this.setState({fetchingMembers: false});
                }
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

        let jsx;
        if (this.state.fetchingMembers)
            jsx = <CircularProgress/>;
        else
            jsx = (<Downshift
                onChange={selection => {
                    let memberEmail = selection.split(" - ")[1];
                    let memberInfo = this.suggestions.find(member => member.c_email === memberEmail);
                    this.props.setMember(memberInfo);
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
                                            itemProps: getItemProps({item: (suggestion.c_full_name + " - " + suggestion.c_email)}),
                                            highlightedIndex,
                                            selectedItem,
                                        }),
                                    )}
                                </Paper>
                            ) : null}
                        </div>
                    )}
                </Downshift>);

        return (
            <div className={classes.root}>
                {jsx}
            </div>
        )
    }
}

MemberSearch.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(MemberSearch);