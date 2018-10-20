import React, { Component } from 'react';

class AlertCard extends Component {
  render() {
    return (
      <div className="card mt-3">
        <div className="card-header bg-dark text-light">
          <h4 className="card-title mb-0">{this.props.title}</h4>
        </div>
        <div className="card-body">
          <p className="card-text">{this.props.message}</p>
        </div> 
      </div>
    );
  }
}

export default AlertCard;
