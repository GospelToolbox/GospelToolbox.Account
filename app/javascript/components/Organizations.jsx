import React from "react"
import axios from 'axios';

class Organizations extends React.Component {
  constructor () {
    super();
    this.state = {
      orgs: []
    };
  }

  fetchOrganizations () {
    axios.get( `api/v1/organizations` )
        .then(response => {
          this.setState({ orgs: response.data });
        })
        .catch(error => {
          console.error(error);
        });
  }

  componentDidMount () {
    this.fetchOrganizations();
  }

  componentWillReceiveProps (nextProps) {
    this.fetchOrganizations();
  }

  render () {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {this.state.orgs.map( (org, ndx) => ( 
            <tr key="ndx">
              <td>
                {org.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default Organizations;
