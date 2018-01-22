import React from 'react'
import axios from 'axios'
import graph from 'graphql.js'

import { Button } from 'reactstrap';

class UserMemberships extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberships: []
    };

    this.graph = graph('/graphql', {
      headers: {
        'X-CSRF-Token': $("meta[name=csrf-token]").attr("content"),
      }
    });

  }

  fetchMemberships(userId) {
    let fetchPromise;
    
    if (userId != null) {
      fetchPromise = this.graph(`
      {
        user(id: ${userId}) {
          memberships {
            role,
            organization {
              name
            }
          }
        }
      }
      `)()
      .then(res => res.user.memberships);
    } else {
      fetchPromise = Promise.resolve([]);
    }

    fetchPromise.then(memberships => {
      this.setState({ memberships });
    })
    .catch(error => {
      console.error(error);
    });
  }

  componentDidMount() {
    this.fetchMemberships(this.props.userId);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchMemberships(nextProps.userId);
  }

  render() {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>{/* Actions */}</th>
          </tr>
        </thead>
        <tbody>
          {this.state.memberships.map((membership, ndx) => (
            <tr key={ndx}>
              <td className="font-weight-bold">
                {membership.organization.name}
              </td>
              <td>
                {membership.role}
              </td>
              <td>
                { membership.role === 'admin' &&
                <Button color="primary" size="sm">
                <i className="fa fa-gears mr-1"></i>
                Manage
                </Button>
                }
                <Button color="danger" size="sm">
                <i className="fa fa-sign-out mr-1"></i>
                Leave Organization
                </Button>
                </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default UserMemberships;
