import React from 'react';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import { func, object, bool } from 'prop-types'
import update from 'immutability-helper';


export default class ProfileForm extends React.Component {

  state = {
    model: {}
  }

  static propTypes = {
    model: object.isRequired,
    onSave: func,
    saving: bool
  }

  static defaultProps = {
    model: {
      id: 0
    },
    onSave: () => { },
    saving: false
  }

  componentDidMount() {
    this.setState({ model: this.props.model });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ model: nextProps.model });
  }

  labelClass(input) {
    return (input != null && input !== '') ? 'active' : '';
  }

  handleInputChanged = (event) => {
    event.preventDefault();

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState((previousState) => update(previousState, {
      model:
        {
          [name]: { $set: value }
        }
    }));
  }

  handleSave = (event) => {
    this.props.onSave(this.state.model);
  }

  render() {
    const {
      onSave,
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
              <div style={{ padding: '0.5em 0', fontWeight: 'bold' }}>{model.email}</div>
              <label className={this.labelClass(model.email)} htmlFor="email">Email</label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xs="12" md="6">
            <div className="md-form">
              <input 
                className="form-control" 
                name="first_name" 
                type="text"
                value={model.first_name || ""}
                onChange={this.handleInputChanged}
              />
              <label 
                htmlFor="first_name"
                className={this.labelClass(model.first_name)}
              >
                First Name
              </label>

            </div>
          </Col>
          <Col xs="12" md="6">
            <div className="md-form">
              <input className="form-control" name="last_name" type="text"
                value={model.last_name || ""}
                onChange={this.handleInputChanged} />
              <label htmlFor="last_name" className={this.labelClass(model.last_name)}>Last Name</label>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button color="primary" disabled={saving} onClick={this.handleSave}>
              {saving ? <span><i className="fa fa-spin fa-spinner mr-1"></i> Saving...</span> : 'Save'}
            </Button>
            <br />
            <a  href="/users/edit">
              Change email, password, or cancel account
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}