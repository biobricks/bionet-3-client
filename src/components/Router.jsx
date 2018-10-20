import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing';

import Login from "./pages/Login";
import Signup from "./pages/Signup";

class Router extends Component {
  
  render() {

    return (
      <main>

        <Switch>
          <Route exact path='/' render={(props) => (<Landing {...props}/>)} />
          <Route exact path='/login' render={(props) => (<Login {...props}/>)} />
          <Route exact path='/signup' render={(props) => (<Signup {...props}/>)} />
        </Switch>

      </main>
    );
  }
}

export default Router;