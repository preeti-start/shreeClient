import React, { PropTypes } from 'react';
import './index.css';
import { PopupTitle } from './title';
import { CloseAction } from './closeAction';

export default class PopUp extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.closeDialog = this.closeDialog.bind(this);
        this.onPopState = this.onPopState.bind(this);
        this.onClose = this.onClose.bind(this);
    }


    componentDidMount() {
        this.isCompMounted = true;
        window.addEventListener('popstate', this.onPopState);
        this.timer1 = setTimeout(() => {
            this.setState({
                animation1bgActive: 'animation-1-bg-active',
                animation1Container: 'animation-1-container-active',
            });
        }, 0);
    }

    componentWillUnmount() {
        this.isCompMounted = false;
        clearTimeout(this.timer1);
        clearTimeout(this.timer2);
        window.removeEventListener('popstate', this.onPopState);
    }

    onPopState(event) {
        this.onClose();
    }

    closeDialog() {
        this.setState({
            animation1Container: 'animation-1-container-inactive',
            animation1bgActive: '',
        });
    }

    onClose() {
        if (!this.isCompMounted) {
            return
        }
        this.closeDialog();
        this.timer2 = setTimeout(_ => {
            this.props.onClose && this.props.onClose({});
        }, 1000);
    }

    onPopUpBodyClick(event) {
        event.stopPropagation();
    }

    render() {
        const { title, footerActions, renderScene, rightAction, className } = this.props;
        return (
            <div onClick={this.onClose} className={`animation-1-bg ${this.state.animation1bgActive}`}>
                <div onClick={this.onPopUpBodyClick}
                     className={`animation-1-container ${this.state.animation1Container}`}>

                    {PopupTitle({ title, rightAction, className })}

                    <div className="animated-dilog-body">
                        <div className="animated-dilog-main-div">
                            <div>
                                {renderScene && renderScene({
                                    removePopup: this.onClose,
                                })}
                                {footerActions && [<div className="animated-dilog-seperator"/>,
                                    <div className="animated-dilog-footer">
                                        {footerActions()}
                                    </div>]}
                            </div>
                        </div>
                        {CloseAction({ onClose: this.onClose })}
                    </div>
                </div>
            </div>
        )
    }
}
