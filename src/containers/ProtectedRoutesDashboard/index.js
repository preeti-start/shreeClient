import React from 'react';
import { connect } from 'react-redux'

import './index.css'
import LeftNav from '../../components/LeftNav';
import AppHeader from '../AppHeader';
import { roles } from '../../constants'
import { Route } from "react-router-dom";
import history from '../../utils/history'

class ProtectedRoutesDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.onNavClick = this.onNavClick.bind(this);
    }

    onNavClick(path) {
        const { userDetails } = this.props;
        userDetails && userDetails._id && history.push(path.replace(':userId', userDetails._id))
    }

    render() {
        const { userDetails, vendorDetails, buyerDetails, component, path } = this.props;
        let currentUserDetails = undefined;
        if (userDetails && userDetails.role) {
            if (userDetails.role === roles.admin) {
                currentUserDetails = userDetails
            }
            if (userDetails.role === roles.vendor) {
                currentUserDetails = vendorDetails
            }
            if (userDetails.role === roles.buyer) {
                currentUserDetails = buyerDetails
            }
        }
        if (currentUserDetails) {
            return <div className="protected-dashboard-container">
                <AppHeader/>
                <div className="protected-dashboard-body">
                    <LeftNav onNavClick={this.onNavClick} path={path} userRole={userDetails && userDetails.role}/>
                    <div id="dashboard" className="protected-dashboard-route">
                        <Route path={path} component={component}/>
                    </div>
                </div>
            </div>
        }
        return null;
    }
}

export default connect(state => ({
    userDetails: state.users.userDetails,
    buyerDetails: state.users.buyerDetails,
    vendorDetails: state.users.vendorDetails,
}), {})(ProtectedRoutesDashboard)
