import React, { Component } from 'react';
import { Column } from  '../Bootstrap/layout';
import { ButtonGroup, Button, Card, CardHeader, CardTitle, CardBody, CardText } from '../Bootstrap/components';

class Welcome extends Component {
  
  render() {
    return (
      <Card className="mb-3 text-center text-lg-left">
        <CardHeader green>
          <CardTitle>BioNet</CardTitle>
        </CardHeader>
        <CardBody>
          <CardTitle className="mb-2"><strong>Open Source Biological Inventory Management</strong></CardTitle>
          <CardText>Welcome to BioNet. Keep track of your stuff, find what you need, and share as you like. The BioNet supports searching for biological material across multiple labs — all your inventory information is controlled locally by you. You decide if others can see what you wish to share. All BioNet software and associated materials are open source and free to use.</CardText>
          <Column className="text-center">
            <ButtonGroup className="mb-3">
              <Button type="success" link to="/login">Login</Button>
              <Button type="primary" link to="/signup">Sign Up</Button>
            </ButtonGroup>
          </Column>  
          <CardTitle className="mb-2"><strong>Why BioNet?</strong></CardTitle>
          <iframe 
            title="Bionet Demo Video"
            width="100%" 
            height="315" 
            src="https://www.youtube.com/embed/t29-RGggSU8" 
            frameborder="0" 
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen
          ></iframe>
        </CardBody>
      </Card>
    );
  }
}

export default Welcome;