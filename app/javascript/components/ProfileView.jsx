import React from 'react';
import axios from 'axios';
import {
  Row,
  Col,
} from 'reactstrap';

import ProfileForm from './ProfileForm';

export default class ProfileView extends React.Component {
  state = {
    profile: {},
    saving: false
  }

  fetchProfile() {
    axios.get(`api/v1/profile.json`)
      .then(response => {
        this.setState({ profile: response.data });
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

  handleSaveProfile = (model) => {
    this.setState({ saving: true });
    axios.put(`api/v1/users/${model.id}`, model)
      .then(() => this.fetchProfile())
      .finally(() => this.setState({ saving: false }));
  }

  render() {
    const {
      profile,
      saving
    } = this.state;
    return (
      <section>
        <Row>
          <Col sm="12">
            <h1>Welcome, {profile.email}!</h1>
            <p>You're signed in and ready to use some apps.</p>
          </Col>
        </Row>
        {profile &&
          <Row>
            <Col>
              <ProfileForm model={profile} saving={saving} onSave={this.handleSaveProfile}></ProfileForm>
            </Col>
          </Row>
        }
      </section>
    );
  }
}