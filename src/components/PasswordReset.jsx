import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Api from '../modules/Api';

class PasswordReset extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      form: {
        email: ""
      },
      errors: {
        summary: null,
        email: null
      },
      instructions: {
        email: null
      }
    };
    this.onInputChange = this.onInputChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
  }  

  onInputChange(e) {
    e.preventDefault();
    let form = this.state.form;
    let attribute = e.target.getAttribute('name');
    let newValue = e.target.value;
    form[attribute] = newValue;
    this.setState({form});
  }

  onFormSubmit(e) {
    e.preventDefault();
    const form = this.state.form;
    const email = form.email;
    const emailValid = email && email.length > 9;
    const formValid = emailValid;
    let errors = this.state.errors;
    let instructions = this.state.instructions;
    if (formValid) {
      Api.postPublic('reset-password', this.state.form)
      .then((result) => {
        this.props.debug && console.log('PasswordReset.onFormSubmit.result', result);
        if (result.success) {
          this.setState({ redirect: true });
        } else {
          form.email = "";
          errors.summary = result.message;
          errors.email = null;
          instructions.email = null;
          this.setState({form, errors, instructions});
        }  
      });
    } else {
      if (!emailValid) { errors.email = "You must provide a valid email." } else { instructions.email = "Email Valid" }
      this.setState({form, errors, instructions});
    }
  }

  render() {
    if (this.state.redirect) { return <Redirect to="/password-reset/verify" /> }
    return (
      <div className="PasswordReset container-fluid">
        <div className="row">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto">
            <div className="card rounded-0 mt-3">
              <div className="card-header bg-dark text-light rounded-0">
                <h4 className="card-title mb-0">
                  <i className="mdi mdi-lock-reset mr-2"/>Reset Password
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={this.onFormSubmit}>
                  {this.state.errors.summary && (
                    <div className="form-group">
                      <p className="text-danger">{this.state.errors.summary}</p>
                    </div>
                  )}
                  <p className="card-text">Enter your email associated with your account and you will be sent instructions on how to reset your password.</p>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                      type="text" 
                      name="email" 
                      className="form-control" 
                      onChange={ this.onInputChange } 
                      value={ this.state.form.email }
                      placeholder="youraccountemail@example.com" 
                    />
                    {this.state.errors.email && <small className="text-danger">{this.state.errors.email}</small>}
                  </div>
                  <button className="btn btn-block btn-success mt-3">
                    <i className="mdi text-lg mdi-lock-reset mr-2" />Submit
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default PasswordReset;
