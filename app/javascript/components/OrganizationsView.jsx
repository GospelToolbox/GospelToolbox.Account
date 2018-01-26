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
  NavLink
} from 'react-router-dom'

import UserMemberships from './UserMemberships';
import ManageOrganizationView from './ManageOrganizationView';

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
                <Button color="primary" size="sm">
                  <i className="fa fa-plus mr-1"></i>
                  Create New Organization
              </Button>
                <UserMemberships user={user}></UserMemberships>
              </Col>
            </Row>
          } />

        <Route
          path={match.url + '/:id'}
          component={ManageOrganizationView}
          />
      </section>
    );
  }
}