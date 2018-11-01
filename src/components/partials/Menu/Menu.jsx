import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import moment from 'moment';
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
        title = `BioNet`;
        break;
      default:
        title = "Loading";  
    }

    let item = this.props.itemIsClicked || this.props.itemIsHovered ? this.props.itemSelected : null;
    let itemAttrArray = item ? Object.keys(item) : [];
    let itemType = this.props.itemIsClicked ? this.props.itemTypeClicked : this.props.itemIsHovered ? this.props.itemTypeHovered : null;
    let itemIconClasses, itemTitle;
    switch(itemType) {
      case 'BioNet':
        itemTitle = 'BioNet API';
        itemIconClasses = 'mdi mdi-file-tree mr-2';
        break;
      case 'User':
        itemTitle = item.username;
        itemIconClasses = 'mdi mdi-account mr-2';
        break;
      case 'Lab':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-teach mr-2';
        break;  
      case 'Container':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-grid mr-2';
        break;
      case 'Physical':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-flask mr-2';
        break;
      case 'Virtual':
        itemTitle = item.name;
        itemIconClasses = 'mdi mdi-dna mr-2';
        break;  
      default: 
        itemTitle = 'Navigate';
        itemIconClasses = 'mdi mdi-map-outline mr-2';
    }

    let itemAttributes;
    if (item && item !== false && Object.keys(item).length > 0) {
      let keyValArray = [];
      for(let i = 0; i < itemAttrArray.length; i++) {
        let itemAttr = itemAttrArray[i];
        let key = itemAttr;
        let val = item[itemAttr];
        if (key !== 'email' && key !== 'name' && key !== 'datName' && key !== 'datKey' && key !== 'bgColor' && key !== '_id' && typeof val == 'string'){
          keyValArray.push({ key, val });
        }
      }
    
      itemAttributes = keyValArray.map((attr, attrIndex) => {
        if (!this.props.isLoggedIn) {
          if (attr.key === 'description') {
            return (
              <p key={shortid.generate()} className="card-text">
                <strong className="text-capitalize">{attr.key}</strong>: {attr.val}
              </p>
            );
          } else {
            return null;
          }         
        } else {
          if (attr.key === 'createdAt' || attr.key === 'updatedAt') {
            let attrDate = new Date(attr.val);
            let fromNow = moment(attrDate).fromNow();
            return (
              <p key={shortid.generate()} className="card-text">
                <strong className="text-capitalize">{attr.key}</strong>: {fromNow}
              </p>
            );
          } else {
            return (
              <p key={shortid.generate()} className="card-text">
                <strong className="text-capitalize">{attr.key}</strong>: {attr.val}
              </p>
            );
          }
        }
      });
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
        </div>
        <div className="card mt-3 rounded-0">
            <div className="card-header rounded-0 bg-info text-light">
              <h4 className="card-title mb-0 text-capitalize">
                <i className={itemIconClasses}/>{itemTitle}
              </h4>
            </div>
            {(item && item !== false && Object.keys(item).length > 0) ? (
              <div className="card-body">
                {itemAttributes}
                {(!this.props.isLoggedIn) ? (
                  <div>
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
          </div>          
      </div>
    );
  }

}

export default Menu;  