import React from 'react';
import { connect } from 'react-redux';


import { PhoneNoRegistration } from '../mobileComponents/index';
import stringConstants from '../constants/mobileStringConstants'
import { generateUserOtp } from '../redux-store/actions/userActions'

class PhoneNoRegistrationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phone_no: '',
            errorString: '',
        };

        this.onForgotPasswordClick = this.onForgotPasswordClick.bind(this);
        this.generateUserPassword = this.generateUserPassword.bind(this);
        this.onPhoneNoChange = this.onPhoneNoChange.bind(this);
        this.onProceedClick = this.onProceedClick.bind(this);
    }

    onPhoneNoChange(phone_no) {
        this.setState({ phone_no, errorString: '' })
    }

    generateUserPassword({ forgot_password = false }) {
        const { phone_no } = this.state;
        const { generateUserOtp, navigation } = this.props;
        if (!phone_no) {
            this.setState({
                errorString: stringConstants.phoneNumberMandatoryErrorWhileLogin
            })
        } else {
            let navigationDetails = undefined;
            if (navigation && navigation.state && navigation.state.params && navigation.state.params.navigationDetails) {
                navigationDetails = navigation.state.params.navigationDetails;
            }
            generateUserOtp({
                phone_no,
                navigation,
                forgot_password,
                navigationDetails,
                onError: ({ error }) => {
                    this.setState({
                        errorString: error
                    })
                }
            })
        }
    }

    onForgotPasswordClick() {
        this.generateUserPassword({ forgot_password: true });
    }

    onProceedClick() {
        this.generateUserPassword({});

    }

    render() {
        const { isAppLoading } = this.props;


        const { errorString, phone_no } = this.state;

        return <PhoneNoRegistration
            onForgotPasswordClick={this.onForgotPasswordClick}
            isAppLoading={isAppLoading}
            errorString={errorString}
            onPhoneNoChange={this.onPhoneNoChange}
            onProceedClick={this.onProceedClick}
            phone_no={phone_no}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    isAppLoading: state.users.isAppLoading
}), { generateUserOtp })(PhoneNoRegistrationContainer)
