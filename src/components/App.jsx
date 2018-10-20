import React, { Component } from 'react';
import Navigation from './partials/Navigation';
import Router from './Router';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Navigation />
        <Router />
      </div>
    );
  }
}

export default App;
