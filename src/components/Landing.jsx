import React, { Component } from 'react';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';
import { Card, CardHeader, CardTitle, CardBody, CardText } from './Bootstrap/components';

import Loading from './partials/Loading/Loading';
import Welcome from './partials/Welcome';
import ForceGraph from './partials/ForceGraph/ForceGraph';


class Landing extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      graphData: {} 
    };
  }

  componentDidMount() {
    let graphData = {
      nodes: [],
      links: []
    };
    let bioNet = {
      id: "bionetapi",
      name: "BioNet API",
      value: 10
    };
    graphData.nodes.push(bioNet);
    this.setState({
      graphData
    });
  }

  render() {
    const isLoaded = this.props.isLoaded;
    const isLoggedIn = isLoaded && this.props.isLoggedIn;
    const isNotLoggedIn = isLoaded && !this.props.isLoggedIn;
    let graphData = {
      nodes: [
        {
          id: "bionet",
          name: "BioNet",
          value: 20,
          color: "blue"
        }
      ],
      links: []
    };
    const labs = this.props.labs;
    for(let i = 0; i < labs.length; i++){
      let lab = labs[i];
      let labNode = {
        id: lab._id,
        name: lab.name,
        value: 5,
        color: "green"
      };
      graphData.nodes.push(labNode);
      graphData.links.push({
        source: "bionet",
        target: lab._id
      });
    }
    return (
      <ContainerFluid>
        
          {(isLoaded) ? (
            <Row>
              <Column col="12" colLg="5">
                {(isLoggedIn) ? (
                  <Card>
                    <CardHeader green>
                      <CardTitle>Welcome Back {this.props.currentUser.username}</CardTitle>
                    </CardHeader>
                  </Card>
                ) : null}
                {(isNotLoggedIn) ? (
                  <Welcome />
                ) : null}
              </Column>
              <Column col="12" colLg="7">
                <Card>
                  <CardHeader green>
                    <CardTitle>BioNet Graph</CardTitle>
                  </CardHeader>
                  <ForceGraph 
                    {...this.props}
                    viewMode="3D"
                    graphData={graphData}
                  />
                  <CardBody>
                    <CardText>
                      <div className="color-block blue mr-2"></div>
                      <div className="color-label mr-4">BioNet API</div>
                      <div className="color-block green mr-2"></div>
                      <div className="color-label mr-2">Lab</div>
                    </CardText>
                  </CardBody>
                </Card>  
              </Column>
            </Row>
          ) : <Loading /> }
      
      </ContainerFluid>
    );
  }
}

export default Landing;