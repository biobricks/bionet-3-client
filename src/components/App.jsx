import React, { Component } from 'react';
import Navigation from './partials/Navigation';
import Router from './Router';
import Footer from './partials/Footer';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="viewport-container">
          <Navigation />
          <Router />
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
