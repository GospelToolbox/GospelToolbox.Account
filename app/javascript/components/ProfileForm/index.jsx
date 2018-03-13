import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import { func, object, bool } from 'prop-types';
import update from 'immutability-helper';

export default class ProfileForm extends React.Component {
  static propTypes = {
    model: object.isRequired,
    onSave: func,
    saving: bool
  }

  static defaultProps = {
    onSave: () => { },
    saving: false
  }

  state = {
    model: {}
  }

  componentDidMount() {
    this.setState({ model: this.props.model });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  handleInputChanged = (event) => {
    event.preventDefault();

    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState(previousState => update(previousState, {
      model:
        {
          [name]: { $set: value }
        }
    }));
  }

  handleSave = () => {
    this.props.onSave(this.state.model);
  }

  render() {
    const {
      saving
    } = this.props;

    const {
      model
    } = this.state;

    return (
      <div className="container">
        <Row>
          <Col>
            <div className="md-form">
              <label htmlFor="email">Email</label>
              <div style={{ padding: '0.5em 0', fontWeight: 'bold' }}>{model.email}</div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="6">
            <div className="form-group">
              <label htmlFor="first_name">
                First Name
              </label>
              <input
                className="form-control"
                name="first_name"
                type="text"
                value={model.first_name || ''}
                onChange={this.handleInputChanged}
              />
            </div>
          </Col>
          <Col xs="12" md="6">
            <div className="form-group">
              <label htmlFor="last_name">Last Name</label>
              <input
                className="form-control"
                name="last_name"
                type="text"
                value={model.last_name || ''}
                onChange={this.handleInputChanged}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button color="primary" disabled={saving} onClick={this.handleSave}>
              {saving ? <span><i className="fa fa-spin fa-spinner mr-1" /> Saving...</span> : 'Save'}
            </Button>
            <br />
            <a href="/users/edit">
              Change email, password, or cancel account
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}
