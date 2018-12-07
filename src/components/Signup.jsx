import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import appConfig from '../configuration.js';
import FadeIn from 'react-fade-in/lib/FadeIn';
import {TextInput, Card} from 'biokit' 

class Signup extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      user: {
        username: "",
        password: "",
        passwordConfirm: "",
        email: "",
        name: ""
      },
      errors: {},
    };
    this.changeUser = this.changeUser.bind(this);
    this.processForm = this.processForm.bind(this);
  }

  changeUser(e) {
    const field = e.target.getAttribute('name');
    let user = this.state.user;
    user[field] = e.target.value;
    this.setState({
      user
    });    
  }

  processForm(e) {
    e.preventDefault();
    const username = encodeURIComponent(this.state.user.username);
    const name = encodeURIComponent(this.state.user.name);
    const email = encodeURIComponent(this.state.user.email);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `username=${username}&password=${password}&name=${name}&email=${email}`;
    const xhr = new XMLHttpRequest();
    xhr.open('post', `${appConfig.apiBaseUrl}/signup`);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      console.log(xhr.status)
      if(xhr.status === 200){
        localStorage.setItem('successMessage', xhr.response.message);
        this.setState({
          errors: {},
          redirect: true
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
  
  pwMatch = () => {
    if (this.state.user.password === this.state.user.passwordConfirm){
      return true
    } else {
      return false
    }
  }

  validPw = (pw) => {
    var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])\w{6,}$/;
    return re.test(pw)
  }

  render() {
    if(this.state.redirect){ return( <Redirect to="/login" /> ) }
    return (
      <FadeIn>
        <div className="container-fluid">
          <div className="row">
            <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            <Card
              rounded={'0'}
              spacing={'mt-0'}
              // icon={<i className='mdi mdi-account-box mr-2'/>} option for icon
              title={'Sign Up'}>
                <p className="card-text">
                  Please fill out the fields below to register for a new account.
                </p>
                <form onSubmit={ this.processForm }>
                  <TextInput
                    inputTitle={'Name'}
                    type={'text'}
                    name={'name'}
                    placeholder={'Your Full Name'}
                    handleChange={this.changeUser}
                    text={this.state.user.name}
                  />
                  <TextInput
                    inputTitle={'Email'}
                    type={'email'}
                    name={'email'}
                    placeholder={'email@example.com'}
                    handleChange={this.changeUser}
                    text={this.state.user.email}
                  />
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
                    placeholder={'Please repeat password'}
                    handleChange={this.changeUser}
                    text={this.state.user.password}
                    trueWhen={this.validPw(this.state.user.password)}
                    falseMessage={'capitol, lowercase, number, 6 charecture min'}
                  />
                  <TextInput
                    inputTitle={'Password'}
                    type={'password'}
                    name={'passwordConfirm'}
                    placeholder={'Please repeat password'}
                    handleChange={this.changeUser}
                    text={this.state.user.passwordConfirm}
                    trueWhen={this.pwMatch()}
                    falseMessage={'password does not match first'}
                  />
                </form>
                {(
                  this.state.user.name.length > 0 && 
                  this.state.user.email.length > 0 && 
                  this.state.user.username.length > 0 && 
                  this.state.user.password.length > 0 &&
                  this.state.user.passwordConfirm.length > 0 &&
                  this.state.user.password === this.state.user.passwordConfirm
                ) ? (
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-success mt-3">Submit</button>
                  </div>
                ) : 
                  <div className="form-group text-center">
                    <button type="submit" className="btn btn-success mt-3" disabled>Submit</button>
                  </div>
                } 
              </Card>
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }
}

export default Signup;