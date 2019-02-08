import React, { Component } from 'react';
import './UserProfile.css';

class UserProfile extends Component {
  
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const user = this.props.itemSelected;
    return (
      <div className="UserProfile">
        <div className="card mt-3 rounded-0">
          <div className="card-header rounded-0 bg-info text-light">
            <h4 className="card-title mb-0 text-capitalize">
              <i className="mdi mdi-account mr-2"/>
              {user.username}
            </h4>
          </div>
        </div>    
      </div>
    );
  }
}

export default UserProfile;  