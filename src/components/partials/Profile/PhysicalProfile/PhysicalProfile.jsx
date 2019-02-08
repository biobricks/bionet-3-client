import React, { Component } from 'react';
import './PhysicalProfile.css';

class PhysicalProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const physical = this.props.itemSelected;
    return (
      <div className="PhysicalProfile">
        <div className="card mt-3 rounded-0">
          <div className="card-header rounded-0 bg-info text-light">
            <h4 className="card-title mb-0 text-capitalize">
              <i className="mdi mdi-flask mr-2"/>
              {physical.name}
            </h4>
          </div>
        </div>    
      </div>
    );
  }
}

export default PhysicalProfile;  