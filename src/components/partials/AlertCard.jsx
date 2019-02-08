import React, { Component } from 'react';

class AlertCard extends Component {
  render() {
    return (
      <div className="card mt-3">
        <div className="card-header bg-dark text-light">
          <h4 className="card-title mb-0">{this.state.type}</h4>
        </div>
        <div className="card-body">
          <p className="card-text">{this.state.message}</p>
        </div> 
      </div>
    );
  }
}

export default AlertCard;
