import React, { Component,  } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import Tooltip from '../Tooltip';

export default class ColumnRender extends Component {
  static propTypes = {
    column: PropTypes.object.isRequired,
    row: PropTypes.object.isRequired,
  }

  getValue(row, column) {
    const { valueAccessor } = this.props;
    const accessor = column.accessor || valueAccessor || function(currentRow) {
      return get(currentRow, column.field, '');
    }
    return accessor(row, column)
  }

  render() {
    const { row, column, rowIndex, selectRow } = this.props;
    if (column.Cell) {
      return column.Cell(row, rowIndex, column, selectRow)
    }
    const value = this.getValue(row, column);
    const title = column.getTitle ? column.getTitle(row, column, value) : value;
    const label = column.renderer ? column.renderer(row, column, value) : value;

    return (
      <div className="table-column-value" title={column.showTooltip ? undefined : title}>
        {column.showTooltip && <Tooltip overlay={label}>
          <div className="table-column-value">{label}</div>
        </Tooltip>}
        {!column.showTooltip && label}
      </div>
    )
  }
}
