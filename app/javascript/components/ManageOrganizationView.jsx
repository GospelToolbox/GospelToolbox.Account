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
} from 'react-router-dom';

import OrganizationInvitation from './OrganizationInvitation';

export default class ManageOrganizationView extends React.Component {
  state = {
    organization: null
  }
  constructor(props) {
    super(props);

    this.graph = graph('/graphql', {
      headers: {
        'X-CSRF-Token': $('meta[name=csrf-token]').attr('content')
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

    fetchPromise.then((organization) => {
      this.setState({ organization });
    })
      .catch((error) => {
        console.error(error);
      });
  }

  componentDidMount() {
    this.fetchOrganization(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchOrganization(nextProps.match.params.id);
  }

  handleDelete = () => {
    if (confirm('Are you sure you want to delete this organization? This action is not reversible')) {
      this.setState({ deleting: true });

      axios.delete(`api/v1/organizations/${this.props.match.params.id}`)
        .then(res => this.props.history.push('./'))
        .catch(err => console.log(err))
        .finally(() => this.setState({ deleting: false }));
    }
  }

  render() {
    const {
      organization,
      deleting,
      saving
    } = this.state;

    const {
      match
    } = this.props;

    return (
      <div>
        <h2 className="mb-4">{organization && organization.name}</h2>
        <Row className="mb-2">
          <Col>
            <Link to="/organizations" className="btn btn-sm btn-light">
              <i className="fa fa-arrow-left mr-1" />
              Back to Organizations
            </Link>
            <button className="btn btn-sm btn-danger" disabled={deleting || saving} onClick={this.handleDelete}>
              <i className="fa fa-trash mr-1" />
              {deleting ? <span>Deleting... <i className="fa fa-spin fa-spinner" /></span> : 'Delete'}
            </button>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col>
            <h3>Organization Logo</h3>
          </Col>
        </Row>
        {organization &&
          <Row className="mb-2">
            <Col>
              <h3>Organization Members</h3>
              <div>
                <OrganizationInvitation organizationId={parseInt(match.params.id)} />
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {organization.memberships.map((membership, ndx) => (
                    <tr key={ndx}>
                      <td className="font-weight-bold">
                        {membership.user.email}
                      </td>
                      <td className="font-weight-bold">
                        {membership.user.last_name}, {membership.user.first_name}
                      </td>
                      <td>
                        {membership.role}
                      </td>
                      <td>
                        <Button color="danger" size="sm">
                          <i className="fa fa-sign-out mr-1" />
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
        }
      </div>
    );
  }
}
