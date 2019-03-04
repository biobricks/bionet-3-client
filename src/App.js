import React, { Suspense, lazy } from 'react';
import { Route, Switch } from "react-router-dom";
import ErrorBoundary from './components/ErrorBoundary';
import './App.css';
import Loading from './components/Loading/Loading';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer/Footer';
import Login from './components/Login';
import Signup from './components/Signup';
import LabProfile from './components/Lab/LabProfile';
import ContainerProfile from './components/Container/ContainerProfile';
import Api from './modules/Api';
import PasswordReset from './components/PasswordReset';
import PasswordResetVerify from './components/PasswordResetVerify';
import About from './components/About';

const Landing = lazy(() => import('./components/Landing'));

// const LabProfile = lazy(() => import('./components/Lab/LabProfile'));
const LabNew = lazy(() => import('./components/Lab/LabNew'));
const LabAdd = lazy(() => import('./components/Lab/LabAdd'));
const LabEdit = lazy(() => import('./components/Lab/LabEdit'));
const LabDelete = lazy(() => import('./components/Lab/LabDelete'));

// const ContainerProfile = lazy(() => import('./components/Container/ContainerProfile'));
const ContainerAdd = lazy(() => import('./components/Container/ContainerAdd'));
const ContainerEdit = lazy(() => import('./components/Container/ContainerEdit'));
const ContainerDelete = lazy(() => import('./components/Container/ContainerDelete'));

function WaitForComponent(Component, state, refreshMethod) {
  return props => (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>
        <Component {...state} {...props} refresh={refreshMethod}/>
      </Suspense>
    </ErrorBoundary>
  );
}

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      debugging: true,
      isLoggedIn: false,
      currentUser: {},
      labs: [],
      virtuals: [],
      physicals: []
    };
    this.logoutCurrentUser = this.logoutCurrentUser.bind(this);
    this.setCurrentUser = this.setCurrentUser.bind(this);
    this.getCurrentUserLabs = this.getCurrentUserLabs.bind(this);
    Api.setCurrentUser = Api.setCurrentUser.bind(this);
  }

  getCurrentUserLabs(currentUser) {
    Api.getCurrentUserLabs(currentUser)
    .then((res) => {
      console.log('getCurrentUserLabs.res', res);
      this.setState(res);
    });
  }

  setCurrentUser() {
    Api.setCurrentUser()
    .then((res) => {
      if (res.user) {
        let currentUser = res.user;
        this.getCurrentUserLabs(currentUser);
      } else {
        if (res.virtuals && res.physicals) {
          this.setState(res);
        }
      }
    })
    .catch((error) => {
      throw error;
    });
  }

  logoutCurrentUser() {
    Api.logoutCurrentUser();
    this.setState({
      redirectHome: true,
      isLoggedIn: false,
      currentUser: {}
    });
  }

  componentDidMount() {
    this.setCurrentUser();
  }

  render() {
    return (
      <div className="App">
        <Navigation {...this.state} logoutCurrentUser={this.logoutCurrentUser}/>
        <main className="viewport-container">

          <Switch>
            <Route path="/labs/new" exact component={WaitForComponent(LabNew, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/add/:itemType' component={WaitForComponent(LabAdd, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/edit' component={WaitForComponent(LabEdit, this.state, this.getCurrentUserLabs)}/>
            <Route path='/labs/:labId/delete' component={WaitForComponent(LabDelete, this.state, this.getCurrentUserLabs)}/>
            {/* <Route path="/labs/:labId" component={WaitForComponent(LabProfile, this.state, this.getCurrentUserLabs)}/> */}
            <Route path="/labs/:labId" render={(props) => (
              <LabProfile 
                {...props}
                {...this.state}
                {...this.props}
                refresh={this.setCurrentUser}
              />
            )}/>
          </Switch>  

          <Switch>
            <Route path='/containers/:containerId/add/:itemType' component={WaitForComponent(ContainerAdd, this.state, this.getCurrentUserLabs)}/>
            <Route path="/containers/:containerId/edit" exact component={WaitForComponent(ContainerEdit, this.state, this.getCurrentUserLabs)}/>
            <Route path='/containers/:containerId/delete' component={WaitForComponent(ContainerDelete, this.state, this.getCurrentUserLabs)}/>
            {/* <Route path="/containers/:containerId" exact component={WaitForComponent(ContainerProfile, this.state, this.getCurrentUserLabs)}/> */}
            <Route path="/containers/:containerId" render={(props) => (
              <ContainerProfile 
                {...props}
                {...this.state}
                {...this.props}
                refresh={this.setCurrentUser}
              />
            )}/>            
          </Switch>  

          <Switch>
            <Route path="/password-reset/verify" exact render={(props) => (<PasswordResetVerify {...props} {...this.state}/>)}/>
            <Route path="/password-reset" render={(props) => ( <PasswordReset {...props} {...this.state}/> )}/>
            <Route path="/about" exact render={(props) => (<About {...props} {...this.state}/>)}/>
            <Route path="/signup" exact render={(props) => (<Signup {...props} {...this.state}/>)}/>
            <Route path="/login" exact render={(props) => (<Login {...props} {...this.state} setCurrentUser={this.setCurrentUser}/>)}/>
            <Route path="/" exact component={WaitForComponent(Landing, this.state)}/>
          </Switch>

        </main>
        <Footer />
      </div>
    );
  }
}

export default App;
