import React, { Component } from 'react';
import { Redirect, Link } from 'react-router-dom';
//import appConfig from '../configuration.js';
import Api from '../modules/Api';

class Signup extends Component {

  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     redirect: false,
  //     user: {
  //       username: "",
  //       password: "",
  //       passwordConfirm: "",
  //       email: "",
  //       name: ""
  //     },
  //     errors: {},
  //   };
  //   this.changeUser = this.changeUser.bind(this);
  //   this.processForm = this.processForm.bind(this);
  // }

  // changeUser(e) {
  //   const field = e.target.getAttribute('name');
  //   let user = this.state.user;
  //   user[field] = e.target.value;
  //   this.setState({
  //     user
  //   });    
  // }

  // processForm(e) {
  //   e.preventDefault();
  //   const username = encodeURIComponent(this.state.user.username);
  //   const name = encodeURIComponent(this.state.user.name);
  //   const email = encodeURIComponent(this.state.user.email);
  //   const password = encodeURIComponent(this.state.user.password);
  //   const formData = `username=${username}&password=${password}&name=${name}&email=${email}`;
  //   const xhr = new XMLHttpRequest();
  //   xhr.open('post', `${appConfig.apiBaseUrl}/signup`);
  //   xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
  //   xhr.responseType = 'json';
  //   xhr.addEventListener('load', () => {
  //     console.log(xhr.status)
  //     if(xhr.status === 200){
  //       localStorage.setItem('successMessage', xhr.response.message);
  //       this.setState({
  //         errors: {},
  //         redirect: true
  //       });
  //     } else {
  //       const errors = xhr.response.errors ? xhr.response.errors : {};
  //       errors.summary = xhr.response.message;
  //       this.setState({
  //         errors
  //       });
  //     }
  //   });
  //   xhr.send(formData);
  // }

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      form: {
        name: "",
        email: "",
        username: "",
        password: "",
        passwordConfirm: ""
      },
      successMessage: "",
      errors: {
        summary: null,
        name: "",
        email: "",
        username: "",
        password: "",
        passwordConfirm: ""
      },
      instructions: {
        name: "",
        email: "",
        username: "",
        password: "",
        passwordConfirm: ""
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

    const name = form.name;
    const nameValid = name && name.length > 7; 
    const email = form.email;
    // Todo: Provide email regex validation
    const emailValid = email && email.length > 12; 
    const username = form.username;
    const usernameValid = username && username.length > 4; 
    const password = form.password; 
    const passwordValid = password && password.length > 6;
    const passwordConfirm = form.passwordConfirm;
    const passwordConfirmValid = passwordConfirm === password;

    const formValid = nameValid && emailValid && usernameValid && passwordValid && passwordConfirmValid;
    let errors = this.state.errors;
    let instructions = this.state.instructions;
    this.props.debug && console.log('SignupForm.onFormSubmit.this.state', this.state);
    if (formValid) {
      Api.signup(this.state.form)
      .then((result) => {
        this.props.debug && console.log('SignupForm.onFormSubmit.Api.signup.result', result);
        if (result.success) {
          localStorage.setItem('successMessage', result.message);
          this.setState({ redirect: true });
        } else {
          errors.summary = result.message;
        }  
        form.name = "";
        form.email = "";
        form.username = "";
        form.password = "";
        form.passwordConfirm = "";
        errors.name = null;
        errors.email = null;
        errors.username = null;
        errors.password = null;
        errors.passwordConfirm = null;
        instructions.name = null;
        instructions.email = null;
        instructions.username = null;
        instructions.password = null;
        instructions.passwordConfirm = null;
        this.setState({form, errors, instructions}); 
      });
    } else {
      if (!nameValid) { errors.name = "You must provide a valid name." } else { instructions.name = "Name Valid" }
      if (!emailValid) { errors.email = "You must provide a valid email." } else { instructions.email = "Email Valid" }
      if (!usernameValid) { errors.username = "You must provide a valid username." } else { instructions.username = "Username Valid" }
      if (!passwordValid) { errors.password = "You must provide a valid password." } else { instructions.password = "Password Valid" }
      if (!passwordConfirmValid) { errors.passwordConfirm = "Passwords do not match." } else { instructions.passwordConfirm = "Passwords Match" }
      this.setState({form, errors, instructions});
    }
  }

  render() {
    const form = this.state.form;
    if(this.state.redirect){ return( <Redirect to="/login" /> ) }
    return (
      <div className="container-fluid">
        
        <div className="row">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            <div className="card rounded-0 mt-3">
              <div className="card-header bg-dark-green text-light rounded-0">
                <h4 className="card-title mb-0">Sign Up</h4>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Please fill out the fields below to register for a new account.
                </p>
                <form onSubmit={ this.onFormSubmit }>

                  {this.state.errors.summary && (
                    <div className="form-group">
                      <p className="text-danger">{this.state.errors.summary}</p>
                    </div>
                  )}

                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="name"
                      placeholder="Your Full Name"
                      value={form.name}
                      onChange={this.onInputChange}
                    />
                    {this.state.instructions.name && <small className="form-text text-muted">{this.state.instructions.name}</small>}
                    {this.state.errors.name && <small className="form-text text-danger">{this.state.errors.name}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="name">Email</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="email"
                      placeholder="youremailaddress@example.com"
                      value={form.email}
                      onChange={this.onInputChange}
                    />
                    {this.state.instructions.email && <small className="form-text text-muted">{this.state.instructions.email}</small>}
                    {this.state.errors.email && <small className="form-text text-danger">{this.state.errors.email}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                      type="text"
                      className="form-control"
                      name="username"
                      placeholder="username"
                      value={form.username}
                      onChange={this.onInputChange}
                    />
                    {this.state.instructions.username && <small className="form-text text-muted">{this.state.instructions.username}</small>}
                    {this.state.errors.username && <small className="form-text text-danger">{this.state.errors.username}</small>}
                  </div>
                  <div className="form-group">  
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password"
                      className="form-control"
                      name="password"
                      placeholder="password"
                      value={form.password}
                      onChange={this.onInputChange}                      
                    />
                    {this.state.instructions.password && <small className="form-text text-muted">{this.state.instructions.password}</small>}
                    {this.state.errors.password && <small className="form-text text-danger">{this.state.errors.password}</small>}
                  </div>
                  <div className="form-group">  
                    <label htmlFor="passwordConfirm">Confirm Password</label>
                    <input 
                      type="password"
                      className="form-control"
                      name="passwordConfirm"
                      placeholder="confirm password"
                      value={form.passwordConfirm}
                      onChange={this.onInputChange}                      
                    />
                    { ( form.password.length > 0 && form.passwordConfirm.length > 0) ? (
                        <div>
                          { (form.password === form.passwordConfirm) ? (
                            <small className="text-success">Password Match</small>
                          ) : (
                            <small className="text-danger">Password Does Not Match</small>
                          )}                          
                        </div>  
                      ) : null }
                  </div>
                  {(
                    form.name.length > 0 && 
                    form.email.length > 0 && 
                    form.username.length > 0 && 
                    form.password.length > 0 &&
                    form.passwordConfirm.length > 0 &&
                    form.password === form.passwordConfirm
                  ) ? (
                    <div className="form-group text-center">
                      <button type="submit" className="btn btn-success mt-3">Submit</button>
                    </div>
                  ) : null} 
                </form>
                <p className="mt-3 text-center">
                  <Link to="/login">Have An Account Already?</Link>
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Signup;