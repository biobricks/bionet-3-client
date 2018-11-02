import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';
import UserProfile from '../Profile/UserProfile/UserProfile';
import LabProfile from '../Profile/LabProfile/LabProfile';
import VirtualProfile from '../Profile/VirtualProfile/VirtualProfile';
import PhysicalProfile from '../Profile/PhysicalProfile/PhysicalProfile';
import ContainerProfile from '../Profile/ContainerProfile/ContainerProfile';

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
        title = `BioNet`;
        break;
      default:
        title = "Loading";  
    }

    let itemType = this.props.itemIsClicked ? this.props.itemTypeClicked : this.props.itemIsHovered ? this.props.itemTypeHovered : null;
    let itemComponent = null;
    switch(itemType) {
    
      case 'User':
        itemComponent = <UserProfile {...this.props} {...this.state} />;
        break;
      case 'Lab':
        itemComponent = <LabProfile {...this.props} {...this.state} />;
        break;  
      case 'Container':
        itemComponent = <ContainerProfile {...this.props} {...this.state} />;
        break;
      case 'Physical':
        itemComponent = <PhysicalProfile {...this.props} {...this.state} />;
        break;
      case 'Virtual':
        itemComponent = <VirtualProfile {...this.props} {...this.state} />;
        break;  
      default: 

    } 

    return (
      <div className="Menu">
        
        <div className="card rounded-0 mt-3">
          <div className="card-header rounded-0 bg-info text-light">
            <h4 className="card-title mb-0 text-capitalize">{title}</h4>
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
          {(!this.props.isLoggedIn) ? (
            <div className="card-body">
              <div className="mb-2"><Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link> to:</div>
              <p className="card-text">
                <i className="mdi mdi-checkbox-marked-circle text-success mr-2"/>Create &amp; Organize Your Own Lab<br/>
                <i className="mdi mdi-checkbox-marked-circle text-success mr-2"/>Join Other Labs<br/>
                <i className="mdi mdi-checkbox-marked-circle text-success mr-2"/>Grow BioNet!
              </p>
            </div>            
          ) : null }
        </div>

        {(itemComponent) ? ( <div>{itemComponent}</div>) : null }

        
        {/* <div className="card mt-3 rounded-0">
            <div className="card-header rounded-0 bg-info text-light">
              <h4 className="card-title mb-0 text-capitalize">
                <i className={itemIconClasses}/>{itemTitle}
              </h4>
            </div>
            {(item && item !== false && Object.keys(item).length > 0) ? (
              <div className="card-body">
               
                {(!this.props.isLoggedIn) ? (
                  <div className="card-body">
                    <div className="mb-2"><Link to="/login">Login</Link> or <Link to="/signup">Sign Up</Link> to:</div>
                    <p className="card-text">
                      <i className="mdi mdi-checkbox-marked-circle text-success mr-2"/>Create &amp; Organize Your Own Lab<br/>
                      <i className="mdi mdi-checkbox-marked-circle text-success mr-2"/>Join Other Labs<br/>
                      <i className="mdi mdi-checkbox-marked-circle text-success mr-2"/>Grow BioNet!
                    </p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="card-body"> 
                {(itemType === 'BioNet') ? (
                  <p className="card-text">
                    The BioNet Application Program Interface (API) receives calls from across the BioNet and responds with User, Inventory and Material Information.
                  </p>
                ) : (
                  <p className="card-text">
                    Hover or Click on any BioNode for details.
                  </p>
                )}

              </div>                
            )}  
          </div>           */}
      </div>
    );
  }

}

export default Menu;  