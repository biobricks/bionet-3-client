import React, { Component } from 'react';
import Api from './modules/Api';
import './App.scss';
import Loading from './components/Loading';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Router from './components/Router';

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      isLoggedIn: false,
      currentUser: {},
      currentUserLabs: [],
      currentUserLabRequests: [],
      currentUserLabsToJoin: [],
      labs: [],
      containers: [],
      virtuals: [],
      physicals: []
    };
    this.getDataSync = this.getDataSync.bind(this);
    this.getCurrentUser = this.getCurrentUser.bind(this);
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
  }
  
  async getData() {
    try {
      const getLabsRes = await Api.get('labs');
      const labs = getLabsRes.data || [];
      const getContainersRes = await Api.get('containers');
      const containers = getContainersRes.data || [];
      const getVirtualsRes = await Api.get('virtuals');
      const virtuals = getVirtualsRes.data || [];
      const getPhysicalsRes = await Api.get('physicals');
      const physicals = getPhysicalsRes.data || [];
      return {
        labs,
        containers,
        virtuals,
        physicals
      }
    } catch (error) {
      throw error;
    }
  }

  getDataSync() {
    this.getData()
    .then((res) => {
      this.getCurrentUser();
      this.setState(res);
    })
    .catch((error) => {
      throw error;
    });
  }

  getCurrentUser() {
    if (Api.isUserAuthenticated() === true) {
      Api.getCurrentUser()
      .then((res) => {
        if (res.currentUser) {
          this.setState({
            isReady: true,
            isLoggedIn: true,
            currentUser: res.currentUser,
            currentUserLabs: res.currentUserLabs,
            currentUserLabRequests: res.currentUserLabRequests,
            currentUserLabsToJoin: res.currentUserLabsToJoin
          });
        } else {
          this.setState({
            isReady: true,
            isLoggedIn: false,
            currentUser: {},
            currentUserLabs: [],
            currentUserLabRequests: [],
            currentUserLabsToJoin: []
          });        
        }
      })
      .catch((error) => {
        throw error;
      });
    } else {
      this.setState({
        isReady: true,
        isLoggedIn: false,
        currentUser: {},
        currentUserLabs: [],
        currentUserLabRequests: [],
        currentUserLabsToJoin: []
      });       
    }
  }

  logoutCurrentUser() {
    Api.logoutCurrentUser();
    this.setState({
      isLoggedIn: false,
      currentUser: {},
      currentUserLabs: [],
      currentUserLabRequests: [],
      currentUserLabsToJoin: []
    });
  }

  componentDidMount() {
    this.getDataSync();
  }

  render() {
    return (
      <div className="App">
        <Navbar 
          {...this.props} 
          {...this.state}
          logoutCurrentUser={this.logoutCurrentUser} 
        />
        <div className="page-container">
          { this.state.isReady ? <Router {...this.props} {...this.state} getCurrentUser={this.getCurrentUser}/> : <Loading /> }
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
