import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Navbar, NavbarBrand, NavbarNav, NavbarLink, NavbarDropdown, NavbarDropdownLink } from '../Bootstrap/components';
import shortid from 'shortid';
import logo from './images/bionet-logo.png';
import './Navigation.css';

class Navigation extends Component {

  render() {
    const isLoggedIn = this.props.isLoaded && this.props.isLoggedIn;
    const isNotLoggedIn = this.props.isLoaded && !this.props.isLoggedIn;
    const currentUser = this.props.currentUser;
    const labsJoined = isLoggedIn ? currentUser.labs.map((lab, index) => {
      return (
        <NavbarDropdownLink 
          key={shortid.generate()}
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </NavbarDropdownLink>
      )
    }) : [];
    return (
      <Navbar dark type="dark" className="bg-green-darkest">
        <NavbarBrand imgSrc={logo} imgAlt="BioNet Logo" width="40">
          BioNet
        </NavbarBrand>
        <NavbarNav>
            
          {(isLoggedIn) ? (
            <>
              <NavbarDropdown id="user-dropdown" label={currentUser.username}>
                <h6 className="dropdown-header">Labs</h6>
                <div className="dropdown-divider"></div>
                {labsJoined}
              </NavbarDropdown>
              <li className="nav-item">
                <a 
                  className="nav-link" 
                  href="/"
                  onClick={ this.props.logoutCurrentUser }
                >Logout</a>
              </li>
            </>
          ) : null }
          {(isNotLoggedIn) ? (
            <>
              <NavbarLink to="/login">Login</NavbarLink>
              <NavbarLink to="/signup">Sign Up</NavbarLink>
            </>
          ) : null }

        </NavbarNav>
      </Navbar>
    );

  }
}

export default withRouter(Navigation);
