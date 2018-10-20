import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing';

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import LabNew from "./pages/LabNew";

class Router extends Component {
  
  render() {

    return (
      <main>

        <Switch>
          <Route exact path='/' render={(props) => (<Landing {...props} {...this.props}/>)} />
          <Route exact path='/login' render={(props) => (<Login {...props} {...this.props}/>)} />
          <Route exact path='/signup' render={(props) => (<Signup {...props} {...this.props}/>)} />
        </Switch>

        <Switch>
          <Route exact path='/labs/new' render={(props) => (<LabNew {...props} {...this.props}/>)} />
        </Switch>

      </main>
    );
  }
}

export default Router;