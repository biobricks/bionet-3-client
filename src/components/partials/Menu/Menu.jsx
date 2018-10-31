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
    this.changeViewMode = this.changeViewMode.bind(this);
  }

  componentDidMount() {
    this.setState({mode: this.state.modes[0]});
  }

  changeViewMode(e) {
    let viewMode = e.target.getAttribute('viewmode');
    this.props.setViewMode(viewMode);
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
            <h4 className="card-title mb-0 text-capitalize">{title}</h4>
          </div>
          <div className="card-body">
            <p className="card-text">There are currently {this.props.users.length} Users and {this.props.labs.length} Labs.</p>
          </div>
          <ul className="list-group list-group-flush">
            {(this.props.viewMode === 'simple') ? (
              <button 
                className="btn list-group-item list-group-item-action bg-success text-light rounded-0"
                viewmode="3D"
                onClick={this.changeViewMode}
              >
                <i className="mdi mdi-video-3d mr-2"/> View 3D
              </button> 
            ) : null } 
            {(this.props.viewMode === '3D') ? (
              <button 
                className="btn list-group-item list-group-item-action bg-success text-light rounded-0"
                viewmode="simple"
                onClick={this.changeViewMode}
              >
                <i className="mdi mdi-numeric-2-box mr-2"/> View 2D
              </button> 
            ) : null }  
          </ul>
        </div>
      </div>
    );
  }

}

export default Menu;  