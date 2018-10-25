import React, { Component } from 'react';
import Loader from '../../../images/DNA_dblHelix.svg';
import "./Loading.css"

class Loading extends Component {
  state = {  }
  render() { 
    return ( 

            <div className="Loader">
              <img src={Loader} className="preLoader" alt="nope" />
              <h3 className="loader-title">Loading BioNet Data...</h3>
            </div>
 
    );
  }
}
 
export default Loading;