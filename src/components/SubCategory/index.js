import React, { Component } from "react";
import PropTypes from "prop-types";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import SubCategoryActions from "../../store/ducks/subCategory";
import api from "../../services/api";

import Select from "react-select";
import Modal from "../Modal";
import {
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter,
  MDBInput
} from "mdbreact";

class SubCategory extends Component {
  static propTypes = {
    getSubCategoryRequest: PropTypes.func.isRequired,
    openModal: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired
  };
  state = {
    name: "",
    category: "",
    selectedOption: null
  };
  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleCreateSubCategory = e => {
    e.preventDefault();
    e.target.className += " was-validated";

    const { createSubCategoryRequest } = this.props;
    const { name, selectedOption } = this.state;
    const categoryid = selectedOption.id;

    createSubCategoryRequest(name, categoryid);
  };

  handleChange = selectedOption => {
    this.setState({ selectedOption });
    console.log(`Option selected:`, selectedOption);
  };

  async componentDidMount() {
    const { getSubCategoryRequest } = this.props;

    const response = await api.get("category");
    this.setState({ category: response.data });

    getSubCategoryRequest();
  }

  render() {
    const { openModal, closeModal, subCategory } = this.props;
    const { subCategoryName, selectedOption, category } = this.state;

    return (
      <Modal>
        <MDBBtn color="primary" onClick={openModal}>
          Cadastrar nova Sub-Categoria
        </MDBBtn>
        <MDBModal isOpen={subCategory.subModalOpen} toggle={closeModal}>
          <MDBModalHeader toggle={closeModal}>
            Cadastrar nova Sub-Categoria
          </MDBModalHeader>
          <form
            className="needs-validation"
            onSubmit={this.handleCreateSubCategory}
            noValidate
          >
            <MDBModalBody>
              <MDBInput
                label="Digite o nome da Sub-Categoria"
                type="text"
                name="name"
                value={subCategoryName}
                onChange={this.handleInputChange}
                id="nameId"
                className="form-control"
                outline
                required
              />
              <div className="invalid-feedback">
                Você precisa informar um Sub-Categoria Válida!
              </div>
              <Select
                options={category}
                getOptionLabel={category => category.name}
                getOptionValue={category => category.id}
                value={selectedOption}
                onChange={this.handleChange}
              />
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={closeModal}>
                Close
              </MDBBtn>
              <MDBBtn type="submit" color="primary">
                Save changes
              </MDBBtn>
            </MDBModalFooter>
          </form>
        </MDBModal>
      </Modal>
    );
  }
}
const mapStateToProps = state => ({
  subCategory: state.subCategory
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(SubCategoryActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubCategory);
