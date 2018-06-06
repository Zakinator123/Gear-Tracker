import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const styles = {
  root: {
    flexGrow: 1,
  },
};

function LoadingBar(props) {
  const { classes } = props;
  return (
    <div className={classes.root} style={{marginTop:'30vh', marginBottom: '12vh'}}>
      <LinearProgress />
        <br/>
      <LinearProgress color="secondary" />
    </div>
  );
}

LoadingBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(LoadingBar);
