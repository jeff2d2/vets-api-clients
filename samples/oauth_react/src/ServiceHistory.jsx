/*
 * Copyright (c) 2018, Okta, Inc. and/or its affiliates. All rights reserved.
 * This file has been modified from the original.
 * Modifications are subject to the CC0 1.0 Universal public domain dedication.
 *
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Header, Message } from 'semantic-ui-react';
import JSONPretty from 'react-json-pretty';
import { SignedIn } from './Authentication';
import config from './.samples.config';
import 'react-json-pretty/JSONPretty.monikai.styl';
require('react-json-pretty/JSONPretty.adventure_time.styl');

class ServiceHistory extends Component {
  static propTypes = {
    user: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = { history: null, failed: null };
  }

  componentDidMount() {
    this.getServiceHistory();
  }

  async getServiceHistory() {
    if (!this.state.history) {
      try {
        const accessToken = this.props.user.access_token;
        /* global fetch */
        const response = await fetch(config.resourceServer.serviceHistoryUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.status !== 200) {
          this.setState({ failed: true });
          return;
        }

        const data = await response.json();  
        console.log(data);
        console.log(JSON.stringify(data));
        this.setState({ history: data, failed: false });
      } catch (err) {
        this.setState({ failed: true });
        /* eslint-disable no-console */
        console.error(err);
      }
    }
  }

  render() {
    const possibleErrors = [
      'Your Open ID Connect-enabled vets-api instance is running at ' + config.resourceServer.serviceHistoryUrl,
    ];
    const divStyle = {
      border: '2px solid #118762',
      backgroundColor: '#CDECDB',
      padding: '20px'
    }
    return (
      <div>
        <Header as="h1">My Service History</Header>
        {this.state.failed === true && <Message error header="Failed to fetch service history.  Please verify the following:" list={possibleErrors} />}
        {this.state.failed === null && <p>Fetching Service History..</p>}
        {this.state.history &&
          <div>
            <p>You have granted this application access to your VA service history data. It can now
               use an access token to retrieve and display your service history.</p>
            <div style={divStyle}>
            <JSONPretty id="json-pretty" json={this.state.history}/>
            </div>
          </div>
        }
      </div>
    );
  }
}

export default SignedIn.wrapComponent(ServiceHistory);
