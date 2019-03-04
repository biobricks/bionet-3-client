import React, { Component } from 'react';

class About extends Component {
  render() {
    return (
      <div className="About">
        <div className="container-fluid">
          <div className="row">
            <div className="col col-md-7 col-lg-5 ml-md-auto mr-md-auto text-center">
              <div className="card rounded-0 mt-3">
                <div className="card-header bg-dark-green text-light rounded-0">
                  <h4 className="card-title mb-0">Bionet</h4>
                </div>
                <div className="card-body">
                  <h4>Open Source Biological Inventory Management</h4>
                  <p className="card-text">
                    Welcome to BioNet. Keep track of your stuff, find what you need, and share as you like. The BioNet supports searching for biological material across multiple labs — all your inventory information is controlled locally by you. You decide if others can see what you wish to share. All BioNet software and associated materials are open source and free to use.
                  </p>
                </div>
              </div>
            </div>  
          </div>
        </div>
      </div>
    );
  }
}

export default About;
