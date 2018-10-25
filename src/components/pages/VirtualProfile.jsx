import React, { Component } from 'react';
// import Auth from "../../modules/Auth";
// import { Link, Redirect } from 'react-router-dom';
import axios from 'axios';
import appConfig from '../../configuration.js';
import Loading from '../partials/Loading/Loading';

class VirtualProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      virtual: {
        creator: "",
        name: "",
        description: "",
        provenance: "",
        genotype: "",
        sequence: "",
        category: "sample"
      }
    };
    this.getVirtual = this.getVirtual.bind(this);
  }

  getVirtual() {
    axios.get(`${appConfig.apiBaseUrl}/virtuals/${this.props.match.params.virtualId}`)
    .then(res => {
      console.log("response", res.data);
      this.setState({
        loaded: true,
        virtual: res.data.data
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
    const virtual = this.state.virtual || {};
    const isLoaded = this.state.loaded;
    return ( 
      <div className="container-fluid pb-3">
        {(isLoaded) ? (
          <div className="row">
            <div className="col-12 col-lg-7"> 
              <div className="card rounded-0 mt-3">
                <div className="card-header bg-dark text-light rounded-0">
                  <h4 className="card-title mb-0">
                    <i className="mdi mdi-dna mr-2" />{virtual.name}
                  </h4>
                </div>
                <div className="card-body">

                  {(virtual.description.length > 0) ? (
                    <p className="card-text">
                      <span className="mr-2">Description :</span> {virtual.description}
                    </p>
                  ) : null }

                  {(virtual.provenance.length > 0) ? (
                    <p className="card-text">
                      <span className="mr-2">Provenance :</span> {virtual.provenance}
                    </p>
                  ) : null }

                  {(virtual.genotype.length > 0) ? (
                    <p className="card-text">
                      <span className="mr-2">Genotype :</span> {virtual.genotype}
                    </p>
                  ) : null }

                  {(virtual.sequence.length > 0) ? (
                    <p className="card-text">
                      <span className="mr-2">Sequence :</span> 
                      <span className="text-uppercase">{virtual.sequence}</span>
                    </p>
                  ) : null }

                  {(virtual.category.length > 0) ? (
                    <p className="card-text">
                      <span className="mr-2">Category :</span> 
                      <span className="text-capitalize">{virtual.category}</span>
                    </p>
                  ) : null }

                  <p className="card-text">
                    <span className="mr-2">Is Available :</span> {(virtual.isAvailable ? "Yes" : "No")}
                  </p>  
                  <p className="card-text">
                    <span className="mr-2">Submitted To FreeGenes? :</span> {(virtual.fgSubmitted ? "Yes" : "No")}
                  </p>  
                  {(virtual.fgStage > 0) ? (
                    <p className="card-text">
                      <span className="mr-2">FreeGenes Stage:</span> {virtual.fgStage}
                    </p>
                  ) : null }
              

                </div>

              </div>
            </div>               
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
 
export default VirtualProfile;