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

import './ProfileDisplay';
import UserMemberships from './UserMemberships';

class ProfileDisplay extends React.Component {
  constructor() {
    super();
    this.state = {
      profile: {},
      activeTab: 'profile'
    };
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

  render() {
    return (
      <div className="container">
        <Nav tabs className="mb-3">
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'profile' })}
              onClick={() => { this.toggle('profile'); }}
            >
              Profile
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === 'organizations' })}
              onClick={() => { this.toggle('organizations'); }}
            >
              Organizations
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="profile">
            <Row>
              <Col sm="12">
                <h1>Welcome, {this.state.profile.email}!</h1>
                <p>You're signed in and ready to use some apps.</p>
              </Col>
            </Row>
            {this.state.profile &&
              <section>
                <Row>
                  <Col>
                    <div className="md-form">
                      <input className="form-control" name="email" type="email"
                        value={this.state.profile.email} />
                      <label className={'active'} htmlFor="email">Email</label>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col sm="12" md="6">
                    <div className="md-form">
                      <input className="form-control" name="firstName" type="text" />
                      <label htmlFor="firstName">First Name</label>
                    </div>
                  </Col>
                  <Col sm="12" md="6">
                    <div className="md-form">
                      <input className="form-control" name="lastName" type="text" />
                      <label htmlFor="lastName">Last Name</label>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button color="primary">Save</Button>
                  </Col>
                </Row>
              </section>
            }
          </TabPane>
          <TabPane tabId="organizations">
            <Row>
              <Col sm="12">
                <Button color="primary" size="sm">
                <i className="fa fa-plus mr-1"></i>
                Create New Organization
                </Button>
                <UserMemberships userId={this.state.profile.id}></UserMemberships>
              </Col>
            </Row>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default ProfileDisplay;  