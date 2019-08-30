// Utility library for common functions

import Amplify, {Auth} from 'aws-amplify';

let AmplifyConfiguration = function () {
    Amplify.configure({
        Auth: {
            region: 'us-east-1',
            userPoolId: 'us-east-1_i92prdhXi',
            userPoolWebClientId: '2tqknhl827t8h9gpj2k4qac20k',
        }
    });

    Auth.configure({
        oauth: {
            domain: 'login.gear-tracker.com',
            scope: ['phone', 'email', 'profile', 'openid'],
            redirectSignIn: 'http://localhost:3000',
            redirectSignOut: 'http://localhost:3000',
            responseType: 'code',
        }
    });
};

let getBearerAccessToken = function () {
    return Auth.currentSession()
        .then(data => ("Bearer " + data['accessToken']['jwtToken']))
        .catch(err => console.log(err));
};


let getUserName = function () {
    return Auth.currentSession()
        .then(data => (data['idToken']['payload']['name']))
        .catch(err => console.log(err));
};


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

export {AmplifyConfiguration, getBearerAccessToken, getUserName, showErrorSnackbarIfInReadOnlyMode}