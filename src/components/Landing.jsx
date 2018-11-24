import React, { Component } from 'react';
import { ContainerFluid, Row, Column } from './Bootstrap/layout';
import { Card, CardHeader, CardTitle } from './Bootstrap/components';

import Loading from './partials/Loading/Loading';
import Welcome from './partials/Welcome';

class Landing extends Component {
  
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null 
    };
  }

  render() {
    const isLoaded = this.props.isLoaded;
    const isLoggedIn = isLoaded && this.props.isLoggedIn;
    const isNotLoggedIn = isLoaded && !this.props.isLoggedIn;
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
                    <CardTitle>Bar</CardTitle>
                  </CardHeader>
                </Card>
              </Column>
            </Row>
          ) : <Loading /> }
      
      </ContainerFluid>
    );
  }
}

export default Landing;