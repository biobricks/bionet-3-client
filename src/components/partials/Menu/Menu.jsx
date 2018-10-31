import React, { Component } from 'react';
import './Menu.css';

class Menu extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      mode: "",
      modes: ['welcome'],
      stage: 0
    };
  }

  componentDidMount() {
    this.setState({mode: this.state.modes[0]});
  }

  render() {

    //const users = this.props.users;
    //const labs = this.props.labs;

    let title = null;
    switch (this.state.mode) {
      case "welcome":
        title = `Welcome To BioNet${this.props.isLoggedIn ? (' ' + this.props.currentUser.username) : ""}`;
        break;
      default:
        title = "Loading";  
    }

    return (
      <div className="Menu">
        <div className="card rounded-0 mt-3">
          <div className="card-header rounded-0 bg-info text-light">
            <h4 className="card-title mb-0">{title}</h4>
          </div>
          <div className="card-body">
            <p className="card-text">There are currently {this.props.users.length} Users and {this.props.labs.length} Labs.</p>
          </div>
        </div>
      </div>
    );
  }

}

export default Menu;  