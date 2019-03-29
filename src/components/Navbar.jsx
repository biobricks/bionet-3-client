import React, { Component } from 'react';
import shortid from 'shortid';
import './Navbar.scss';
import { Link, NavLink, withRouter } from "react-router-dom";
import Logo from '../images/bionet-logo.png';

class Navbar extends Component {
  render() {
    const pathName = this.props.location.pathname;
    const isLoggedIn = this.props.isLoggedIn;
    const labsJoined = isLoggedIn ? this.props.currentUserLabs.map((lab, index) => {
      return (
        <NavLink 
          key={shortid.generate()}
          className="dropdown-item"
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </NavLink>
      )
    }) : [];
    return (
      <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
        <Link className="navbar-brand" to="/">
          <img src={Logo} width="40" height="30" className="d-inline-block align-top mr-3" alt="Bionet Logo" />
          Bionet {!this.props.isReady && 'Loading...'}
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-toggle="collapse"
          data-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle Navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto mr-4">
            <li className={pathName === '/' ? "nav-item active" : "nav-item"}>
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="/"
                    id="user-dropdown"
                    role="button"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >{this.props.currentUser.username}</a>
                  <div 
                    className="dropdown-menu"
                    aria-labelledby="user-dropdown"
                  >
                    {labsJoined}
                  </div>
                </li> 
                <li className="nav-item">
                  <a 
                    className="nav-link" 
                    href="/"
                    onClick={ this.props.logoutCurrentUser }
                  >Logout</a>
                </li>               
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link to="/login" className="nav-link">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/signup" className="nav-link">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(Navbar);
