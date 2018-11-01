import React, { Component } from 'react';
import moment from "moment";
import axios from "axios";
import FadeIn from 'react-fade-in';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Alert from './partials/Alert/Alert';

import Auth from "../modules/Auth";
import Navigation from './partials/Navigation';
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
      viewMode: "3D",

      //set default to see in tests 
      alertType: "This is an alert type",
      alertMessage: "This is the message"
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.setReady = this.setReady.bind(this);
    this.setViewMode = this.setViewMode.bind(this);
  }

  setAlert(alertType, alertMessage) {
    switch(alertType){
      case "success":
        toast.success(alertMessage);
        break;
      case "error":
        toast.error(alertMessage);
        break;
      case "default":
        toast(alertMessage);
        break;  
      default:
        toast.info(alertMessage);
    }
  }

  setViewMode(viewMode) {
    //this.forceUpdate();
    this.setState({ viewMode });
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
          //viewMode: currentUser.settings.display.mode
          // viewMode: "VR"
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
            <ToastContainer/>
            {this.state.userValidated ? (
              <FadeIn>
                <Router 
                  {...this.state}
                  loginCurrentUser={this.loginCurrentUser}
                  logoutCurrentUser={this.logoutCurrentUser}
                  setAlert={this.setAlert}
                  setReady={this.setReady}
                  setViewMode={this.setViewMode}      
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
