import React from 'react';
import axios from 'axios';
import {
  Row,
  Col,
  Card,
  CardBody
} from 'reactstrap';

import profileImage from 'images/profile.png';
import ProfileForm from './ProfileForm';

const pathRoot = process.env.RAILS_RELATIVE_URL_ROOT;

export default class ProfileView extends React.Component {
  state = {
    profile: {},
    saving: false
  }

  componentDidMount() {
    this.fetchProfile();
  }

  componentWillReceiveProps() {
    this.fetchProfile();
  }

  fetchProfile() {
    axios.get(`${pathRoot}/api/v1/profile.json`)
      .then((response) => {
        this.setState({ profile: response.data });
      })
      .catch((error) => {
        console.error(error);
      });
  }

  handleSaveProfile = (model) => {
    this.setState({ saving: true });
    axios.put(`${pathRoot}/api/v1/users/${model.id}`, model)
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
        {profile &&
          <Row>
            <Col xs="12" md="3">
              <Card>
                <CardBody>
                  <div className="profile-img">
                    <img src={profileImage} alt="profile" />
                  </div>
                  <div className="text-center">
                    {profile.first_name} {profile.last_name}
                  </div>
                  <div className="profile-usermenu">
                    <ul className="nav flex-column">
                      <li className="nav-item active">
                        <a href="#">
                          <i className="fa fa-user mr-2" />
                          Overview
                        </a>
                      </li>
                      <li className="nav-item">
                        <a href="/users/edit">
                          <i className="fa fa-gear mr-2" />
                          Account Settings
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
                  <ProfileForm model={profile} saving={saving} onSave={this.handleSaveProfile} />
                </CardBody>
              </Card>
            </Col>
          </Row>
        }
      </section>
    );
  }
}
