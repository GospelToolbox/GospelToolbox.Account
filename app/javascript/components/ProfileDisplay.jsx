import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardTitle,
  CardText,
  Row,
  Col,
  Button
} from 'reactstrap';
import classnames from 'classnames';

import ProfileForm from './ProfileForm/ProfileForm';
import './ProfileDisplay';
import UserMemberships from './UserMemberships';

class ProfileDisplay extends React.Component {
  state = {
    profile: {},
    activeTab: 'profile',
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

  toggle = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  componentDidMount() {
    this.fetchProfile();
  }

  componentWillReceiveProps(nextProps) {
    this.fetchProfile();
  }

  handleSaveProfile = (model) => {
    this.setState({saving: true});
    axios.put(`api/v1/users/${model.id}`, model)
      .then(() => this.fetchProfile)
      .finally(() => this.setState({saving: false}));
  }

  render() {
    const {
      activeTab,
      profile,
      saving
    } = this.state;
    return (
      <div className="container">
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'profile' })}
              onClick={() => this.toggle('profile')}>
              Profile
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: activeTab === 'organizations' })}
              onClick={() => this.toggle('organizations')}>
              Organizations
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="profile">
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
          </TabPane>
          <TabPane tabId="organizations">
            <Row>
              <Col sm="12">
                <Button color="primary" size="sm">
                <i className="fa fa-plus mr-1"></i>
                Create New Organization
                </Button>
                <UserMemberships userId={profile.id}></UserMemberships>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default ProfileDisplay;  