import React from 'react';
import TooltipComponent from './ToolTip';
import './index.css';
import { TOOLTIP_DIRECTION } from '../../../constants'
import { DIRECTION_LTR } from '../../../constants'
export default class Tooltip extends React.Component {
  static defaultProps = {
    tooltipDirection: TOOLTIP_DIRECTION.BOTTOM,
    direction: DIRECTION_LTR,
    showToolTip: true,
    showPermanently: false,
  };

  constructor(props) {
    super(props);
    this.properties = {};
    this.state = {
      isTooltipVisible: props.showPermanently ? true : false,
    };
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.setRef = this.setRef.bind(this);
  }

  onMouseEnter() {
    this.properties = this.ref.getBoundingClientRect();
    if (!this.props.showPermanently) this.setState({ isTooltipVisible: true });
  }

  onMouseLeave() {
    if (!this.props.showPermanently) this.setState({ isTooltipVisible: false });
  }

  setRef(ref) {
    this.ref = ref;
  }

  renderToolTipComponent() {
    if (!this.state.isTooltipVisible) {
      return null;
    }
    const { tooltipDirection, direction } = this.props;
    return <TooltipComponent
      tooltipDirection={tooltipDirection}
      direction={direction}
      tooltip={this.props.overlay}/>
  }

  renderToolTip() {
    return (
      <div className={`tooltip-container ${this.props.containerClass}`}>
        <div onMouseEnter={this.onMouseEnter} onClick={this.onMouseLeave}
          onMouseLeave={this.onMouseLeave} ref={this.setRef}>
          {this.props.children}
        </div>
        {this.renderToolTipComponent()}
      </div>
    )
  }

  render() {
    return (
      <div className="tooltip-outer-box">
        {this.props.showToolTip ? this.renderToolTip() : this.props.children}
      </div>
    )
  }
}
