import React from 'react';
import './GridEmptyCell.scss';

class GridEmptyCell extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isSelected: false
    };
    this.onCellClick = this.onCellClick.bind(this);
  }

  onCellClick(e) {
    const newLocations = this.props.newItemLocations;
    const newLocation = newLocations[0] || [];
    const spanLocation = this.props.spanLocation || []; 
    const row = Number(e.target.getAttribute('row'));
    const column = Number(e.target.getAttribute('column'));
    const location = [row, column];
    let cellIsSelected = false;
    const cellIsSpanLocation = Number(spanLocation[0]) === row && Number(spanLocation[1]) === column;
    const cellIsNewLocation = Number(newLocation[0]) === row && Number(newLocation[1]) === column;
    for(let i = 0; i < newLocations.length; i++) {
      const newItemLocation = newLocations[i];
      const rowMatches = newItemLocation[0] === row;
      const columnMatches = newItemLocation[1] === column;
      if (rowMatches && columnMatches) { cellIsSelected = true }
    }
    if (cellIsSelected && newLocations.length === 1) {
      this.props.removeLocation(location)
    } else if (newLocations.length === 0) {
      this.props.addLocation(location);
    }
    if (!cellIsSelected && !cellIsNewLocation && cellIsSpanLocation) {
      console.log('selected span location', [row, column]);
      this.props.setSpanLocation([]);
    } else if (!cellIsSelected && !cellIsNewLocation) {
      //console.log('newLocations', newLocations)
      this.props.setSpanLocation([row, column]);
    }
  } 

  componentDidMount() {
    window.$('[data-toggle="tooltip"]').tooltip('hide');
    window.$('[data-toggle="tooltip"]').tooltip();
  }  
  
  componentDidUpdate() {
    window.$('[data-toggle="tooltip"]').tooltip('hide');
    window.$('[data-toggle="tooltip"]').tooltip();
  }

  componentWillUnmount() {
    window.$('[data-toggle="tooltip"]').tooltip('hide');
  }
  // componentDidMount() {
  //   //console.log('mounted empty cell', this.props.row, this.props.column)
  //   //console.log(this.props);
  // }

  // componentDidUpdate(prevProps, prevState) {
  //   const previousDraggingOver = prevProps.draggingOver;
  //   const currentDraggingOver = this.props.draggingOver;
  //   console.log(`updated ${currentDraggingOver[0]}, ${currentDraggingOver[1]}`);
  //   console.log('comp', previousDraggingOver, currentDraggingOver)
  //   const rowChanged = previousDraggingOver[0] !== currentDraggingOver[0];
  //   const columnChanged = previousDraggingOver[0] !== currentDraggingOver[0];
  //   const draggingOverChanged = rowChanged || columnChanged;
  //   // if(draggingOverChanged) {
  //     console.log(`dragging over [${currentDraggingOver[0]}, ${currentDraggingOver[1]}]`)
  //     const thisRow = this.props.row;
  //     const thisColumn = this.props.column;
  //     const rowMatches = thisRow === currentDraggingOver[0];
  //     const columnMatches = thisColumn === currentDraggingOver[1];
  //     const isMatch = rowMatches && columnMatches;
  //     if (isMatch) {
  //       this.setState({
  //         isSelected: true
  //       });
  //     }
  //   //}
  // }

  render() {
    const row = this.props.row;
    const column = this.props.column;
    const formActive = this.props.addFormActive;
    const moveActive = this.props.moveActive;
    const form = this.props.addForm;
    let cellIsSelected = false;
    let cellIsNewLocation = false;
    const isDragging = this.props.isDragging;
    const isSelected = this.state.isSelected;
    if (isSelected){
      cellIsSelected = true;
    }
    if (moveActive && isDragging) {
      const draggingOver = this.props.draggingOver;
      const draggingOverExists = draggingOver.length > 0;
      //if (draggingOverExists) { console.log(`dragging over [${draggingOver[0]}, ${draggingOver[1]}]`) };
      const draggedRecord = this.props.draggedRecord;
      const thisLocation = [row, column];
      if (draggingOverExists && thisLocation[0] === draggingOver[0] && thisLocation[1] === draggingOver[1]){
        cellIsSelected = true;
      }
      let selectionRange = [];
      const rowMin = draggingOver[0];
      const rowMax = rowMin + draggedRecord.rowSpan - 1;
      const columnMin = draggingOver[1];
      const columnMax = columnMin + draggedRecord.columnSpan - 1;
      for(let rowNo = rowMin; rowNo <= rowMax; rowNo++){
        for(let columnNo = columnMin; columnNo <= columnMax; columnNo++){
          selectionRange.push([rowNo, columnNo]);
        }
      }
      //console.log(selectionRange)
      for(let i = 0; i < selectionRange.length; i++){
        let rangeLocation = selectionRange[i];
        if (thisLocation[0] === rangeLocation[0] && thisLocation[1] === rangeLocation[1]) {
          console.log('match', thisLocation, rangeLocation);
          cellIsSelected = true;
        }
      }
    }
    if (formActive) {
      for(let i = 0; i < this.props.newItemLocations.length; i++) {
        const newItemLocation = this.props.newItemLocations[i];
        const newRow = newItemLocation[0];
        const newColumn = newItemLocation[1];
        const rowMatches = newRow === row;
        const columnMatches = newColumn === column;
        if (rowMatches && columnMatches) { 
          cellIsSelected = true
          cellIsNewLocation = true;
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
    let bgColor;
    if (formActive) {
      bgColor = cellIsSelected ? form.bgColor !== '#00D1FD' ? form.bgColor : "#42f483" : "#FFFFFF";
    } else if (moveActive) {
      bgColor = cellIsSelected ? "#42f483" : "#FFFFFF";
    }
    const emptyChildStyles = {
      'display': 'grid',
      'alignSelf': 'stretch',
      'justifySelf': 'stretch',
      'gridTemplateColumns': '1fr',
      'gridTemplateRows': '1fr',
      'gridColumn': `${column} / span 1`,
      'gridRow': `${row} / span 1`,
      'backgroundColor': bgColor
    };
    return (
      <div 
        className="GridEmptyCell empty grid-item"
        style={emptyChildStyles}
        row={row}
        column={column}
        data-toggle="tooltip"
        data-placement="top"
        title={`Row ${row}, Column ${column}\nEmpty`}
        onClick={this.onCellClick}
        onDrop={this.props.onCellDrop}
        onDragOver={this.props.onCellDragOver}
        onDragEnd={this.props.onCellDragEnd}
      >
        {cellIsNewLocation && (
          <div style={{'alignSelf': 'center', 'textAlign': 'center'}}>{row},{column}</div>
        )}
      </div>     
    );  
  }
}

export default GridEmptyCell;
