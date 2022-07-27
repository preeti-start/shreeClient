import React from 'react'
import './index.css';

const Loader = ({ className, isCircularLoader }) => {
    if (isCircularLoader) {
        return (
            <div className={`circularLoader ${className}`} />
        )
    }
    if (!isCircularLoader) {
        return <div className="loader-box">
            <div className="bar bar1" />
            <div className="bar bar2" />
        </div>
    }
};
export default Loader;
