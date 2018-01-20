import React from 'react';  
import { Link } from 'react-router-dom';  
import axios from 'axios';
import UserMemberships from './UserMemberships';

class ProfileDisplay extends React.Component {  
  constructor () {
    super();
    this.state = {
      profile: {}
    };
  }

  fetchProfile () {
    axios.get( `api/v1/profile.json` )
        .then(response => {
          this.setState({ profile: response.data });
        })
        .catch(error => {
          console.error(error);
        });
  }

  componentDidMount () {
    this.fetchProfile();
  }

  componentWillReceiveProps (nextProps) {
    this.fetchProfile();
  }

  render () {
    return (
      <div className="container">
    
        <div className="starter-template">
            <h1>Welcome, {this.state.profile.email}!</h1>
            <p>You're signed in and ready to use some apps.</p>
        </div>

        <h2>Organizations</h2>
        <UserMemberships userId={this.state.profile.id}></UserMemberships>

      </div>
    );
  }
}

export default ProfileDisplay;  