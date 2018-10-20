import React, { Component } from 'react';

class Landing extends Component {
  
  render() {
    
    return (
      <div className="container-fluid">
        <div className="row mt-3">
          <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
            <div className="card">
              <div className="card-header bg-info text-light">
                <h4 className="card-title mb-0">BioNet</h4>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Welcome to the BioNet! Currently In Development
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    );

  }
}

export default Landing;
