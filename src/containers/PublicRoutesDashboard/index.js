import React from 'react';
import { Route } from 'react-router-dom'
import { connect } from 'react-redux'

import './index.css'

class Dashboard extends React.Component {

    render() {
        const { component, path } = this.props;
        return <div id={"public-dashboard"} className="public-dashboard-container">
            <Route path={path} component={component}/>
        </div>
    }
}

export default connect((state = {}, OwnProps = {}) => ({}), {})(Dashboard)
