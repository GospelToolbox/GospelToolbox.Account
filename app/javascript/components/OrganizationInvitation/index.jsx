import React from 'react';
import axios from 'axios';
import { number } from 'prop-types';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

const pathRoot = process.env.RAILS_RELATIVE_URL_ROOT;

export default class OrganizationInvitation extends React.Component {
  static propTypes = {
    organizationId: number.isRequired
  }

  static defaultProps = { }

  state = {
    modalOpen: false,
    email: null,
    sending: false
  }

  toggleModal = () => {
    this.setState(state => ({ modalOpen: !state.modalOpen }));
  }

  sendInvitation = (event) => {
    event.preventDefault();

    this.setState({ sending: true });

    axios.post(`${pathRoot}/api/v1/organizations/${this.props.organizationId}/invite`, {
      email: this.state.email
    })
      .catch(err => console.log(err))
      .finally(() => {
        this.setState({ sending: false });
        setTimeout(() => this.toggleModal(), 500);
      });
  }

  handleInputChanged = (event) => {
    event.preventDefault();

    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  render() {
    const {
      modalOpen,
      email,
      sending
    } = this.state;

    return (
      <div>
        <button className="btn btn-sm btn-primary" onClick={this.toggleModal}>
          <i className="fa fa-address-book-o mr-1" />
          Invite User
        </button>
        <Modal isOpen={modalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Invite User to Organization</ModalHeader>
          <ModalBody>
            <div className="form-group">
              <label htmlFor="email">Email to invite</label>
              <input type="email" name="email" value={email || ''} onChange={this.handleInputChanged} className="form-control" />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.sendInvitation} disabled={sending}>
              {sending ? <span>Sending... <i className="fa fa-spin fa-spinner" /></span> : 'Send Invitation'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
