import React, { Component } from 'react';

class Alert extends Component {
  render() {
    
    const alertClass = this.props.type ? `alert alert-${this.props.type} rounded-0 mb-0` : `alert alert-primary rounded-0 mb-0`;

    return (
      <div className={alertClass} role="alert">
        {this.props.message ? this.props.message : 'A simple success alert—check it out!'}
      </div>
    );
  }
}

export default Alert;
