import React from 'react';
import shortid from 'shortid';
import { Link } from 'react-router-dom';

class LabsPending extends React.Component {
  render() {
    const isLoggedIn = this.props.isLoggedIn;
    const currentUserLabRequests = this.props.currentUserLabRequests;
    const labsRequested = isLoggedIn ? currentUserLabRequests.map((lab, index) => {
      return (
        <Link 
          key={shortid.generate()}
          className="list-group-item list-group-item-action rounded-0 bg-info text-light"
          to={`/labs/${lab._id}`}
        >
          <i className="mdi mdi-teach mr-2"/>{lab.name}
        </Link>
      )
    }) : []; 
    return (
      <>
        <div className="card-header bg-dark text-light">
          <h5 className="card-title mb-0">
            Pending Lab {currentUserLabRequests.length === 1 ? "Request" : "Requests"} ({currentUserLabRequests.length})
          </h5>
        </div>
        {currentUserLabRequests.length > 0 ? (                 
          <ul className="list-group list-group-flush">
            {labsRequested}
            <Link
              to="/labs/new"
              className="list-group-item list-group-item-action rounded-0 bg-success text-light"
            >
              <i className="mdi mdi-plus mr-2"/>Create New Lab
            </Link>
          </ul>
        ) : (
          <div className="card-body">
            <p className="card-text">
              You currently have no pending lab membership requests. Try requesting membership from one of the labs listed below.
            </p>
          </div>
        )} 
      </>
    );
  }
}

export default LabsPending;