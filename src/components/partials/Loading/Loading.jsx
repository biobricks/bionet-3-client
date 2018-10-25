import React, { Component } from 'react';
import Loader from '../../../images/DNA_dblHelix.svg';
import "./Loading.css"

class Loading extends Component {
  state = {  }
  render() { 
    return ( 
      <div className="card rounded-0 mt-3">
        <div className="card-header bg-dark text-light rounded-0">
          <div className="card-title mb-0">
            <span> 
              <img src={Loader} className="preLoader" alt="nope" />
              BioNet Loading Data...
            </span>
          </div>
        </div>
      </div>    
    );
  }
}
 
export default Loading;