import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import Api from '../modules/Api';


class PasswordResetVerify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      form: {
        resetToken: "",
        newPassword: "",
        passwordConfirm: ""
      },
      errors: {
        summary: null,
        resetToken: null,
        newPassword: null,
        passwordConfirm: null
      },
      instructions: {
        resetToken: null,
        newPassword: null,
        passwordConfirm: null
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
    const resetToken = form.resetToken;
    const resetTokenValid = resetToken && resetToken.length > 6;
    const newPassword = form.newPassword;
    const newPasswordValid = newPassword && newPassword.length > 6;
    const passwordConfirm = form.passwordConfirm;
    const passwordConfirmValid = passwordConfirm && passwordConfirm.length > 6 && passwordConfirm === newPassword;
    const formValid = resetTokenValid && newPasswordValid && passwordConfirmValid;
    let errors = this.state.errors;
    let instructions = this.state.instructions;
    if (formValid) {
      Api.postPublic('reset-password/validate', this.state.form)
      .then((result) => {
        this.props.debug && console.log('PasswordResetVerify.onFormSubmit.result', result);
        if (result.success) {
          this.setState({ redirect: true });
        } else {
          form.resetToken = "";
          form.newPassword = "";
          form.passwordConfirm = "";
          errors.summary = result.message;
          errors.resetToken = null;
          errors.newPassword = null;
          errors.passwordConfirm = null;
          instructions.resetToken = null;
          instructions.newPassword = null;
          instructions.passwordConfirm = null;
          this.setState({form, errors, instructions});
        }  
      });
    } else {
      if (!resetTokenValid) { errors.resetToken = "You must provide a valid reset token." } else { instructions.resetToken = "Reset Token Valid" }
      if (!newPasswordValid) { errors.newPassword = "You must provide a valid new password with more than 6 characters." } else { instructions.newPassword = "New Password Valid" }
      if (!passwordConfirmValid) { errors.passwordConfirm = "The password and confirm password do not match one another." } else { instructions.passwordConfirm = "Password Confirm Valid" }
      this.setState({form, errors, instructions});
    }
  }

  render() {
    const form = this.state.form;
    if (this.state.redirect) { return <Redirect to="/login" /> }
    return (
      <div className="PasswordResetVerify container-fluid">
        <div className="row">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto">
            <div className="card rounded-0 mt-3">
              <div className="card-header bg-dark text-light rounded-0">
                <h4 className="card-title mb-0">
                  <i className="mdi mdi-lock-question mr-2"/>Verify Reset Password
                </h4>
              </div>
              <div className="card-body">
                <form onSubmit={this.onFormSubmit}>
                  {this.state.errors.summary && (
                    <div className="form-group">
                      <p className="text-danger">{this.state.errors.summary}</p>
                    </div>
                  )}
                  <p className="card-text">Enter your verification code sent to you by email.</p>
                  <div className="form-group">
                    <label htmlFor="resetToken">Reset Token</label>
                    <input 
                      type="password" 
                      name="resetToken" 
                      className="form-control" 
                      onChange={ this.onInputChange } 
                      value={ form.resetToken }
                      placeholder="your.reset.token" 
                    />
                    {this.state.errors.resetToken && <small className="text-danger">{this.state.errors.resetToken}</small>}
                  </div>
                  {form.resetToken && form.resetToken.length > 6 && (
                    <>
                      <div className="form-group">
                        <label htmlFor="newPassword">New Password</label>
                        <input 
                          type="password" 
                          name="newPassword" 
                          className="form-control" 
                          onChange={ this.onInputChange } 
                          value={ form.newPassword }
                          placeholder="your new password" 
                        />
                        {this.state.errors.newPassword && <small className="text-danger">{this.state.errors.newPassword}</small>}
                      </div>
                      <div className="form-group">
                        <label htmlFor="passwordConfirm">Password Confirm</label>
                        <input 
                          type="password" 
                          name="passwordConfirm" 
                          className="form-control" 
                          onChange={ this.onInputChange } 
                          value={ form.passwordConfirm }
                          placeholder="your new password (again)" 
                        />
                        {this.state.errors.passwordConfirm && <small className="text-danger">{this.state.errors.passwordConfirm}</small>}
                      </div>                      
                    </>
                  )}
                  <button type="submit" className="btn btn-block btn-success mt-3">
                    <i className="mdi text-lg mdi-lock-question mr-2" />Submit
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

export default PasswordResetVerify;
