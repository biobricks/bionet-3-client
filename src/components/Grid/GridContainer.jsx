import React from 'react';
import shortid from 'shortid';
import './GridContainer.scss';
import GridEmptyCell from './GridEmptyCell';
import GridCell from './GridCell';

class GridContainer extends React.Component {

  render() {
    const record = this.props.record;
    const gridContainerStyles = {
      'gridTemplateColumns': record ? `repeat(${record.columns}, 1fr)` : '1fr',
      'gridTemplateRows': record ? `repeat(${record.rows}, 1fr)` : '1fr',
      'height': record ? `${record.rows * 40}px` : '0px',
      'width': record ? `${record.columns * 40}px` : '0px',
    };
    const emptyCells = this.props.locations.empty.map((loc, locIndex) => {
      const row = loc[0];
      const column = loc[1];
      return (
        <GridEmptyCell 
          key={shortid.generate()}  
          row={row} 
          column={column} 
          locations={this.props.locations}
          newItemLocations={this.props.newItemLocations}
          addLocation={this.props.addLocation}
          removeLocation={this.props.removeLocation}
          addFormActive={this.props.addFormActive}
          addFormType={this.props.addFormType}
          addForm={this.props.addForm}
        />
      );       
    });
    const containerCells = this.props.containers.map((container, containerIndex) => {
      return (
        <GridCell 
          key={shortid.generate()}
          recordType="Container" 
          record={container} 
          row={container.row} 
          column={container.column} 
        />     
      );
    });
    const physicalCells = this.props.physicals.map((physical, physicalIndex) => {
      return (
        <GridCell 
          key={shortid.generate()}
          recordType="Physical" 
          record={physical} 
          row={physical.row} 
          column={physical.column} 
        /> 
      );      
    });
    return (
      <div className="GridContainer" style={gridContainerStyles}>
        {emptyCells}
        {containerCells}
        {physicalCells}
      </div>
    );
  }
}

export default GridContainer;
