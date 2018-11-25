import React, { Component, Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";
import Crypto from 'crypto-js';
import './App.css';

import Navigation from './Navigation/Navigation';
//import Landing from './components/Landing';
import Loading from './partials/Loading/Loading';
import Signup from './Signup';
import Login from './Login';
import Footer from './Footer/Footer';

import { RouteBoundary } from './Helpers';

import { loginCurrentUser, fetchAll, sortUserLabs } from '../modules/Api';

const Landing = lazy(() => import('./Landing'));

function RouteWrapper(props) {
  return (
    <RouteBoundary>
      <Suspense fallback={<div><Loading /></div>}>
        {props.children}
      </Suspense>
    </RouteBoundary>
  );
}

class App extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      isLoaded: false,
      isLoggedIn: false,
      currentUser: {},
      labs: [],
      virtuals: [],
      physicals: []
    };
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.getCurrentUserLabs = this.getCurrentUserLabs.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
  }
  
  async getCurrentUserLabs(currentUser) {
    let res, data, labs, virtuals, physicals; // eslint-disable-line 
    res = await fetchAll('labs');
    console.log('res1', res);
    labs = res.data;
    res = await fetchAll('virtuals');
    virtuals = res.data;
    res = await fetchAll('physicals');
    physicals = res.data;
    currentUser = sortUserLabs(currentUser, labs);
    this.setState({
      isLoaded: true,
      isLoggedIn: true,
      currentUser,
      labs,
      virtuals,
      physicals
    });
  }

  async setCurrentUser() {
    //Auth.deauthenticateUser();
    let res, data, user, currentUser, virtuals, physicals, labs; // eslint-disable-line
    if (localStorage.getItem('token') !== null) {
      res = await loginCurrentUser();
      currentUser = res.user;
      currentUser['gravatarUrl'] = `https://www.gravatar.com/avatar/${Crypto.MD5(currentUser.email).toString()}?s=100`;
      await this.getCurrentUserLabs(currentUser);
    } else {
      res = await fetchAll('labs');
      labs = res.data;
      res = await fetchAll('virtuals');
      virtuals = res.data;
      res = await fetchAll('physicals');
      physicals = res.data;
      this.setState({ virtuals, physicals, labs, isLoaded: true });  
    }  
  }

  logoutCurrentUser() {
    localStorage.removeItem('token');
    this.setState({
      redirectHome: true,
      isLoggedIn: false,
      currentUser: {}
    });
  }

  componentDidMount() {
    this.setCurrentUser()
    .then(() => {
      // nothing
    });
  }

  render() {
    return (
      <div className="App">
        <Navigation {...this.state} logoutCurrentUser={this.logoutCurrentUser}/>
        <main className="viewport-container">
          <Switch>
            <Route path="/signup" exact render={(props) => (<Signup {...props} {...this.state}/>)}/>
            <Route path="/login" exact render={(props) => (<Login {...props} {...this.state} setCurrentUser={this.setCurrentUser}/>)}/>
            <Route path="/" exact render={(props) => ( <RouteWrapper><Landing {...props} {...this.state} labs={this.state.labs}/></RouteWrapper> )}/>
          </Switch>        
        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
