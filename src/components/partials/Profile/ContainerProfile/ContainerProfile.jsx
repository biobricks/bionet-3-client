import React, { Component } from 'react';
import './ContainerProfile.css';

class ContainerProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const container = this.props.itemSelected;
    return (
      <div className="ContainerProfile">
        <div className="card mt-3 rounded-0">
          <div className="card-header rounded-0 bg-info text-light">
            <h4 className="card-title mb-0 text-capitalize">
              <i className="mdi mdi-grid mr-2"/>
              {container.name}
            </h4>
          </div>
        </div>    
      </div>
    );
  }
}

export default ContainerProfile;  