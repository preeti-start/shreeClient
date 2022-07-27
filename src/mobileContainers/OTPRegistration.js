import React from 'react';
import { Keyboard } from 'react-native';
import { connect } from 'react-redux';

import { OTPRegistration } from "../mobileComponents/index";
import stringConstants from "../constants/mobileStringConstants";
import { loginUser, generateUserOtp } from '../redux-store/actions/userActions'
import { setStoreDetails } from "../utils/mobileStore";


class OTPRegistrationContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '----',
            pointerIndex: 0,
            errorString: undefined,
        };
        this.onResendOtpClick = this.onResendOtpClick.bind(this);
        this.onProceedClick = this.onProceedClick.bind(this);
        this.getInputBoxRef = this.getInputBoxRef.bind(this);
        this.onChangeText = this.onChangeText.bind(this);
        this.onTextClick = this.onTextClick.bind(this);
        this.keyboardWillHide = this.keyboardWillHide.bind(this);
    }

    componentWillUnmount() {
        this.keyboardWillHideSub.remove();
    }

    componentDidMount() {
        this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
    }

    keyboardWillHide = event => {
        this.inputBoxRef && Keyboard.dismiss()
    };

    getInputBoxRef(ref) {
        this.inputBoxRef = ref;
    }

    onChangeText(value) {
        const { otp, pointerIndex } = this.state;
        const finalVal = value.substr(value.length - 1, 1);
        const finalOtp = otp.substr(0, pointerIndex) + finalVal + otp.substring(pointerIndex + 1);
        this.setState({ otp: finalOtp, errorString: undefined, pointerIndex: (pointerIndex + 1) })
    }

    onTextClick({ index }) {
        this.inputBoxRef.focus();
        this.setState({ pointerIndex: index, errorString: undefined, })
    }

    onProceedClick() {
        const { otp } = this.state;
        const { loginUser, navigation } = this.props;
        const { phone_no, navigationDetails } = navigation.state.params;
        if (phone_no && otp) {
            loginUser && loginUser({
                isMobile: true,
                setStoreDetails,
                onError: ({ error }) => this.setState({ errorString: error }),
                navigationDetails, password: otp, phone_no, navigation
            })
        } else {
            this.setState({ errorString: stringConstants.notifyUserToFillOtp })
        }
    }

    onResendOtpClick() {
        const { generateUserOtp, navigation } = this.props;
        const { phone_no, navigationDetails } = navigation.state.params;
        if (phone_no) {
            this.setState({
                errorString: undefined,
                otp: '----',
                pointerIndex: 0
            });

            generateUserOtp({
                phone_no,
                navigation,
                navigationDetails,
                resend_code: true,
                onError: ({ error }) => {
                    this.setState({
                        errorString: error
                    })
                }
            })
        }
    }

    render() {

        const { isAppLoading, otpResponseMessage, navigation } = this.props;
        const { otp, pointerIndex, errorString } = this.state;
        const { phone_no } = navigation.state.params;

        return <OTPRegistration
            otp={otp}
            pointerIndex={pointerIndex}
            phone_no={phone_no}
            onChangeText={this.onChangeText}
            onTextClick={this.onTextClick}
            getInputBoxRef={this.getInputBoxRef}
            onResendOtpClick={this.onResendOtpClick}
            otpResponseMessage={otpResponseMessage}
            errorString={errorString}
            isAppLoading={isAppLoading}
            onProceedClick={this.onProceedClick}
        />
    }
}

export default connect((state = {}, ownProps = {}) => ({
    otpResponseMessage: state.users.otpResponseMessage,
    isAppLoading: state.users.isAppLoading
}), { loginUser, generateUserOtp })(OTPRegistrationContainer)
