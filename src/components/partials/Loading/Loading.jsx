import React, { Component } from 'react';
import Loader from '../../../images/DNA_dblHelix.svg';
import { ContainerFluid, Row } from '../../Bootstrap/layout';
import "./Loading.css"

class Loading extends Component {
  render() { 
    return ( 
      <ContainerFluid>
        <Row 
          className="loading-container justify-content-center align-items-center stretch-viewport"
        >      
          <div className="Loader">
            <img src={Loader} className="preLoader" alt="Loading" />
            <h3 className="loader-title text-light">Loading BioNet</h3>
          </div>
        </Row>
      </ContainerFluid> 
    );
  }
}
 
export default Loading;