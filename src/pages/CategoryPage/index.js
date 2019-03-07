import React, { Component, Fragment } from "react";
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
  MDBContainer,
  MDBTooltip
} from "mdbreact";

import PropTypes from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import api from "../../services/api";

import CategoryActions from "../../store/ducks/category";

import Modal from "../../components/Modal";

import SubCategory from "../../components/SubCategory";

class CategoryPage extends Component {
  static propTypes = {
    createCategoryRequest: PropTypes.func.isRequired,
    openCategoryModal: PropTypes.func.isRequired,
    closeCategoryModal: PropTypes.func.isRequired
  };

  state = {
    categoryName: "",
    subCategoryName: "",
    categoryId: [],
    selectedOption: null,
    modal: false,
    modalUpdate: false,
    modalName: "",
    modalID: ""
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCreateCategory = e => {
    e.preventDefault();
    e.target.className += " was-validated";

    const { createCategoryRequest } = this.props;
    const { categoryName } = this.state;

    createCategoryRequest(categoryName);
  };

  componentDidMount() {
    const { getCategoryRequest } = this.props;

    getCategoryRequest();
  }

  handleDelete = async id => {
    await api.delete(`category/${id}`);

    const { getCategoryRequest } = this.props;
    getCategoryRequest();
    this.setState({
      modal: !this.state.modal,
      modalName: "",
      modalId: ""
    });
  };

  handleUpdate = async id => {
    await api.put(`category/${id}`, {
      name: this.state.modalName
    });

    const { getCategoryRequest } = this.props;
    getCategoryRequest();
    this.setState({
      modal: !this.state.modalUpdate,
      modalName: "",
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
  toggleUpdate = (name, id) => {
    this.setState({
      modalUpdate: !this.state.modalUpdate,
      modalName: name,
      modalId: id
    });
  };

  render() {
    const { openCategoryModal, closeCategoryModal, category } = this.props;

    const { categoryName, modal, modalName, modalId, modalUpdate } = this.state;

    return (
      <Fragment>
        <MDBRow>
          <MDBCol size="4">
            <Modal>
              <MDBBtn color="primary" onClick={openCategoryModal}>
                Cadastrar Nova Categoria
              </MDBBtn>
              <MDBModal
                isOpen={category.CategoryModalOpen}
                toggle={closeCategoryModal}
              >
                <MDBModalHeader toggle={closeCategoryModal}>
                  Cadastrar Nova Categoria
                </MDBModalHeader>
                <form
                  className="needs-validation"
                  onSubmit={this.handleCreateCategory}
                  noValidate
                >
                  <MDBModalBody>
                    <MDBInput
                      label="Digite o nome da categoria"
                      type="text"
                      name="categoryName"
                      value={categoryName}
                      onChange={this.handleInputChange}
                      id="categoryNameId"
                      className="form-control"
                      outline
                      required
                    />
                    <div className="invalid-feedback">
                      Você precisa informar um Username Válido!
                    </div>
                  </MDBModalBody>
                  <MDBModalFooter>
                    <MDBBtn color="secondary" onClick={closeCategoryModal}>
                      Close
                    </MDBBtn>
                    <MDBBtn type="submit" color="primary">
                      Save changes
                    </MDBBtn>
                  </MDBModalFooter>
                </form>
              </MDBModal>
            </Modal>
          </MDBCol>
          <MDBCol size="4">
            <SubCategory />
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12">
            <MDBCard className="mt-5">
              <MDBCardBody>
                <MDBTable>
                  <MDBTableHead color="primary-color" textWhite>
                    <tr className="text-center">
                      <th>#</th>
                      <th>Categoria</th>
                      <th>Sub Categorias</th>
                      <th>Excluir</th>
                    </tr>
                  </MDBTableHead>
                  {category &&
                    category.data.map(category => (
                      <MDBTableBody key={category.id}>
                        <tr className="text-center">
                          <th>{category.id}</th>
                          <td>{category.name}</td>

                          <td>
                            {category.subCategories &&
                              category.subCategories.length > 0 &&
                              category.subCategories.map(subCategories => (
                                <MDBBadge
                                  className="mr-1"
                                  color="info"
                                  key={subCategories.id}
                                >
                                  {subCategories.name}
                                </MDBBadge>
                              ))}
                          </td>
                          <td className="align-middle">
                            <MDBRow>
                              <MDBTooltip
                                placement="left"
                                tag="div"
                                tooltipContent="Editar uma Categoria"
                              >
                                <MDBBtn
                                  size="sm"
                                  color="info"
                                  onClick={() =>
                                    this.toggleUpdate(
                                      category.name,
                                      category.id
                                    )
                                  }
                                >
                                  <MDBIcon icon="edit" className="mr-1" />
                                </MDBBtn>
                              </MDBTooltip>
                              <MDBTooltip
                                placement="left"
                                tag="div"
                                tooltipContent="Excluir uma categoria"
                              >
                                <MDBBtn
                                  size="sm"
                                  color="danger"
                                  onClick={() =>
                                    this.toggle(category.name, category.id)
                                  }
                                >
                                  <MDBIcon icon="trash-alt" />
                                </MDBBtn>
                              </MDBTooltip>
                            </MDBRow>
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
                Apagar a categoria "{modalName}"
              </MDBModalHeader>
              <MDBModalBody>
                <span>
                  Você deseja deletar a categoria <strong>"{modalName}"</strong>
                  ?
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
        {/* INICIO modal para Editar */}
        {modalUpdate && (
          <Modal>
            <MDBModal isOpen={modalUpdate} toggle={this.toggleUpdate}>
              <MDBModalHeader toggle={this.toggleUpdate}>
                Editar a categoria "{modalName}"
              </MDBModalHeader>
              <form
                className="needs-validation"
                onSubmit={() => this.handleUpdate(modalId)}
                noValidate
              >
                <MDBModalBody>
                  <MDBInput
                    label="Digite o nome da categoria"
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
      </Fragment>
    );
  }
}
const mapStateToProps = state => ({
  category: state.category
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(CategoryActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CategoryPage);
