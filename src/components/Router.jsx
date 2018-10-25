import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';

import Landing from './pages/Landing';

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import LabNew from "./pages/LabNew";
import LabEdit from "./pages/LabEdit";
import LabProfile from "./pages/LabProfile";
import LabList from "./pages/LabList";
import LabAdd from "./pages/LabAdd";

import ContainerEdit from "./pages/ContainerEdit";
import ContainerProfile from "./pages/ContainerProfile";
import ContainerAdd from "./pages/ContainerAdd";

import VirtualList from "./pages/VirtualList";
import PhysicalList from './pages/PhysicalList';

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
          <Route path='/labs/:labId/edit' render={(props) => (<LabEdit {...props} {...this.props}/>)} />
          <Route path='/labs/:labId/add/:itemType' render={(props) => (<LabAdd {...props} {...this.props}/>)} />
          <Route path='/labs/:labId' render={(props) => (<LabProfile {...props} {...this.props}/>)} />
          <Route exact path='/labs' render={(props) => (<LabList {...props} {...this.props}/>)} />
        </Switch>

        <Switch>
          <Route path='/containers/:containerId/edit' render={(props) => (<ContainerEdit {...props} {...this.props}/>)} />
          <Route path='/containers/:containerId/add/:itemType' render={(props) => (<ContainerAdd {...props} {...this.props}/>)} />
          <Route path='/containers/:containerId' render={(props) => (<ContainerProfile {...props} {...this.props}/>)} />
        </Switch>

        <Switch>
          <Route path='/virtuals' render={(props) => (<VirtualList {...props} {...this.props}/>)} />
        </Switch>

        <Switch>
          <Route path='/physicals' render={(props) => (<PhysicalList {...props} {...this.props}/>)} />
        </Switch>

      </main>
    );
  }
}

export default Router;