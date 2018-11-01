import React, { Component } from 'react';
import './LabProfile.css';

class LabProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const lab = this.props.itemSelected;
    return (
      <div className="LabProfile">
        <div className="card mt-3 rounded-0">
          <div className="card-header rounded-0 bg-info text-light">
            <h4 className="card-title mb-0 text-capitalize">
              <i className="mdi mdi-teach mr-2"/>
              {this.props.itemSelected.name}
            </h4>
          </div>
          <div className="card-body">
            <p className="card-text">
              {lab.description}
            </p>
            <p className="card-text">
              <i className="mdi mdi-account-multiple mr-2"/>Members: {lab.users.length}
            </p>
          </div>
        </div>    
      </div>
    );
  }
}

export default LabProfile;  