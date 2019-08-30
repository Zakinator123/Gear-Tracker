import React from 'react';
import {withOAuth} from 'aws-amplify-react';
import Typography from "@material-ui/core/Typography/Typography";
import Button from "@material-ui/core/Button/Button";

class OAuthButton extends React.Component {

    render() {
        return (
            <Button
                color="primary"
                variant="contained"
                onClick={this.props.OAuthSignIn}
            >
                <Typography
                    variant="button"
                    style={{color: "#ffffff"}}
                >
                    Login
                </Typography>
            </Button>
        )
    }
}

export default withOAuth(OAuthButton);
