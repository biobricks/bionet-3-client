import React from 'react';
import './Grid.scss';
import GridContainer from './GridContainer';

class AddGrid extends React.Component {

  render() {
    const record = this.props.record;
    const recordType = this.props.recordType;
    return (
      <div className="AddGrid card rounded-0 mt-3 mb-3">
        <div className="card-header bg-dark text-light rounded-0">
          <h4 className="card-title mb-0 text-capitalize">
            <i className={recordType === 'Lab' ? 'mdi mdi-teach mr-2' : 'mdi mdi-grid mr-2'} />{record ? record.name : 'Error'}
          </h4>
        </div>
        <div className="card-body">
          {/* {this.props.addFormActive && ( */}
            <GridContainer
              record={this.props.record}
              moveActive={this.props.moveActive}
              addFormActive={this.props.addFormActive}
              addFormType={this.props.addFormType}
              addForm={this.props.addForm}
              containers={this.props.containers}
              physicals={this.props.physicals}
              locations={this.props.locations}
              newItemLocations={this.props.newItemLocations}
              addLocation={this.props.addLocation}
              removeLocation={this.props.removeLocation}
              isDragging={this.props.isDragging}
              draggingOver={this.props.draggingOver}
              draggedRecord={this.props.draggedRecord}
              onCellDrag={this.props.onCellDrag}
              onCellDragStart={this.props.onCellDragStart}
              onCellDragOver={this.props.onCellDragOver}
              onCellDrop={this.props.onCellDrop}
              onCellDragEnd={this.props.onCellDragEnd}
            />
          {/* )} */}
        </div>
      </div>
    );
  }
}

export default AddGrid;
