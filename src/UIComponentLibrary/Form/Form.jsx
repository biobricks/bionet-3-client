import React, { Component } from 'react';

class Form extends Component {
  state = {  }
  render() {
    return ( 
      <form className={`col-md-${this.props.md}`}>
        {this.props.children}
      </form>
     );
  }
}
 
export default Form;