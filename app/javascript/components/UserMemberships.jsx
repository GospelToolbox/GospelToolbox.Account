import React from 'react'
import axios from 'axios'
import graph from 'graphql.js'
import {
  Link
} from 'react-router-dom'
import { Button } from 'reactstrap';

export default class UserMemberships extends React.Component {
  state = {
    user: null
  }
  render() {
    const {
      user
    } = this.props;

    return (
      <div>
      { user && user.memberships && <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>{/* Actions */}</th>
          </tr>
        </thead>
        <tbody>
          {user.memberships.map((membership, ndx) => (
            <tr key={ndx}>
              <td className="font-weight-bold">
                {membership.organization.name}
              </td>
              <td>
                {membership.role}
              </td>
              <td>
                { (membership.role === 'Administrator' || membership.role === 'admin') &&
                  <Link className="btn btn-sm btn-primary" to={`/organizations/${membership.organization.id}`}>
                    <i className="fa fa-gears mr-1"></i>
                    Manage
                  </Link>
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
    }
    </div>
    );
  }
}