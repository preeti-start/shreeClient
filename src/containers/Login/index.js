import React from 'react';
import get from 'lodash/get';
import { connect } from 'react-redux';

import LoginComp from '../../components/Login';
import { loginUser } from '../../redux-store/actions/userActions';
import appStringConstants from '../../constants/appStringConstants';
import { fieldTypes } from '../../constants';
import history from '../../utils/history'

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.handleEnter = this.handleEnter.bind(this);
        this.onLoginClick = this.onLoginClick.bind(this);
    }

    onLoginClick({ formData }) {
        const { phone_no, password } = formData;
        const { loginUser, location } = this.props;
        loginUser && loginUser({
            history,
            password,
            phone_no,
            navigationDetails: get(location, 'state.navigationDetails')
        });
    }

    handleEnter({ event, formData }) {
        const code = event.keyCode || event.which;
        if (code === 13) {
            this.onLoginClick({ formData });
        }
    }

    render() {

        const { isAppLoading } = this.props;
        return <LoginComp
            clickActions={ [
                {
                    title: appStringConstants.loginPageLoginButtonTitle,
                    isLoading: isAppLoading,
                    onClick: this.onLoginClick,
                }
            ] }
            fieldGroups={
                [
                    {
                        title: '',
                        fields: [
                            {
                                field: "phone_no",
                                isMandatory: true,
                                onKeyPress: this.handleEnter,
                                placeholder: appStringConstants.loginPagePhoneNumberBoxPlaceholder,
                                label: appStringConstants.loginPagePhoneNumberBoxPlaceholder,
                            },
                            {
                                field: "password",
                                type: fieldTypes.password,
                                onKeyPress: this.handleEnter,
                                isMandatory: true,
                                label: appStringConstants.loginPagePasswordBoxPlaceholder,
                                placeholder: appStringConstants.loginPagePasswordBoxPlaceholder,
                            }
                        ]
                    }
                ]
            }
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    isAppLoading: state.users.isAppLoading
}), { loginUser })(Login);
