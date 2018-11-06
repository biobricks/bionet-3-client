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
      nameValid: false,
      nameText: "",
      emailText: ""
    }
  }

  handleNameChange = e => {
    const nameText = e.target.value;
    this.setState({ nameText });
  };

  handleEmailChange = e => {
    const emailText = e.target.value;
    console.log(emailText);
    this.setState({ emailText });
  };

  viewNameValidationState = () => {
    if (this.state.nameText.length > 0) {
      return (
        <p className="valid">Looks Good</p>
      )
    } else {
      return (
        <p className="notValid">Must have a name</p>
      )
    }
  }

  viewEmailValidationState = () => {
    if ( this.state.emailText.includes("@") ) {
      return (
        <p className="valid">Looks Good</p>
      )
    } else {
      return (
        <p className="notValid">Must have '@'</p>
      )
    }
  }

  hello = (e) => {
    e.preventDefault();
    this.setCardAlert("success", "Holy cow it worked")
  }

  submitIfValidated = () => {
    if (this.state.nameText.length > 0 && this.state.emailText.includes("@")) {
      return (
        <button className="btn btn-primary" type="submit" onClick={this.hello}>Submit form</button>
      )
    } else {
      return (
        <button className="btn btn-primary" type="submit" disabled>Submit form</button>
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
        <form className="needs-validation col-md-4">
          <div className="form-row">
              <label>FirstName</label>
              <input type="text" 
                className="form-control" 
                onChange={this.handleNameChange}
              />
              {this.viewNameValidationState()}
          </div>
          <div className="form-row">
            <label>Email</label>
              <input type="email" 
                className="form-control" 
                onChange={this.handleEmailChange}
              />
              {this.viewEmailValidationState()}
          </div>
        {this.submitIfValidated()}
      </form>
    );
  }
}
 
export default Toasty;