import React from 'react';
import axios from 'axios';
import graph from 'graphql.js';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import {
  Route,
  Switch,
  Link
} from 'react-router-dom'

import UserMemberships from './UserMemberships';
import ManageOrganizationView from './ManageOrganizationView';
import CreateOrganizationView from './CreateOrganizationView';

export default class OrganizationsView extends React.Component {
  state = {
    user: {},
    saving: false
  }

  constructor(props) {
    super(props);

    this.graph = graph('/graphql', {
      headers: {
        'X-CSRF-Token': $("meta[name=csrf-token]").attr("content"),
      }
    });
  }

  fetchProfile() {
    let fetchPromise;

    fetchPromise = this.graph(`
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
      .then(res => {
        this.setState({ user: res.user });
      })
      .catch(error => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.fetchProfile();
  }

  componentWillReceiveProps(nextProps) {
    this.fetchProfile();
  }

  render() {
    const {
      user
    } = this.state;

    const {
      match
    } = this.props;

    return (
      <section>
        <Route
          exact
          path={match.url}
          render={props =>
            <Row>
              <Col sm="12">
                <Link className="btn btn-sm btn-primary" to={`${match.url}/create`}>
                  <i className="fa fa-plus mr-1"></i>
                  Create New Organization
              </Link>
                <UserMemberships user={user}></UserMemberships>
              </Col>
            </Row>
          }
        />

        <Switch>
          <Route
            path={match.url + '/create'}
            component={CreateOrganizationView}
          />

          <Route
            path={match.url + '/:id'}
            component={ManageOrganizationView}
          />
        </Switch>
      </section>
    );
  }
}