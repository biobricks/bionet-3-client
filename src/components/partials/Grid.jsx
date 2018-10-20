import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import shortid from 'shortid';
import './Grid.css';


class Grid extends Component {

  componentDidMount() {
    window.$('[data-toggle="tooltip"]').tooltip();
  }  
  
  componentDidUpdate() {
    window.$('[data-toggle="tooltip"]').tooltip();
  }


  render() {

    const record = this.props.record || null;
    const gridContainerStyles = {
      'gridTemplateColumns': record ? `repeat(${record.columns}, 1fr)` : '1fr',
      'gridTemplateRows': record ? `repeat(${record.rows}, 1fr)` : '1fr',
    };
    let gridContainerChildren = [];
    let positionCounter = 1;
    for(let rowNo = 1; rowNo <= record.rows; rowNo++){
      for(let colNo = 1; colNo <= record.columns; colNo++){
        let emptyChildStyles = {
          'display': 'grid',
          'alignSelf': 'stretch',
          'justifySelf': 'stretch',
          'gridTemplateColumns': '1fr',
          'gridTemplateRows': '1fr'
        };
        //let isSelectedNewLocation = this.props.mode === 'new' && rowNo === Number(this.props.newItemY) && colNo === Number(this.props.newItemX);
        gridContainerChildren.push(
          <div 
            key={shortid.generate()}
            className={'empty grid-item'}
            style={emptyChildStyles}
            row={rowNo}
            col={colNo}
            pos={positionCounter}
            data-toggle="tooltip"
            data-placement="top"
            title={`${this.props.recordType} ${rowNo}, ${colNo} (Empty)`}
            //onDragOver={this.props.onCellDragOver}
            //onDrop={!this.props.parentVisible ? this.props.onCellDrop : null}
            //draggable={false}
            //onClick={this.props.mode === 'new' ? this.props.handleSetNewLocation : null }
          ></div>
        );
        positionCounter++;
      }  
    }
    return (
      <div className="card mt-3">
        <div className="card-header bg-dark text-light">
          <h4 className="card-title mb-0 text-capitalize">
            {this.props.record.name.length > 0 ? this.props.record.name : (this.props.demo ? `(Select A ${this.props.recordType} Name)` : "Loading...")}
          </h4>
        </div>
        <div className="card-body">
          <div className="grid-container dropdown" style={gridContainerStyles}>
            {gridContainerChildren}
          </div>
        </div>
      </div>
    );
  }
}

export default Grid;
