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
  Link
} from 'react-router-dom'

export default class ManageOrganizationView extends React.Component {
  state = {
    organization: null
  }
  constructor(props) {
    super(props);

    this.graph = graph('/graphql', {
      headers: {
        'X-CSRF-Token': $("meta[name=csrf-token]").attr("content"),
      }
    });
  }

  fetchOrganization(orgId) {
    let fetchPromise;
    
    if (orgId != null) {
      fetchPromise = this.graph(`
      {
        organization(id: ${orgId}) {
          name,
          memberships {
            role,
              user {
              id,
              first_name,
              last_name,
              email
            }
          }
        }
      }
      `)()
      .then(res => res.organization);
    } else {
      fetchPromise = Promise.resolve({});
    }

    fetchPromise.then(organization => {
      this.setState({ organization });
    })
    .catch(error => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.fetchOrganization(this.props.match.params['id']);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchOrganization(nextProps.match.params['id']);
  }

  render() {
    const {
      organization
    } = this.state;

    const {
      match
    } = this.props;

    return (
      <div>
        <h2>{organization && organization.name}</h2>
        <Row>
          <Col>
            <Link to="/organizations" className="btn btn-sm btn-light">
              <i className="fa fa-arrow-left mr-1"></i>
              Back to Organizations
            </Link>
          </Col>
        </Row>
      </div>
    );
  }
}