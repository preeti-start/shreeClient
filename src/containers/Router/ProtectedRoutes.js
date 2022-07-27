import React from 'react';
import ProtectedRoutesDashboard from "../ProtectedRoutesDashboard";
import { getItemFromPersistentStore } from "../../utils/Persist";
import { getLastPath, setLastPath } from "./Constants";
import { validAppRoutes } from "../../constants";
import { Redirect } from 'react-router-dom';


export default class ProtectedRoutes extends React.Component {
    constructor(props) {
        super(props);
        const user = getItemFromPersistentStore('user');
        this.isAutenticated = user && user.token;
    }

    render() {
        const { location } = this.props;
        const lastPath = getLastPath();
        if (!this.isAutenticated) {
            setLastPath(location.pathname);
            return <Redirect to={validAppRoutes.login}/>;
        }
        if (lastPath) {
            const pathToRedirect = lastPath;
            setLastPath(undefined);
            return <Redirect to={pathToRedirect}/>;
        }
        return <ProtectedRoutesDashboard {...this.props}/>
    }
}
