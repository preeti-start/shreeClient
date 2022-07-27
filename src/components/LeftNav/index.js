import React from 'react';

import { sideMenuRoutes } from '../../constants'

import './index.css';

export default class LeftNav extends React.Component {

    render() {
        const { userRole, onNavClick, path } = this.props;
        return <div className="left-nav-container">
            {sideMenuRoutes && sideMenuRoutes.length > 0 && sideMenuRoutes.map((route, routeIndex) => {
                let isRouteActive = ((route.path === path) || (route.child_routes && route.child_routes.indexOf(path) > -1));
                if (userRole && route && route.visibleTo.indexOf(userRole) > -1) {
                    return <div key={routeIndex} onClick={_ => onNavClick(route.path, route.title)}
                                className={`left-nav-each-menu  ${isRouteActive ? 'active' : ''}`}>
                        <div className="left-nav-icon-holder">
                            {route.icon && route.icon({ className: isRouteActive ? 'icon-active' : '' })}
                        </div>
                        <div className={`left-nav-menu ${isRouteActive ? 'active' : ''}`}>
                            {route.title}
                        </div>
                    </div>
                }
                return null;
            })}
        </div>
    }
}
