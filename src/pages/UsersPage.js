import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
  MDBBadge,
  MDBIcon,
  MDBTooltip
} from "mdbreact";

import React, { Component, Fragment } from "react";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import UsersActions from "../store/ducks/users";
import PropTypes from "prop-types";
import api from "../services/api";
import Select from "react-select";
import Modal from "../components/Modal";

class users extends Component {
  static propTypes = {
    getUsersRequest: PropTypes.func.isRequired,
    openUsersModal: PropTypes.func.isRequired,
    createUsersRequest: PropTypes.func.isRequired
  };

  state = {
    username: "",
    email: "",
    password: "",
    roles: [],
    selectedOption: null,
    modal: false,
    modalUpdate: false,
    modalChangePassword: false,
    modalName: "",
    modalEmail: "",
    modalID: "",
    modalPassword: ""
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  handleCreateUser = e => {
    e.preventDefault();
    e.target.className += " was-validated";

    const { createUsersRequest } = this.props;
    const { username, email, password, selectedOption } = this.state;
    if (selectedOption != null) {
      const rolesId = selectedOption.map(selected => selected.id);
      createUsersRequest(username, email, password, rolesId);
    } else {
      createUsersRequest(username, email, password);
    }
  };

  async componentDidMount() {
    const { getUsersRequest } = this.props;

    const response = await api.get("roles");
    this.setState({ roles: response.data });

    getUsersRequest();
  }

  handleDelete = async id => {
    const { getUsersRequest } = this.props;
    await api.delete(`users/${id}`);
    this.setState({
      modal: !this.state.modal,
      modalName: "",
      modalId: ""
    });
    getUsersRequest();
  };

  handleUpdate = async id => {
    await api.put(`users/${id}`, {
      username: this.state.modalName,
      email: this.state.modalEmail
    });
    const { getusersRequest } = this.props;
    getusersRequest();
    this.setState({
      modal: !this.state.modalUpdate,
      modalName: "",
      modalEmail: "",
      modalId: ""
    });
  };

  handleChangePassword = async id => {
    await api.put(`users/${id}`, {
      password: this.state.modalPassword
    });
    this.setState({
      modal: !this.state.modalChangePassword,
      modalName: "",
      modalPassword: "",
      modalId: ""
    });
  };

  toggle = (name, id) => {
    this.setState({
      modal: !this.state.modal,
      modalName: name,
      modalId: id
    });
  };

  toggleUpdate = (name, id, email) => {
    this.setState({
      modalUpdate: !this.state.modalUpdate,
      modalName: name,
      modalEmail: email,
      modalId: id
    });
  };
  toggleChangePassword = (name, id) => {
    this.setState({
      modalChangePassword: !this.state.modalChangePassword,
      modalName: name,
      modalId: id
    });
  };
  render() {
    const { users, openUsersModal, closeUsersModal } = this.props;
    const {
      username,
      email,
      password,
      roles,
      selectedOption,
      modalName,
      modal,
      modalId,
      modalUpdate,
      modalEmail,
      modalPassword,
      modalChangePassword
    } = this.state;

    return (
      <Fragment>
        <Modal>
          <MDBBtn color="primary" onClick={openUsersModal}>
            Cadastrar Novo Usuário
          </MDBBtn>

          <MDBModal isOpen={users.UsersModalOpen} toggle={closeUsersModal}>
            <MDBModalHeader toggle={closeUsersModal}>
              Cadastro de novo Usuário
            </MDBModalHeader>
            <form
              className="needs-validation"
              onSubmit={this.handleCreateUser}
              noValidate
            >
              <MDBModalBody>
                <MDBInput
                  label="Nome"
                  type="text"
                  name="username"
                  value={username}
                  onChange={this.handleInputChange}
                  id="usernameId"
                  placeholder="Username"
                  className="form-control"
                  outline
                  required
                />
                <div className="invalid-feedback">
                  Você precisa informar um Username Válido!
                </div>
                <div className="valid-feedback">Looks good!</div>

                <MDBInput
                  label="Email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={this.handleInputChange}
                  id="Email"
                  placeholder="e-mail"
                  className="form-control"
                  outline
                  required
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                </small>
                <MDBInput
                  type="password"
                  label="Senha"
                  outline
                  name="password"
                  className="form-control"
                  value={password}
                  onChange={this.handleInputChange}
                  id="Password"
                  placeholder="password placeholder"
                  required
                />
                <div className="valid-feedback">Looks good!</div>
                <div className="invalid-feedback">
                  Please provide a valid zip.
                </div>
                <label>Permissões</label>
                <Select
                  isMulti
                  options={roles}
                  getOptionLabel={role => role.name}
                  getOptionValue={role => role.id}
                  value={selectedOption}
                  onChange={this.handleChange}
                  isRequired
                  required
                />
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" onClick={closeUsersModal}>
                  Close
                </MDBBtn>
                <MDBBtn type="submit" color="primary">
                  Save changes
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModal>
        </Modal>

        <MDBRow>
          <MDBCol md="12">
            <MDBCard className="mt-5">
              <MDBCardBody className="table-responsive">
                <MDBTable>
                  <MDBTableHead color="primary-color" textWhite>
                    <tr>
                      <th>#</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Permissões</th>
                      <th>Editar / Remover </th>
                      <th>Alterar Senha</th>
                    </tr>
                  </MDBTableHead>

                  {users.data.map(users => (
                    <MDBTableBody key={users.id}>
                      <tr>
                        <th scope="row">{users.id}</th>
                        <td>{users.username}</td>
                        <td>{users.email}</td>
                        <td>
                          {users.roles.map(roles => (
                            <MDBBadge color="info" key={roles.id}>
                              {roles.name}
                            </MDBBadge>
                          ))}
                        </td>
                        <td>
                          <MDBRow>
                            <MDBTooltip
                              placement="left"
                              tag="div"
                              tooltipContent="Editar um Usuário"
                            >
                              <MDBBtn
                                size="sm"
                                color="info"
                                onClick={() =>
                                  this.toggleUpdate(
                                    users.username,
                                    users.id,
                                    users.email
                                  )
                                }
                              >
                                <MDBIcon icon="edit" className="mr-1" />
                              </MDBBtn>
                            </MDBTooltip>
                            <MDBTooltip
                              placement="left"
                              tag="div"
                              tooltipContent="Excluir um Usuário"
                            >
                              <MDBBtn
                                size="sm"
                                color="danger"
                                onClick={() =>
                                  this.toggle(users.username, users.id)
                                }
                              >
                                <MDBIcon icon="trash-alt" className="mr-1" />
                              </MDBBtn>
                            </MDBTooltip>
                          </MDBRow>
                        </td>
                        <td>
                          <MDBTooltip
                            placement="left"
                            tag="div"
                            tooltipContent="Alterar senha Usuário"
                          >
                            <MDBBtn
                              size="sm"
                              color="info"
                              onClick={() =>
                                this.toggleChangePassword(
                                  users.username,
                                  users.id
                                )
                              }
                            >
                              <MDBIcon icon="key" className="mr-1" />
                            </MDBBtn>
                          </MDBTooltip>
                        </td>
                      </tr>
                    </MDBTableBody>
                  ))}
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {/* INICIO modal para deletar */}
        {modal && (
          <Modal>
            <MDBModal isOpen={modal} toggle={this.toggle}>
              <MDBModalHeader toggle={this.toggle}>
                Apagar o Usuário "{modalName}"
              </MDBModalHeader>

              <MDBModalBody>
                <span>
                  Você deseja deletar a Usuário <strong>"{modalName}"</strong>?
                </span>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn onClick={this.toggle} color="secondary">
                  Não
                </MDBBtn>
                <MDBBtn
                  color="primary"
                  onClick={() => this.handleDelete(modalId)}
                >
                  Sim
                </MDBBtn>
              </MDBModalFooter>
            </MDBModal>
          </Modal>
        )}
        {/*FIM  modal para deletar */}
        {/*INICIO  modal para Editar */}
        {modalUpdate && (
          <Modal>
            <MDBModal isOpen={modalUpdate} toggle={this.toggleUpdate}>
              <MDBModalHeader toggle={this.toggleUpdate}>
                Editar o Usuário "{modalName}"
              </MDBModalHeader>
              <form
                className="needs-validation"
                onSubmit={() => this.handleUpdate(modalId)}
                noValidate
              >
                <MDBModalBody>
                  <MDBInput
                    label="Altere o username"
                    type="text"
                    name="modalName"
                    value={modalName}
                    onChange={this.handleInputChange}
                    id="modalNameId"
                    className="form-control"
                    outline
                    required
                  />
                  <div className="invalid-feedback">
                    Você precisa informar um Username Válido!
                  </div>
                  <MDBInput
                    label="Altere o Email"
                    type="text"
                    name="modalEmail"
                    value={modalEmail}
                    onChange={this.handleInputChange}
                    id="modalEmailId"
                    className="form-control"
                    outline
                    required
                  />
                  <div className="invalid-feedback">
                    Você precisa informar um Email Válido!
                  </div>
                </MDBModalBody>

                <MDBModalFooter>
                  <MDBBtn onClick={this.toggleUpdate} color="secondary">
                    Cancelar
                  </MDBBtn>
                  <MDBBtn color="primary" type="submit">
                    Salvar
                  </MDBBtn>
                </MDBModalFooter>
              </form>
            </MDBModal>
          </Modal>
        )}
        {/*FIM  modal para Editar */}
        {/* INICIO modal para Alterar Senha */}
        {modalChangePassword && (
          <Modal>
            <MDBModal
              isOpen={modalChangePassword}
              toggle={this.toggleChangePassword}
            >
              <MDBModalHeader toggle={this.toggleChangePassword}>
                Alterar a senha do Usuário "{modalName}"
              </MDBModalHeader>

              <form
                className="needs-validation"
                onSubmit={() => this.handleChangePassword(modalId)}
                noValidate
              >
                <MDBModalBody>
                  <MDBInput
                    label="Altere a Senha"
                    type="password"
                    name="modalPassword"
                    value={modalPassword}
                    onChange={this.handleInputChange}
                    id="modalNameId"
                    className="form-control"
                    outline
                    required
                  />
                  <div className="invalid-feedback">
                    Você precisa informar um Senha Válida!
                  </div>
                </MDBModalBody>
                <MDBModalFooter>
                  <MDBBtn onClick={this.toggleChangePassword} color="secondary">
                    Não
                  </MDBBtn>
                  <MDBBtn color="primary" type="submit">
                    Sim
                  </MDBBtn>
                </MDBModalFooter>
              </form>
            </MDBModal>
          </Modal>
        )}
        {/*FIM  modal para Alterar Senha  */}
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(UsersActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(users);
