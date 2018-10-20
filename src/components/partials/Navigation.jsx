import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../images/bionet-logo.png';

class Navigation extends Component {
  
  render() {
    
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="BioNet Logo" width="40" height="30"/>
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse" 
          data-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            
            <li className="nav-item active">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            
            {(this.props.isLoggedIn) ? (
              <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle" 
                href="/" 
                id="navbarDropdown" 
                role="button" 
                data-toggle="dropdown" 
                aria-haspopup="true" 
                aria-expanded="false"
              >
                Dropdown
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/">Action</Link>
                <Link className="dropdown-item" to="/">Another action</Link>
                <div className="dropdown-divider"></div>
                <Link className="dropdown-item" to="/">Something else here</Link>
              </div>
            </li>
            ) : null }

            { this.props.isLoggedIn ? (
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="/"
                  onClick={ this.props.logoutCurrentUser }
                >Logout</a>
              </li>
            ) : (
              <li className="nav-item">
                <Link to="/login" className="nav-link" href="#">Login</Link>
              </li>
            )}

            { !this.props.isLoggedIn ? (
              <li className="nav-item">
                <Link to="/signup" className="nav-link" href="#">Sign Up</Link>
              </li>
            ) : null }
          </ul>
          <form className="form-inline my-2 my-lg-0">
            <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
          </form>
        </div>
      </nav>
    );

  }
}

export default Navigation;
