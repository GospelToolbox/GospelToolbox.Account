import React from 'react';
import axios from 'axios';
import graph from 'graphql.js';
import {
  Row,
  Col,
  Button,
  Card,
  CardBody
} from 'reactstrap';
import {
  Route,
  Link
} from 'react-router-dom';
import $ from 'jquery';

import OrganizationInvitation from './OrganizationInvitation';

export default class ManageOrganizationView extends React.Component {
  constructor(props) {
    super(props);

    this.graph = graph('/graphql', {
      headers: {
        'X-CSRF-Token': $('meta[name=csrf-token]').attr('content')
      }
    });
  }

  state = {
    organization: null
  }

  componentDidMount() {
    this.fetchOrganization(this.props.match.params.id);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchOrganization(nextProps.match.params.id);
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

  handleDelete = () => {
    if (confirm('Are you sure you want to delete this organization? This action is not reversible')) {
      this.setState({ deleting: true });

      console.log(this.props);

      axios.delete(`api/v1/organizations/${this.props.match.params.id}`)
        .then(() => this.props.history.push('./'))
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
        <Row className="mb-2">
          <Col>
            <Link to="/" className="btn btn-sm btn-light">
              <i className="fa fa-arrow-left mr-1" />
              Back to All Organizations
            </Link>

          </Col>
        </Row>
        <div>
          {organization && (
            <Row>
              <Col xs="12" md="3">
                <Card>
                  <CardBody>
                    <div className="profile-img">
                      <img src="/assets/organization.png" alt="profile" />
                    </div>
                    <div className="text-center">
                      {organization.name}
                    </div>
                    <div className="profile-usermenu">
                      <ul className="nav flex-column">
                        <li className="nav-item active">
                          <a href="#">
                            <i className="fa fa-building-o mr-2" />
                            Overview
                          </a>
                        </li>
                        <li className="nav-item">
                          <a href="#">
                            <i className="fa fa-gear mr-2" />
                            Settings
                          </a>
                        </li>
                      </ul>
                    </div>
                  </CardBody>
                </Card>
              </Col>
              <Col xs="12" md="9">
                <Card>
                  <CardBody>
                    <div>
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
                          {organization.memberships.map(membership => (
                            <tr key={`${membership.user.id}-${membership.role}`}>
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
                    </div>                  </CardBody>
                </Card>
              </Col>
            </Row>


          )
          }
        </div>
        <Row>
          <Col>
            <button className="btn btn-sm btn-danger" disabled={deleting || saving} onClick={this.handleDelete}>
              <i className="fa fa-trash mr-1" />
              {deleting ? <span>Deleting... <i className="fa fa-spin fa-spinner" /></span> : 'Delete'}
            </button>
          </Col>
        </Row>
      </div>
    );
  }
}
