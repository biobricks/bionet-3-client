<<<<<<< HEAD
import React, { Component } from 'react';
import Auth from '../modules/Auth';
import { Redirect } from 'react-router-dom';
import appConfig from '../configuration.js';

class Login extends Component {

  constructor(props) {
    super(props);
    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';
    if(storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
=======
import React, { Component } from 'react'
import Auth from '../modules/Auth'
import { Redirect } from 'react-router-dom'
import appConfig from '../configuration.js'
import {TextInput, Card} from 'biokit'
import FadeIn from 'react-fade-in/lib/FadeIn'

class Login extends Component {
  constructor(props) {
    super(props);
    const storedMessage = localStorage.getItem('successMessage')
    let successMessage = ''
    if(storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage')
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
    }
    this.state = {
      redirect: false,
      errors: {},
      successMessage,
      user: {
        username: '',
        password: ''
      }
<<<<<<< HEAD
    };
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }

  processForm(e) {
    e.preventDefault();

    const username = encodeURIComponent(this.state.user.username);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `username=${username}&password=${password}`;

    const xhr = new XMLHttpRequest();
    xhr.open('post', `${appConfig.apiBaseUrl}/login`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        //this.props.setAlert("success", "You have been succesfully logged in");
        Auth.authenticateUser(xhr.response.token);       
=======
    }
    this.processForm = this.processForm.bind(this)
    this.changeUser = this.changeUser.bind(this)
  }
  processForm(e) {
    e.preventDefault();
    const username = encodeURIComponent(this.state.user.username)
    const password = encodeURIComponent(this.state.user.password)
    const formData = `username=${username}&password=${password}`
    const xhr = new XMLHttpRequest()
    xhr.open('post', `${appConfig.apiBaseUrl}/login`)
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    xhr.responseType = 'json'
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        //this.props.setAlert("success", "You have been succesfully logged in")
        Auth.authenticateUser(xhr.response.token)      
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
        this.props.setCurrentUser()
        this.setState({
          redirect: true,
          errors: {}
<<<<<<< HEAD
        });
    
      } else {
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        this.setState({
          errors
        });
      }
    });
    xhr.send(formData);    
  }

  changeUser(e) {
    const field = e.target.name;
    const user = this.state.user;
    user[field] = e.target.value;

    this.setState({
      user
    });
  }

  render() {
    if(this.state.redirect){ 
      console.log(`Redirecting to /`);
      return( <Redirect to={`/`} /> ) 
    }
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            <div className="card rounded-0 mt-3">
              <div className="card-header bg-dark text-light rounded-0">
                <h4 className="card-title mb-0">Login</h4>
              </div>
              <div className="card-body">
                <form onSubmit={ this.processForm }>
                  {this.state.successMessage && <div className="alert alert-success">{ this.state.successMessage }</div>}
                  {this.state.errors.summary && <div className="alert alert-danger">{ this.state.errors.summary }</div>}
                  <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input 
                      type="text" 
                      name="username" 
                      className="form-control" 
                      onChange={ this.changeUser } 
                      value={ this.state.user.username }
                      placeholder="username" 
                    />
                    {this.state.errors.username && <small className="text-danger">{this.state.errors.username}</small>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                      type="password" 
                      name="password" 
                      className="form-control" 
                      onChange={ this.changeUser } 
                      value={ this.state.user.password }
                      placeholder="password"  
                    />
                    {this.state.errors.password && <small className="text-danger">{this.state.errors.password}</small>}
                  </div>
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-success mt-3">
                      Login
                    </button>
                  </div>                    
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Login;
=======
        })
      } else {
        const errors = xhr.response.errors ? xhr.response.errors : {}
        errors.summary = xhr.response.message
        this.setState({
          errors
        })
      }
    })
    xhr.send(formData)    
  }
  changeUser(e) {
    const field = e.target.name
    const user = this.state.user
    user[field] = e.target.value
    this.setState({
      user
    })
  }
  enableIfValid(){
    if (this.state.user.username.length > 0 && this.state.user.password.length > 0){
      return(
        <button type="submit" className="btn btn-success mt-3">
          Login
        </button>
      )
    } else {
      return(
        <button type="submit" className="btn btn-success mt-3" disabled>
          Login
        </button>
      )
    }
  }

  passwordPresent(){
    if (this.state.user.password.length > 0){
      return (true)
    } else {
      return false
    }
  }
  render() {
    if(this.state.redirect){ 
      console.log(`Redirecting to /`)
      return( <Redirect to={`/`} /> ) 
    }
    return (
      <FadeIn>
        <div className="container-fluid">
          <div className="row">
            <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
                <Card
                  rounded={'0'}
                  spacing={'mt-3'}
                  // icon={<i className='mdi mdi-account-box mr-2'/>} option for adding icons
                  title={'Login'}>
                  <form onSubmit={ this.processForm }>
                    {this.state.successMessage && <div className="alert alert-success">{ this.state.successMessage }</div>}
                    {this.state.errors.summary && <div className="alert alert-danger">{ this.state.errors.summary }</div>}
                      <TextInput
                        inputTitle={'Username'}
                        type={'text'}
                        name={'username'}
                        placeholder={'username'}
                        handleChange={this.changeUser}
                        text={this.state.user.username}
                      />
                      <TextInput
                        inputTitle={'Password'}
                        type={'password'}
                        name={'password'}
                        placeholder={'password'}
                        handleChange={this.changeUser}
                        text={this.state.user.password}
                        trueWhen={this.passwordPresent()}
                      />
                      {this.enableIfValid()}                    
                  </form>
                </Card>
            </div>
          </div>
        </div>
      </FadeIn>
    )
  }
}
export default Login
>>>>>>> 33ec7c4c5ddd8f53b73e7dc83423a0a8c2c8c1de
