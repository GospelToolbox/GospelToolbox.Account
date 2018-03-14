import React from 'react';
import graph from 'graphql.js';
import $ from 'jquery';
import {
  Row,
  Col
} from 'reactstrap';
import {
  Route,
  Switch,
  Link,
  HashRouter as Router
} from 'react-router-dom';

import UserMemberships from './UserMemberships';
import ManageOrganizationView from './ManageOrganizationView';
import CreateOrganizationView from './CreateOrganizationView';

export default class OrganizationsView extends React.Component {
  constructor(props) {
    super(props);

    this.graph = graph('/graphql', {
      headers: {
        'X-CSRF-Token': $('meta[name=csrf-token]').attr('content')
      }
    });
  }

  state = {
    user: {}
  }

  componentDidMount() {
    this.fetchProfile();
  }

  componentWillReceiveProps() {
    this.fetchProfile();
  }

  fetchProfile() {
    this.graph(`
      {
        user {
          memberships {
            role,
            organization {
              id,
              name
            }
          }
        }
      }
      `)()
      .then((res) => {
        this.setState({ user: res.user });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  render() {
    const {
      user
    } = this.state;

    const {
      match
    } = this.props;

    return (
      <Router>
        <div>
          <Route
            exact
            path="/"
            render={() => (
              <Row>
                <Col sm="12">
                  <div className="mb-4">
                    <Link className="btn btn-sm btn-primary" to="/create">
                      <i className="fa fa-plus mr-1" />
                      Create New Organization
                  </Link>
                  </div>
                  <UserMemberships user={user} />
                </Col>
              </Row>
            )
            }
          />

          <Switch>
            <Route
              path="/create"
              component={CreateOrganizationView}
            />

            <Route
              path="/:id"
              component={ManageOrganizationView}
            />
          </Switch>
        </div>
      </Router>
    );
  }
}
