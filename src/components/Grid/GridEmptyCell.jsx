import React from 'react';
import './GridEmptyCell.scss';

class GridEmptyCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.onPhysicalClick = this.onPhysicalClick.bind(this);
  }

  onPhysicalClick(e) {
    const row = Number(e.target.getAttribute('row'));
    const column = Number(e.target.getAttribute('column'));
    const location = [row, column];
    let cellIsSelected = false;
    for(let i = 0; i < this.props.newItemLocations.length; i++) {
      const newItemLocation = this.props.newItemLocations[i];
      const rowMatches = newItemLocation[0] === row;
      const columnMatches = newItemLocation[1] === column;
      if (rowMatches && columnMatches) { cellIsSelected = true }
    }
    cellIsSelected ? this.props.removeLocation(location) : this.props.addLocation(location);
  } 

  render() {
    const row = this.props.row;
    const column = this.props.column;
    const formActive = this.props.addFormActive;
    const form = this.props.addForm;
    let cellIsSelected = false;
    if (formActive) {
      for(let i = 0; i < this.props.newItemLocations.length; i++) {
        const newItemLocation = this.props.newItemLocations[i];
        const newRow = newItemLocation[0];
        const newColumn = newItemLocation[1];
        const rowMatches = newRow === row;
        const columnMatches = newColumn === column;
        if (rowMatches && columnMatches) { 
          cellIsSelected = true
          //selectionArray.push([row, column]);   
        }
        if (formActive) {
          // add form row and column span to selection
          const rowSpanMax = newRow + form.rowSpan - 1;
          const locationWithinRowSpan = row >= newRow && row <= rowSpanMax;
          const columnSpanMax = newColumn + form.columnSpan - 1;
          const locationWithinColumnSpan = column >= newColumn && column <= columnSpanMax;
          const locationWithinSpan = locationWithinRowSpan && locationWithinColumnSpan;
          if (locationWithinSpan) { cellIsSelected = true }  
        }  
      }
    }
    const emptyChildStyles = {
      'display': 'grid',
      'alignSelf': 'stretch',
      'justifySelf': 'stretch',
      'gridTemplateColumns': '1fr',
      'gridTemplateRows': '1fr',
      'gridColumn': `${column} / span 1`,
      'gridRow': `${row} / span 1`,
      'backgroundColor': cellIsSelected ? form.bgColor !== '#00D1FD' ? form.bgColor : "#42f483" : "white"
    };
    return (
      <div 
        // className={cellIsSelected ? 'selected empty grid-item' : 'empty grid-item'}
        // isselected={cellIsSelected ? 'true' : 'false'}
        className="GridEmptyCell empty grid-item"
        style={emptyChildStyles}
        row={row}
        column={column}
        data-toggle="tooltip"
        data-placement="top"
        title={`Row ${row}, Column ${column}\nEmpty`}
        onClick={this.onPhysicalClick}
        //onDrop={props.onCellDrop}
        //onDragOver={props.onCellDragOver}
        //onDragEnd={props.onCellDragEnd}
        //draggable={false}
      ></div>     
    );  
  }
}

export default GridEmptyCell;
