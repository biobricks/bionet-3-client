import React, { Component } from 'react';
import moment from "moment";
import axios from "axios";
import FadeIn from 'react-fade-in';
import { toast } from 'react-toastify';
import Auth from "../modules/Auth";
import Navigation from './partials/Navigation';
import Alert from './partials/Alert/Alert';
import Router from './Router';
import Footer from './partials/Footer';
import appConfig from '../configuration.js';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      ready: false,
      userValidated: false,
      redirectHome: false,
      isLoggedIn: false,
      currentUser: {},
      viewMode: "simple",
      alertType: "",
      alertMessage: ""
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.setReady = this.setReady.bind(this);
  }

  setAlert(alertType, alertMessage) {
    switch(alertType){
      case "success":
        toast.success(alertMessage);
        break;
      case "error":
        toast.error(alertMessage);
        break; 
      default:
        toast.info(alertMessage);
    }
  }

  loginCurrentUser() {
    let config = {
      headers: {
        authorization: `Bearer ${Auth.getToken()}`
      }
    };
    axios
      .get(`${appConfig.apiBaseUrl}/dashboard`, config)
      .then(res => {
        let createdDate = new Date(res.data.user.createdAt);
        let currentUser = res.data.user;
        currentUser["createdFromNow"] = moment(createdDate).fromNow();
        this.setState({
          userValidated: true,
          isLoggedIn: true,
          currentUser,
          viewMode: currentUser.settings.display.mode
        });
      });
  }

  logoutCurrentUser() {
    Auth.deauthenticateUser();
    this.setState({
      redirectHome: true,
      isLoggedIn: false,
      currentUser: {}
    });
  }

  setReady(bool) {
    this.setState({ ready: bool });
  }

  componentDidMount() {
    //Auth.deauthenticateUser();
    if (Auth.isUserAuthenticated()) {
      this.loginCurrentUser();
    } else {
      this.setState({
        userValidated: true
      });
    }
  }

  render() {
    return (
      <div className="App">
          <Navigation 
            {...this.state}
            loginCurrentUser={this.loginCurrentUser}
            logoutCurrentUser={this.logoutCurrentUser}          
          />
          <div className="viewport-container">
            <Alert />
            {this.state.userValidated ? (
              <FadeIn>
                <Router 
                  {...this.state}
                  loginCurrentUser={this.loginCurrentUser}
                  logoutCurrentUser={this.logoutCurrentUser}
                  setAlert={this.setAlert}
                  setReady={this.setReady}         
                />
              </FadeIn>
            ) : null }
          </div>
          <Footer />
      </div>
    );
  }
}

export default App;
