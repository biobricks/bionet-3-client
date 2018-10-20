import React, { Component } from 'react';
import Auth from "../modules/Auth";
import Navigation from './partials/Navigation';
import Router from './Router';
import Footer from './partials/Footer';

import moment from "moment";
import axios from "axios";

import './App.css';


class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      redirectHome: false,
      isLoggedIn: false,
      currentUser: {}
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
  }

  loginCurrentUser() {
    let config = {
      headers: {
        authorization: `Bearer ${Auth.getToken()}`
      }
    };
    //console.log(config);
    axios
      .get("https://api.biohacking.services/api/dashboard", config)
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
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
