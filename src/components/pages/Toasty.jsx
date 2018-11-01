import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';

// import shortid from 'shortid';
import AlertCard from './../partials/AlertCard';

const SuccessMessage = () => {
  return(
    <div>
        <h4>
          {/* {this.props.alertType} */}
          Success
        </h4>
        <hr/>
        <p>
        {/* {this.props.alertMessage} */}
        This is the success message
        </p>
      
    </div>
  )
}

const ErrorMessage = () => {
  return(
    <div>
        <h4>
          {/* {this.props.alertType} */}
          Error
        </h4>
        <hr/>
        <p>
        {/* {this.props.alertMessage} */}
        This is an error message
        </p>
      
    </div>
  )
}

class Toasty extends Component {
  state = {  }
  componentDidMount() {
    console.log(this.props.alertType)
    console.log(this.props.alertMessage)
    // render as component; set to default; options: toast.success, error, info 
    toast.success(<SuccessMessage/>, {
      className: css({
        color: 'white',
        borderRadius: '5px',
        padding: '1.25rm',
        backgroundColor: '#5cb85c',
        fontFamily: "Helvetica"
      }),
    });
    toast.error(<ErrorMessage/>, {
      className: css({
        color: 'white',
        borderRadius: '5px',
        padding: '1.25rm',
        backgroundColor: '#d9534f',
        fontFamily: "Helvetica"
      }),
    });
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