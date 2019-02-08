import React, { Component } from 'react';
import './VirtualProfile.css';

class VirtualProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const virtual = this.props.itemSelected;
    return (
      <div className="VirtualProfile">
        <div className="card mt-3 rounded-0">
          <div className="card-header rounded-0 bg-info text-light">
            <h4 className="card-title mb-0 text-capitalize">
              <i className="mdi mdi-dna mr-2"/>
              {virtual.name}
            </h4>
          </div>
        </div>    
      </div>
    );
  }
}

export default VirtualProfile;  