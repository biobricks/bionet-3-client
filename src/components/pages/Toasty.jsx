import React, { Component } from 'react';

class Toasty extends Component {
  state = {  }
  componentDidMount() {
    this.props.setAlert("success", `The thing was successfull.`);
    this.props.setAlert("error", `Noooooooooope.`);
    this.props.setAlert("info", `This is informative.`);
    this.props.setAlert("default", `This is informative.`);
  }
  render() { 
    return (
      <div>
        <h1>You've been toasted</h1>
      </div>
    );
  }
}
 
export default Toasty;