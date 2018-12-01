import React, { Component } from 'react';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';
import { Card, CardHeader, CardTitle, CardBody} from './Bootstrap/components';

import Loading from './partials/Loading/Loading';
import Welcome from './partials/Welcome';
import ForceGraph from './partials/ForceGraph/ForceGraph';
import FadeIn from 'react-fade-in/lib/FadeIn';


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
    const physicals = this.props.physicals;
    const virtuals = this.props.virtuals;
    for(let i = 0; i < virtuals.length; i++){
      let virtual = virtuals[i];
      let virtualNode = {
        id: virtual._id,
        name: virtual.name,
        value: 5,
        color: "gold"
      };
      graphData.nodes.push(virtualNode);
    }  
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
      for(let j = 0; j < physicals.length; j++){
        let physical = physicals[j];
        let physicalNode = {
          id: physical._id,
          name: physical.name,
          value: 5,
          color: "lightBlue"          
        };
        if (physical.lab._id === lab._id) {
          graphData.nodes.push(physicalNode);
          graphData.links.push({
            source: lab._id,
            target: physical._id
          });
          graphData.links.push({
            source: physical.virtual._id,
            target: physical._id
          });
        }
      }
    }
    return (
      <ContainerFluid>
          {(isLoaded) ? (
            <FadeIn>
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
                    <div className="color-block blue mr-2"></div>
                    <div className="color-label mr-4">BioNet API</div>
                    <div className="color-block green mr-2"></div>
                    <div className="color-label mr-4">Lab</div>
                    <div className="color-block gold mr-2"></div>
                    <div className="color-label mr-4">Virtual Sample</div>
                    <div className="color-block light-blue mr-2"></div>
                    <div className="color-label mr-4">Physical Sample</div>
                  </CardBody>
                </Card>  
              </Column>
            </Row>
            </FadeIn>
          ) : <Loading /> }
      </ContainerFluid>
    );
  }
}

export default Landing;