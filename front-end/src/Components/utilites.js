// Utility library for common functions

let showErrorSnackbarIfInReadOnlyMode = function (setState) {
        if (parseInt(sessionStorage.getItem('token'), 10) === 0) {
            setState({
                snackbarMessage: 'Checkout unsuccessful - you are in view-only mode. Please log back in as an officer.',
                snackbarVisible: true,
                variant: 'error'
            });
            return true;
        }
        return false;
    };

export  { showErrorSnackbarIfInReadOnlyMode }