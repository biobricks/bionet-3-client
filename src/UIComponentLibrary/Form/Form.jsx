import React, { Component } from 'react';

class Form extends Component {
  render() {
    return ( 
      <form className={`
        col-sm-${this.props.sm} 
        col-md-${this.props.md} 
        col-lg-${this.props.lg}
        `}>
        {this.props.children}
      </form>
    );
  }
}
export default Form;