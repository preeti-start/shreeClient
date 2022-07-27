import React from 'react';
import './index.css';
import { notificationStatus } from '../../constants';

export default class Toast extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        const { removeToasts, id } = this.props;
        if (id && removeToasts) {
            this.timer1 = setTimeout(() => {
                this.setState({
                    animatedDiv: 'toast-popup-section-active',
                })
            }, 0);
            this.timer2 = setTimeout(() => {
                this.setState({
                    animatedDiv: 'toast-popup-section-inactive',
                });
            }, 1800);
            this.timer = setTimeout(() => {
                removeToasts({ id });
            }, 2000);
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timer);
        clearTimeout(this.timer1);
        clearTimeout(this.timer2);
    }

    render() {
        const { status, renderScene, toast_text } = this.props;
        if (renderScene) {
            return renderScene;
        }
        return <div className={`toast-popup-section ${this.state.animatedDiv}`}>
            <div className="toast-popup-container">
                {status && status === notificationStatus['1'] && <div className="toast-popup-icon-container">
                    <svg className="toast-popup-icon" viewBox="0 0 15 12">
                        <use xlinkHref="#right_tick_icon"/>
                    </svg>
                </div>}
                {status && status === notificationStatus['2'] &&
                <div className="toast-popup-icon-container toast-popup-error-icon-container">
                    <svg className="toast-popup-error-icon" viewBox="0 0 24 24">
                        <use xlinkHref="#close_icon"/>
                    </svg>
                </div>}
                {status && status === notificationStatus['3'] &&
                <div className="toast-popup-icon-container toast-popup-warning-icon-container">
                    <svg className="toast-popup-info-icon" viewBox="0 0 18 18">
                        <use xlinkHref="#info_icon"/>
                    </svg>
                </div>}
                {status && status === notificationStatus['4'] &&
                <div className="toast-popup-icon-container toast-popup-info-icon-container">
                    <svg className="toast-popup-info-icon" viewBox="0 0 18 18">
                        <use xlinkHref="#info_icon"/>
                    </svg>
                </div>}
                <div className="toast-popup-content">{toast_text}</div>
            </div>
        </div>;

    }
}
