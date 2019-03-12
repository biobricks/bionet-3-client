import React from 'react';
import './Download.scss';
import Config from '../configuration.js';
import Api from '../modules/Api';

class Download extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      labs: []
    };
    this.getData = this.getData.bind(this);
    this.getDataSync = this.getDataSync.bind(this);
  }

  async getData() {
    try {
      const labsRes = await Api.get('/labs');
      return {
        labs: labsRes.data || []
      };
    } catch (error) {
      throw error;
    }
  }

  getDataSync() {
    this.getData()
    .then(res => {
      this.setState(res);
    })
    .catch(error => {
      throw error;
    }); 
  }

  componentDidMount() {
    this.getDataSync();
  }

  render() {
    const labListItems = this.state.labs.map((lab, index) => {
      return (
        <li className="list-group-item list-group-item-action">
          <div className="row">
            <div className="col"><h4>{lab.name}</h4></div>
            <div className="col">
              <div className="btn-group" style={{'width': '100%'}}>
                <a 
                  href={`${Config.apiBaseUrl}/download/labs/${lab._id}/json`}
                  className="btn btn-primary" 
                  style={{'width': '50%'}}
                  format="json"
                >
                  JSON
                </a>
                <a 
                  href={`${Config.apiBaseUrl}/download/labs/${lab._id}/excel`}
                  className="btn btn-secondary" 
                  style={{'width': '50%'}}
                  format="excel"
                >
                  Excel
                </a>
              </div>            
            </div>
          </div>  
        </li>
      );
    });
    return (
      <div className="Download container-fluid">
        
        <div className="row">
          <div className="col-12 col-lg-7">


            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark-green text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className="mdi mdi-file-download mr-2"/ >Download
                  </h4>
                </div>
              </div>
              {(this.props.isLoggedIn) ? (
                <div className="card-body">
                  Select your data and format for download.
                </div>  
              ) : (
                <div className="card-body">
                  You must be logged in to download.
                </div>                
              )}   
            </div>

            <div className="card rounded-0 mt-3">
              <div className="card-header rounded-0 bg-dark-green text-light">
                <div className="card-title mb-0 text-capitalize">
                  <h4 className="card-title mb-0 text-capitalize">
                    <i className="mdi mdi-teach mr-2"/ >Labs
                  </h4>
                </div>
              </div>
              {(this.props.isLoggedIn) ? (
                <>
                  {labListItems.length > 0 && (
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item list-group-item-action">
                        <div className="row">
                          <div className="col"><h4>All Labs</h4></div>
                          <div className="col">
                            <div className="btn-group" style={{'width': '100%'}}>
                              <a 
                                href={`${Config.apiBaseUrl}/download/labs/json`}
                                className="btn btn-primary" 
                                style={{'width': '50%'}}
                                format="json"
                              >
                                JSON
                              </a>
                              <a 
                                href={`${Config.apiBaseUrl}/download/labs/excel`}
                                className="btn btn-secondary" 
                                style={{'width': '50%'}}
                                format="excel"
                              >
                                Excel
                              </a>
                            </div>            
                          </div>
                        </div>  
                      </li>
                      {labListItems}
                    </ul>
                  )}
                </>
              ) : (
                <div className="card-body">
                  You must be logged in to download.
                </div>                
              )}   
            </div>

          </div>

          {(this.props.isLoggedIn) ? (
            <div className="col-12 col-lg-5">
              
            </div>
          ) : null }
        </div>
      </div>
    );
  }
}

export default Download;
