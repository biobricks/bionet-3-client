import React from 'react';
import { Link } from 'react-router-dom';
import './GridCell.scss';

class GridCell extends React.Component {

  render() {
    const row = this.props.row;
    const column = this.props.column;
    const rowSpan = this.props.record.rowSpan;
    const columnSpan = this.props.record.columnSpan;
    const emptyChildStyles = {
      'display': 'grid',
      'alignSelf': 'stretch',
      'justifySelf': 'stretch',
      'gridTemplateColumns': '1fr',
      'gridTemplateRows': '1fr',
      'gridColumn': `${column} / span ${columnSpan}`,
      'gridRow': `${row} / span ${rowSpan}`,
      'backgroundColor': this.props.recordType === 'Container' ? this.props.record.bgColor : "#00D1FD"
    };
    return (
      <>
        { this.props.recordType === 'Physical' && (
          <div 
            // className={cellIsSelected ? 'selected empty grid-item' : 'empty grid-item'}
            // isselected={cellIsSelected ? 'true' : 'false'}
            className="GridCell physical grid-item"
            style={emptyChildStyles}
            row={row}
            col={column}
            data-toggle="tooltip"
            data-placement="top"
            title={`Row ${row}, Column ${column}\n${this.props.recordType} - ${this.props.record.name}`}
            //onClick={props.selectCell}
            //onDrop={props.onCellDrop}
            //onDragOver={props.onCellDragOver}
            //onDragEnd={props.onCellDragEnd}
            //draggable={false}
          ></div>
        )}
        { this.props.recordType === 'Container' && (
          <Link 
            // className={cellIsSelected ? 'selected empty grid-item' : 'empty grid-item'}
            // isselected={cellIsSelected ? 'true' : 'false'}
            to={`/containers/${this.props.record._id}`}
            className="GridCell container grid-item"
            style={emptyChildStyles}
            row={row}
            col={column}
            data-toggle="tooltip"
            data-placement="top"
            title={`Row ${row}, Column ${column}\n${this.props.recordType} - ${this.props.record.name}`}
            //onClick={props.selectCell}
            //onDrop={props.onCellDrop}
            //onDragOver={props.onCellDragOver}
            //onDragEnd={props.onCellDragEnd}
            //draggable={false}
          />
        )}  
      </>     
    );  
  }
}

export default GridCell;
