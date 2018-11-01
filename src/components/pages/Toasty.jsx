import React, { Component } from 'react';

class Toasty extends Component {
  state = {  }
  componentDidMount() {
    console.log('Wuttup')
    this.props.setAlert("success", `The thing was successfull.`);
    this.props.setAlert("error", `Noooooooooope.`);
  }
  render() { 
    return (

      <div><h1>You've been toasted</h1></div>
    );
  }
}
 
export default Toasty;