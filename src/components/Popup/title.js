import React from 'react';


export const PopupTitle = ({ title, rightAction, className }) => (<div className={`animated-dilog-title ${className}`}>
  {title}
  <div className="animated-dilog-title-right-action">
    {rightAction && rightAction()}
  </div>
</div>)
