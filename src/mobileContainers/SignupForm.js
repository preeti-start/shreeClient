import React from 'react';
import { connect } from 'react-redux';

import { roles } from "../constants/index";
import { SignUpForm } from "../mobileComponents/index";
import { registerUserWithRole } from "../redux-store/actions/userActions";
import stringConstants from "../constants/mobileStringConstants";
import { setStoreDetails } from "../utils/mobileStore";

class SignupFormContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            role: roles.buyer,
            name: '',
            shop_name: '',
            errorString: '',
        };
        this.onInputFieldChange = this.onInputFieldChange.bind(this);
        this.onRoleChange = this.onRoleChange.bind(this);
        this.onProceedClick = this.onProceedClick.bind(this);
    }

    onInputFieldChange({ key, val }) {
        this.setState({ [key]: val, errorString: '' })
    }

    onRoleChange(role) {
        this.setState({ role, errorString: '' })
    }


    onProceedClick() {
        const { name, role, shop_name } = this.state;
        const { userDetails, userToken, navigationDetails } = this.props;
        const { registerUserWithRole, navigation } = this.props;
        if (name.length === 0) {
            this.setState({ errorString: stringConstants.fieldValNotExistsError(stringConstants.nameFieldTitle) })
        } else if (role === roles.vendor && shop_name.length === 0) {
            this.setState({ errorString: stringConstants.fieldValNotExistsError(stringConstants.unitNameFieldTitle) })
        } else {
            registerUserWithRole && registerUserWithRole({
                setStoreDetails,
                navigationDetails,
                name,
                shop_name,
                userId: userDetails._id,
                role,
                token: userToken,
                navigation
            })
        }
    }

    render() {

        const { isAppLoading } = this.props;
        const { errorString, role, shop_name, name } = this.state;

        return <SignUpForm
            role={role}
            onRoleChange={this.onRoleChange}
            isAppLoading={isAppLoading}
            errorString={errorString}
            onInputFieldChange={this.onInputFieldChange}
            onProceedClick={this.onProceedClick}
            shop_name={shop_name}
            name={name}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    isAppLoading: state.users.isAppLoading,
    userToken: state.users.userToken,
    userDetails: state.users.userDetails,
}), { registerUserWithRole })(SignupFormContainer)
