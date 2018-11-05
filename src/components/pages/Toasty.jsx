import React, { Component } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';
import './Toasty.css';
// import AlertCard from './../partials/AlertCard';

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

  constructor(props){
    super(props)
    this.state = {
      nameValid: true
    }
  }

  viewValidationState = () => {
    if (this.state.nameValid === true) {
      return (
        <p className="valid">Looks Good</p>
      )
    } else {
      return (
        <p className="notValid">Must provide a name</p>
      )
    }
  }

  componentDidMount() {
    // this.setCardAlert("success", "Holy cow it worked")
    // this.setCardAlert("error", "Holy cow it worked")
    // this.setCardAlert("default", "Holy cow it worked") 
  }
  render() { 
    return (
        <form className="needs-validation">
          <div className="form-row">
            <div class="col-md-4 mb-3">
              <label for="validationCustom">FirstName</label>
              <input type="text" className="form-control" id="validationCustom"/>
              {this.viewValidationState()}
            </div>
          </div>
          <button class="btn btn-primary" type="submit">Submit form</button>
        </form>
    );
  }
}
 
export default Toasty;