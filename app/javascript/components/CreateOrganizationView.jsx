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

export default class CreateOrganizationView extends React.Component {
  state = {
    name: null
  }

  handleInputChanged = (event) => {
    event.preventDefault();

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit = (event) => {
    event.preventDefault();

    this.setState({ saving: true });
    axios.post('api/v1/organizations', {
      name: this.state.name
    })
      .then(res => this.props.history.push(`./${res.data.id}`))
      .catch(err => console.log(err))
      .finally(() => this.setState({ saving: false }));
  }

  render() {
    const {
      name,
      saving
    } = this.state;

    const {
      match
    } = this.props;

    return (
      <div>
        <h2 className="mb-4">New Organization</h2>
        <Row>
          <Col>
            <form onSubmit={this.handleSubmit} >
              <div className="md-form">
                <input
                  name="name"
                  className="form-control"
                  type="text"
                  value={name || ''}
                  onChange={this.handleInputChanged}
                />
                <label htmlFor="name">Organization Name</label>
              </div>

              <button className="btn btn-primary" type="submit" disabled={saving}>
                {saving ? <span><i className="fa fa-spin fa-spinner mr-1" /> Saving...</span> : 'Create'}
              </button>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}
