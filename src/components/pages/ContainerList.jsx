import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import appConfig from "../../configuration.js";
import shortid from "shortid";
import Loading from "../partials/Loading/Loading";

class ContainerList extends Component {
  constructor() {
    super();
    this.state = {
      loaded: false,
      containers: []
    };
  }

  componentDidMount() {
    axios
      .get(`${appConfig.apiBaseUrl}/containers`)
      .then(res => {
        this.setState({
          loaded: true,
          containers: res.data.data
        });
      })
      .catch(e => console.log(e));
  }

  render() {
    const isLoaded = this.state.loaded;
    const containers = this.state.containers || [];
    const containerLinks = containers.map((container, index) => {
      return (
        <Link
          key={shortid.generate()}
          className="list-group-item list-group-item-action bg-info text-light rounded-0"
          to={`/containers/${container._id}`}
        >
          {container.name}
        </Link>
      );
    });
    return (
      <div className="container-fluid pb-3">
        {isLoaded ? (
          <div className="row">
            <div className="col-12 col-lg-7">
              <div className="card rounded-0 mt-3">
                <div className="card-header bg-dark text-light rounded-0">
                  <h4 className="card-title mb-0">
                    <i className="mdi mdi-grid mr-2" />
                    Container List
                  </h4>
                </div>
                <div className="card-body">
                  {containerLinks.length > 0 ? (
                    <p className="card-text">
                      Select from the Containers listed below.
                    </p>
                  ) : (
                    <p className="card-text">
                      There are currently no Containers listed.
                    </p>
                  )}
                </div>
                <ul className="list-group list-group-flush">
                  {containerLinks}
                  <Link
                    className="list-group-item list-group-item-action bg-success text-light rounded-0"
                    to={`/containers/new`}
                  >
                    <i className="mdi mdi-plus mr-2" /> Add Container
                  </Link>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div
            className="row justify-content-center align-items-center"
            style={{ minHeight: "100vh" }}
          >
            <Loading />
          </div>
        )}
      </div>
    );
  }
}

export default ContainerList;
