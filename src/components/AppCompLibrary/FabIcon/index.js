import React from 'react';
import './index.css';


export default class FabIcon extends React.Component{
    render(){
        const {onIconClick,title}=this.props;
        return <div onClick={onIconClick} className="fab-icon-container">
            <div className="fab-icon-box">{title}</div>
        </div>
    }
}