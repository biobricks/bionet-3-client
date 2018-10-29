import React, { Component } from 'react';
import Auth from "../modules/Auth";
import Navigation from './partials/Navigation';
import Router from './Router';
import Footer from './partials/Footer';

import moment from "moment";
import axios from "axios";

import appConfig from '../configuration.js';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectHome: false,
      isLoggedIn: false,
      currentUser: {},
      alertType: "",
      alertMessage: ""
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setAlert = this.setAlert.bind(this);
  }

  setAlert(alertType, alertMessage) {
    toast.info(alertMessage);
  }

  loginCurrentUser() {
    let config = {
      headers: {
        authorization: `Bearer ${Auth.getToken()}`
      }
    };
    //console.log(config);
    axios
      .get(`${appConfig.apiBaseUrl}/dashboard`, config)
      .then(res => {
        let createdDate = new Date(res.data.user.createdAt);
        res.data.user["createdFromNow"] = moment(createdDate).fromNow();
        this.setState({
          isLoggedIn: true,
          currentUser: res.data.user
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

  componentDidMount() {
    //Auth.deauthenticateUser();
    if (Auth.isUserAuthenticated()) {
      this.loginCurrentUser();
    }
  }

  render() {
    return (
      <div className="App">
        <ToastContainer 
          autoClose={3000} 
          pauseOnFocusLoss={true}
          draggable={true}
        />
          <div className="viewport-container">
            <Navigation 
              {...this.state}
              loginCurrentUser={this.loginCurrentUser}
              logoutCurrentUser={this.logoutCurrentUser}          
            />
            <Router 
              {...this.state}
              loginCurrentUser={this.loginCurrentUser}
              logoutCurrentUser={this.logoutCurrentUser}
              setAlert={this.setAlert}         
            />
          </div>
          <Footer />
      </div>
    );
  }
}

export default App;
