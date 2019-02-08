import React, { Component } from 'react';
import { Card, CardHeader, CardTitle, CardBody} from '../../Bootstrap/components';

class Profile extends Component {
  render() {
    const record = this.props.selectedRecord;
    return (
      <Card>
        <CardHeader green>
          <CardTitle>{record.type}</CardTitle>
        </CardHeader>
        <CardBody><pre>{JSON.stringify(this.props, null, 2)}</pre></CardBody>
      </Card>
    );
  }
}

export default Profile;