import React, { Component } from 'react';
import moment from "moment";
import axios from "axios";
import FadeIn from 'react-fade-in';

import { toast, ToastContainer, Flip } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// import Alert from './partials/Alert/Alert';

import Auth from "../modules/Auth";
import Navigation from './partials/Navigation';
import Router from './Router';
import Footer from './partials/Footer';
import appConfig from '../configuration.js';
import './App.css';

import { css } from 'glamor';

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
    };
    this.loginCurrentUser = this.loginCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setAlert = this.setAlert.bind(this);
    this.setReady = this.setReady.bind(this);
    this.setViewMode = this.setViewMode.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  setAlert(alertType, alertMessage) {
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
            color: '#5cb85c',
            borderStyle: 'solid',
            borderWidth: '2px',
            borderColor: '#5cb85c',
            backgroundColor: 'black',
            borderRadius: '5px',
            padding: '1.25rem',
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

  setViewMode(viewMode) {
    //this.forceUpdate();
    this.setState({ viewMode });
  }

  refresh() {
    this.loginCurrentUser();
    this.forceUpdate();
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
        axios
          .get(`${appConfig.apiBaseUrl}/labs`, config)
          .then(res => {
            let userLabs = [];
            let labCoMembers = [];
            let labs = res.data.data;
            for(let i = 0; i < labs.length; i++){
              let lab = labs[i];
              for(let j = 0; j < lab.users.length; j++){
                let labUser = lab.users[j];
                if (labUser._id === currentUser._id){
                  userLabs.push(lab);
                }
                for(let k = 0; k < labCoMembers.length; k++){
                  let labCoMember = labCoMembers[k];
                  if( labCoMembers.indexOf(labCoMember) === -1 ){
                    labCoMembers.push(labCoMember);
                  }
                }
              }
            }
            currentUser['labs'] = userLabs;
            currentUser['labCoMembers'] = labCoMembers;
            this.setState({
              userValidated: true,
              isLoggedIn: true,
              currentUser,
              //viewMode: currentUser.settings.display.mode
              // viewMode: "VR"
            });
        });    
      })
      .catch((error) => {
        console.log('Error', error);
        axios
          .get(`${appConfig.apiBaseUrl}/labs`, config)
          .then(res => {
            this.setState({
              userValidated: true,
              isLoggedIn: false,
              currentUser: {}
              //viewMode: currentUser.settings.display.mode
              // viewMode: "VR"
            });
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
            <ToastContainer
              transition={Flip}
              pauseOnFocusLoss={true}
              draggable={true}
              autoClose={3000}
            />
            {this.state.userValidated ? (
              <FadeIn>
                <Router 
                  {...this.state}
                  loginCurrentUser={this.loginCurrentUser}
                  logoutCurrentUser={this.logoutCurrentUser}
                  setAlert={this.setAlert}
                  setReady={this.setReady}
                  setViewMode={this.setViewMode}
                  refresh={this.refresh}
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
