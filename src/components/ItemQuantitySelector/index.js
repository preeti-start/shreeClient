import React from 'react';

import './index.css';

export default class ItemQuantitySelector extends React.Component {
    static defaultProps = {
        onUpdateItemQuantityPress: _ => {
        }
    };

    render() {
        const { value, isLoading, onUpdateItemQuantityPress } = this.props;
        return <div className="add-item-quantity-body">
            <div className="quantity-button-container left-button"
                 onClick={!isLoading ? _ => onUpdateItemQuantityPress({ incBy: -1 }) : undefined}
            >{'-'}</div>
            <span>{value}</span>
            <div className="quantity-button-container right-button"
                 onClick={!isLoading ? _ => onUpdateItemQuantityPress({ incBy: 1 }) : undefined}
            >{'+'}</div>
        </div>
    }
}
