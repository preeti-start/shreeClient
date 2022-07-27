import React from 'react';
import './index.css';

export const loadingComp = props => (<div
  className={`pre-loader-loading-comp ${props && props.small ? 'pre-loader-loading-comp-small' : ''}
  ${props && props.large ? 'pre-loader-loading-comp-large' : ''}`}/>);

