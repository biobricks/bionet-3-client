import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';
// import AlertCard from './../partials/AlertCard';

const SuccessMessage = () => {
  return(
    <div>
        <h4>Success</h4>
        <p>This is the success message</p>
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
        <p>
        {/* {this.props.alertMessage} */}
        This is an error message
        </p>
    </div>
  )
}

class Toasty extends Component {

  setCardAlert(alertType, alertMessage) {
    const Message = () => {
      return(
        <div>
            <h4>{alertType}</h4>
            <p>{alertMessage}</p>
        </div>
      )
    }
    switch(alertType){
      case "success":
        toast(<Message/>, {
          className: css({
            color: 'white',
            borderRadius: '5px',
            padding: '1.25rem',
            backgroundColor: '#5cb85c',
            fontFamily: "Helvetica"
          }),
        });
        break;
      case "error":
        toast(<Message/>, {
          className: css({
            color: '#d9534f',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: '#d9534f',
            backgroundColor: 'black',
            borderRadius: '5px',
            padding: '1.25rem',
            fontFamily: "Helvetica"
          }),
        });
        break;
      case "default":
        toast(<Message/>, {
          className: css({
            color: 'white',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: 'white',
            backgroundColor: 'black',
            borderRadius: '5px',
            padding: '1.25rem',
            fontFamily: "Helvetica"
          }),
        });
        break;  
      default:
        toast.info(alertMessage);
    }
  }

  state = {  }
  componentDidMount() {
    this.setCardAlert("success", "Holy cow it worked")
    this.setCardAlert("error", "Holy cow it worked")
    this.setCardAlert("default", "Holy cow it worked")
    // render as component; set to default; options: toast.success, error, info 
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