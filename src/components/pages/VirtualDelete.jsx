import React, { Component } from 'react';
import Auth from "../../modules/Auth";
import { Link, Redirect } from 'react-router-dom';
import appConfig from '../../configuration.js';
import axios from 'axios';
import AlertCard from '../partials/AlertCard';
import Loading from '../partials/Loading/Loading';

class VirtualDelete extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      redirect: false,
      virtual: {}
    };
    this.getVirtual = this.getVirtual.bind(this);
    this.deleteVirtual = this.deleteVirtual.bind(this);
  }

  getVirtual() {
    axios.get(`${appConfig.apiBaseUrl}/containers/${this.props.match.params.containerId}`)
    .then(res => {   
      this.setState({
        loaded: true,
        virtual: res.data.data
      });        
    })
    .catch(error => {
      console.error(error);        
    });    
  }

  
  deleteVirtual() {
    let config = {
      'headers': {  
        'authorization': `Bearer ${Auth.getToken()}`
      },
      'json': true
    };
    let virtualId = this.props.match.params.virtualId;
    axios.post(`${appConfig.apiBaseUrl}/virtuals/${virtualId}/remove`, this.state.virtual, config)
    .then(res => {     
      //console.log(res.data.data);
      this.props.setAlert("success", `${this.state.virtual.name} was successfully deleted.`);
      this.setState({
        redirect: true
      });
    })
    .catch(error => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.getVirtual();
  }  

  render() { 
    const isLoaded = this.state.loaded;

    if (this.state.redirect){
      return (
        <Redirect to='/virtuals'/>
      );
    }

    return (
      <div className="container-fluid pb-3">
        {(isLoaded) ? (
          <div className="row">  
            { (this.props.isLoggedIn && this.props.currentUser.isAdmin) ? (
              <div className="col-12 col-lg-7">

                <div className="card rounded-0 mt-3">
                  <div className="card-header bg-dark text-light rounded-0">
                    <div className="card-title mb-0 text-center text-lg-left">
                      <span><i className="mdi mdi-xl mdi-teach" /> Delete {this.state.virtual.name}</span>
                    </div>
                  </div>
                  <div className="card-body text-center text-lg-left">
                    <p className="card-text">
                      <strong>Warning!</strong> This cannot be undone. Are you absolutely sure you want to <strong>Delete {this.state.virtual.name}</strong>?
                    </p>
                    <div className="btn-group rounded-0">
                      <Link 
                        to={`/virtuals/${this.props.match.params.virtualId}`}
                        className="btn btn-secondary rounded-0"
                      >Cancel</Link>
                      <button 
                        className="btn btn-danger rounded-0"
                        onClick={this.deleteVirtual}
                      >Delete {this.state.virtual.name}!</button>
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="col-12 col-lg-7 text-center">
                <AlertCard 
                  title="Lab Membership Required"
                  message="You must be logged in and a BioNet Administrator to view this content."
                />
              </div>
            ) }  
            
          </div>
        ) : (
          <div 
            className="row justify-content-center align-items-center"
            style={{'minHeight': '100vh'}}
          >
            <Loading />
          </div>  
        )}
      </div>
    );
  }
}

export default VirtualDelete;