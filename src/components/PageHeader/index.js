import React from 'react';

import './index.css';

export default class PageHeader extends React.Component {
    render() {
        const { title, rightView, bottomView } = this.props;
        return <div className="page-header-container">
            <div className="top_row">
                <div className="page-header-title">{title}</div>
                <div className="right-section">{rightView && rightView()}</div>
            </div>
            <div className="bottom_row">
                {bottomView && bottomView()}
            </div>
        </div>
    }
}