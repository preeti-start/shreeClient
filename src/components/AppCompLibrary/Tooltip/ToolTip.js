import React from 'react';
import { TOOLTIP_DIRECTION,DIRECTION_LTR } from '../../../constants';
export default class TooltipComponent extends React.Component {
  constructor(props) {
    super(props);
    this.setRef = this.setRef.bind(this);
  }

  setRef(ref) {
    this.ref = ref
  }

  getTooltipProperties() {
    const { tooltipDirection, direction } = this.props;
    let tooltipStyle;
    let directionClass;
    if (tooltipDirection === TOOLTIP_DIRECTION.TOP) {
      directionClass = 'top';
      tooltipStyle = {
                      position: 'absolute',
                      left: '50%', top: '-15px',
                      transform: 'translate(-50%,-100%)' };
    }
    else if (tooltipDirection === TOOLTIP_DIRECTION.BOTTOM) {
      directionClass = 'bottom';
      tooltipStyle = {
                      position: 'absolute',
                      left: '50%', bottom: '-15px',
                      transform: 'translate(-50%,100%)' };
    }
    else if (tooltipDirection === TOOLTIP_DIRECTION.LEFT) {
      tooltipStyle = {
                       position: 'absolute',
                       left: '-15px', top: '50%',
                       transform: 'translate(-100%,-50%)' };
      directionClass = (direction === DIRECTION_LTR ? 'left' : 'right')
    }
    else if (tooltipDirection === TOOLTIP_DIRECTION.RIGHT) {
      tooltipStyle = {

                      position: 'absolute',
                      right: '-15px', top: '50%',
                      transform: 'translate(100%,-60%)' };
      directionClass = (direction === DIRECTION_LTR ? 'right' : 'left')
    }
    return { directionClass, tooltipStyle };
  }

  render() {
    const { directionClass, tooltipStyle } = this.getTooltipProperties();
    return (
      <div className={`tooltip ${directionClass}`} style={tooltipStyle} ref={this.setRef}>
        {this.props.tooltip}
      </div>
    )
  }
}
