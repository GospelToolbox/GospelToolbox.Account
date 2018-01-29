import React from 'react';
import axios from 'axios';
import { number } from 'prop-types'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';

export default class OrganizationInvitation extends React.Component {
  state = {
    modalOpen: false,
    email: null,
    sending: false
  }

  static propTypes = {
    organizationId: number.isRequired
  }

  static defaultProps = {
    organizationId: null
  }

  toggleModal = () => {
    this.setState(state => ({ modalOpen: !state.modalOpen }));
  }

  sendInvitation = () => {
    event.preventDefault();

    this.setState({ sending: true, })

    axios.post(`api/v1/organizations/${this.props.organizationId}/invite`, {
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

    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

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
          <i className="fa fa-address-book-o mr-1"></i>
          Invite User
                </button>
        <Modal isOpen={modalOpen} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Invite User to Organization</ModalHeader>
          <ModalBody>
            <div className="md-form">
              <input type="email" name="email" value={email || ''} onChange={this.handleInputChanged} className="form-control" />
              <label htmlFor="email">Email to invite</label>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.sendInvitation} disabled={sending}>
              {sending ? <span>Sending... <i className="fa fa-spin fa-spinner"></i></span> : 'Send Invitation'}
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    )
  }
}