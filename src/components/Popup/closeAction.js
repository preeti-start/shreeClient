import React from 'react';


export const CloseAction = ({ onClose }) => (<div className="animated-dilog-close-action">
            <span className="animated-dialog-close_action_box" onClick={onClose}>
                <svg className="animated-dialog-close_icon" viewBox="0 0 24 24">
                    <use xlinkHref="#close_icon"/>
                </svg>
              </span>
</div>)
