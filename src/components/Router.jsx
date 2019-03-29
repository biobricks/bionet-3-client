import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Landing from './Landing';
import About from './About';
import Login from './Login';
import Signup from './Signup';
import PasswordReset from './PasswordReset';
import PasswordResetVerify from './PasswordResetVerify';
import LabNew from './LabNew';
import LabDelete from './LabDelete';
import Add from './Add';
import Edit from './Edit';
import Profile from './Profile';
import ContainerDelete from './ContainerDelete';

class Router extends Component {
  render() {
    return (
      <div className="Router">
        <Switch>
          <Route exact path="/labs/new" render={(props) => (<LabNew {...props} {...this.props}/>)}/>
          <Route path="/labs/:labId/add/:itemType" render={(props) => (
            <Add 
              {...props}
              {...this.props}
              refresh={this.props.getCurrentUser}
            />
          )}/> 
          <Route path="/labs/:labId/edit" render={(props) => (
            <Edit 
              {...props}
              {...this.props}
              refresh={this.getCurrentUser}
            />
          )}/> 
          <Route path='/labs/:labId/delete' render={(props) => ( 
            <LabDelete 
              {...props}
              {...this.props}
              refresh={this.props.getCurrentUser}
            />
          )}/>
          <Route path="/labs/:labId" render={(props) => (
            <Profile 
              {...props}
              {...this.props}
              refresh={this.props.getCurrentUser}
            />
          )}/> 
          <Route path="/containers/:containerId/add/:itemType" render={(props) => (
            <Add 
              {...props}
              {...this.props}
              refresh={this.props.getCurrentUser}
            />
          )}/> 
          <Route path="/containers/:containerId/edit" render={(props) => (
            <Edit 
              {...props}
              {...this.props}
              refresh={this.props.getCurrentUser}
            />
          )}/> 
          <Route path='/containers/:containerId/delete' render={(props) => (
            <ContainerDelete 
              {...props}
              {...this.props}
              refresh={this.props.getCurrentUser}            
            />
          )}/>
          <Route path="/containers/:containerId" render={(props) => (
            <Profile 
              {...props}
              {...this.props}
              refresh={this.props.getCurrentUser}
            />
          )}/> 
          <Route exact path="/password-reset/verify" render={(props) => (<PasswordResetVerify {...props} {...this.props}/>)}/>
          <Route exact path="/password-reset" render={(props) => ( <PasswordReset {...props} {...this.props}/> )}/>
          <Route exact path="/signup" render={(props) => (<Signup {...props} {...this.props}/>)}/>
          <Route exact path="/login" render={(props) => (<Login {...props} {...this.props} />)}/>
          <Route exact path="/about" render={(props) => (<About {...props} {...this.props} />)} />
          <Route exact path="/" render={(props) => (<Landing {...props} {...this.props} />)} />
        </Switch>
      </div>
    );
  }
}

export default Router;
