import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import shortid from 'shortid';
import AlertCard from './../partials/AlertCard';

const ExampleMessage = () => {
  return(
    <div className="card mt-3">
      <div className="card-header bg-dark text-light">
        <h4 className="card-title mb-0">
          {/* {this.props.alertType} */}
          this is the alert title
        </h4>
      </div>
      <div className="card-body">
        <p className="card-text">
          {/* {this.props.alertMessage} */}
          this is the alert message
        </p>
      </div> 
    </div>
  )
}

class Toasty extends Component {
  state = {  }
  componentDidMount() {
    // render as component; set to default; options: toast.success, error, info 
    toast(<ExampleMessage/>);
    toast(<AlertCard/>);
    // traditional toast
    this.props.setAlert("success", `The thing was successfull.`);
    this.props.setAlert("error", `Noooooooooope.`);
    this.props.setAlert("info", `This is informative.`);
    this.props.setAlert("default", `This is default.`);
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