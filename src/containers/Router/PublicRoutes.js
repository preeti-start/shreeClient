import React from 'react';
import { Route } from "react-router-dom";
import PublicRoutesDashboard from "../PublicRoutesDashboard";
import history from '../../utils/history'
import { validAppRoutes, roles } from '../../constants'
import { getItemFromPersistentStore } from '../../utils/Persist';
import { Redirect } from 'react-router-dom'

export default class PublicRoutes extends React.Component {
    constructor(props) {
        super(props);
        this.onLoginClick = this.onLoginClick.bind(this);
        const user = getItemFromPersistentStore('user');
        this.isAutenticated = user && user.token ? user : undefined;
    }

    onLoginClick(e) {
        e.preventDefault();
        history.push(validAppRoutes.login);
    }

    render() {
        const { path, component } = this.props;
        if (this.isAutenticated && this.isAutenticated.role && path && (path === validAppRoutes.login)) {
            if (this.isAutenticated.role === roles.buyer) {
                return <Redirect to={validAppRoutes.buyerProfile.replace(":userId", this.isAutenticated._id)}/>
            }
            else if (this.isAutenticated.role === roles.vendor) {
                return <Redirect to={validAppRoutes.vendorProfile.replace(":userId", this.isAutenticated._id)}/>
            }
            else if (this.isAutenticated.role === roles.admin) {
                return <Redirect to={validAppRoutes.shopCategories.replace(":userId", this.isAutenticated._id)}/>
            }
        }
        if (path === validAppRoutes.login) {
            return <Route
                component={component}
                path={path}
            />
        }
        return <PublicRoutesDashboard
            {...this.props}
            onLoginClick={this.onLoginClick}
        />

    }
}
