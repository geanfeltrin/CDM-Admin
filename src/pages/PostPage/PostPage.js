import React, { Component } from "react";
import PropTypes from "prop-types";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import PostActions from "../../store/ducks/post";

import api from "../../services/api";
import Select from "react-select";
import { uniqueId } from "lodash";
import filesize from "filesize";

import ImgDropAndCrop from "../../components/ImgDropCrop";
import FileList from "../../components/FileList";

import imgDefault from "../../assets/default.jpeg";

import { Container } from "./styles";
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

import Modal from "../../components/Modal";

class Posts extends Component {
  static propTypes = {
    getPostRequest: PropTypes.func.isRequired,
    openPostModal: PropTypes.func.isRequired,
    createPostRequest: PropTypes.func.isRequired
  };
  state = {
    postTitle: "",
    postDescription: "",
    postUrl: "",
    PostType: [{ id: 0, name: "public" }, { id: 1, name: "privado" }],
    category: "",
    subCategory: null,
    selectedCategory: null,
    selectedSubCategory: "",
    selectedType: "",
    uploadedFiles: [],
    modalUpdate: false,
    modalTitle: "",
    modalDescription: "",
    modalUrl: "",
    modalType: "",
    modalFile: [],
    modalSubcategories: [],
    modalDelete: false,
    modalName: ""     
    
  };

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleCreatePost = e => {
    e.preventDefault();
    e.target.className += " was-validated";

    const { createPostRequest } = this.props;
    const {
      postTitle,
      postDescription,
      postUrl,
      selectedSubCategory,
      uploadedFiles,
      selectedType
    } = this.state;

    const [uploadedFilesId] = uploadedFiles;
    if (uploadedFilesId === null) {
      uploadedFilesId.id = "";
    }

    const title = postTitle;
    const description = postDescription;
    const url = postUrl;
    const sub_category_id = selectedSubCategory.id;
    const file_id = uploadedFilesId.id;
    const type_post = selectedType.name;

    console.log(title, description, url, sub_category_id, file_id, type_post);
    createPostRequest(
      title,
      description,
      url,
      file_id,
      sub_category_id,
      type_post
    );
    this.setState({
      postTitle: "",
      postDescription: "",
      postUrl: "",
      selectedCategory: null,
      selectedSubCategory: null,
      uploadedFiles: [],
      selectedType: null
    })
  };

  handleChangeCategory = selectedCategory => {
    this.setState({
      selectedCategory,
      subCategory: selectedCategory.subCategories,
      selectedSubCategory: null
    });
  };

  handleChangeSubCategory = selectedSubCategory => {
    this.setState({
      selectedSubCategory
    });
  };
  handleChangeType = selectedType => {
    this.setState({
      selectedType
    });
  };
  handleUpload = files => {
    const uploadedFiles = files.map(file => ({
      file,
      id: uniqueId(),
      name: file.name,
      readableSize: filesize(file.size),
      preview: URL.createObjectURL(file),
      progress: 0,
      uploaded: false,
      error: false,
      url: null
    }));

    this.setState({
      uploadedFiles: this.state.uploadedFiles.concat(uploadedFiles)
    });
    uploadedFiles.forEach(this.processUpload);
  };
  updateFile = (id, data) => {
    this.setState({
      uploadedFiles: this.state.uploadedFiles.map(uploadedFile => {
        return id === uploadedFile.id
          ? { ...uploadedFile, ...data }
          : uploadedFile;
      })
    });
  };

  processUpload = uploadedFiles => {
    const data = new FormData();

    data.append("file", uploadedFiles.file, uploadedFiles.name);

    api
      .post("files", data, {
        onUploadProgress: e => {
          const progress = parseInt(Math.round((e.loaded * 100) / e.total));

          this.updateFile(uploadedFiles.id, {
            progress
          });
        }
      })
      .then(response => {
        this.updateFile(uploadedFiles.id, {
          uploaded: true,
          id: response.data.id,
          url: response.data.url
        });
      })
      .catch(response => {
        this.updateFile(uploadedFiles.id, {
          error: true
        });
      });
  };

  handleDeleteFile = async id => {
    await api.delete(`files/${id}`);
    this.setState({
      uploadedFiles: this.state.uploadedFiles.filter(file => file.id !== id)
    });
  };

  handleDeletePost = async id => {
    await api.delete(`post/${id}`);
    const { getPostRequest } = this.props;
    getPostRequest();
    this.setState({
      modalDelete: !this.state. modalDelete
    })
  };

  async componentDidMount() {
    const { getPostRequest } = this.props;

    getPostRequest();

    const response = await api.get("category");
    this.setState({ category: response.data });
  }

 
  handleClear = () => {
    const [uploadedFilesId] = this.state.uploadedFiles;
    if (this.state.uploadedFiles.length > 0) {
      const Files = uploadedFilesId.id;
      console.log(Files);
      this.handleDeleteFile(Files);
    }
    this.setState({
      postTitle: "",
      postDescription: "",
      postUrl: "",
      selectedCategory: null,
      selectedSubCategory: null,
      uploadedFiles: [],
      selectedType: null
    });
  };

  handleUpdatePost = async id =>{
    await api.put(`post/${id}`,{
      title: this.state.modalTitle,
      description: this.state.modalDescription,
      url: this.state.modalUrl      
    })
  }

  toggleUpdate = (title, id, description, url, file, subCategories, type) => {    
    this.setState({
      modalUpdate: !this.state.modalUpdate,
      modalTitle: title,
      modalId: id,
      modalDescription: description,
      modalUrl: url,
      modalFile: file,
      modalSubcategories: subCategories,
      modalType: type   
    });  
    
  };
  toggleDelete = (name, id) => {
    this.setState({
      modalDelete: !this.state. modalDelete,
      modalId: id,
      modalName: name
    })
  }
  render() {
    const { post, openPostModal, closePostModal } = this.props;
    const {
      postTitle,
      PostType,
      postUrl,
      postDescription,
      category,
      subCategory,
      selectedCategory,
      selectedType,
      selectedSubCategory,
      uploadedFiles,
      modalUpdate,
      modalTitle,
      modalId,
      modalDescription,
      modalUrl,
      modalFile,
      modalSubcategories,
      modalType,
      modalDelete,
      modalName
    } = this.state;

    return (
      <Container>
        <Modal>
          <MDBBtn
            color="primary"
            onClick={openPostModal}   
                    >
            Cadastrar Nova Publicação
          </MDBBtn>

          <MDBModal isOpen={post.PostModalOpen} toggle={closePostModal}>
            <MDBModalHeader toggle={closePostModal}>
              Cadastrar Nova Publicação
            </MDBModalHeader>
            <form              
              onSubmit={this.handleCreatePost}              
            >
              <MDBModalBody>
                <MDBInput
                  label="Digite o titulo da postagem"
                  type="text"
                  name="postTitle"
                  value={postTitle}
                  onChange={this.handleInputChange}
                  id="postTitleId"
                  className="form-control"
                  outline
                  required
                />
                <div className="invalid-feedback">
                  Você precisa informar um Username Válido!
                </div>
                <div className="valid-feedback">Looks good!</div>
                <MDBInput
                  label="Digite a descrição da postagem"
                  name="postDescription"
                  type="text"
                  value={postDescription}
                  onChange={this.handleInputChange}
                  id="postDescriptionId"
                  className="form-control"
                  outline
                  required
                />
                <div className="invalid-feedback">
                  Você precisa informar um Username Válido!
                </div>
                <div className="valid-feedback">Looks good!</div>
                <Select
                  options={PostType}
                  getOptionLabel={PostType => PostType.name}
                  getOptionValue={PostType => PostType.id}
                  value={selectedType}
                  onChange={this.handleChangeType}
                  placeholder={"Status da publicação"}
                  className={"mb-3"}
                  isRequired
                  required
                />
                <Select
                  options={category}
                  getOptionLabel={category => category.name}
                  getOptionValue={category => category.id}
                  value={selectedCategory}
                  onChange={this.handleChangeCategory}
                  placeholder={"Selecione a Categoria"}
                  className={"mb-3"}
                  isRequired
                  required
                />
                {subCategory && (
                  <div>
                    <Select
                      options={subCategory}
                      getOptionLabel={subCategory => subCategory.name}
                      getOptionValue={subCategory => subCategory.id}
                      value={selectedSubCategory}
                      onChange={this.handleChangeSubCategory}
                      placeholder={"Selecione a Sub-Categoria"}
                      isRequired
                      required
                    />
                  </div>
                )}

                <MDBInput
                  label="Digite o link para o download"
                  type="text"
                  name="postUrl"
                  value={postUrl}
                  onChange={this.handleInputChange}
                  id="postUrlId"
                  placeholder="Digite o link para o download"
                  className="form-control"
                  outline
                  required
                />
                <MDBCol>
                  {!!uploadedFiles.length < 1 && (
                    <ImgDropAndCrop onUpload={this.handleUpload} />
                  )}

                  {!!uploadedFiles.length && (
                    <FileList
                      files={uploadedFiles}
                      onDelete={this.handleDeleteFile}
                    />
                  )}
                </MDBCol>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn
                  color="secondary"
                  onClick={closePostModal}  
             
                >
                  Close
                </MDBBtn>

                <MDBBtn
                  type="submit"
                  disabled={
                    selectedSubCategory &&
                    !!uploadedFiles.length &&
                    postTitle &&
                    postUrl &&
                    postDescription
                      ? false
                      : true
                  }
                  color="primary"
                >
                  Save changes
                </MDBBtn>
              </MDBModalFooter>
            </form>
          </MDBModal>
        </Modal>
        <MDBRow>
          <MDBCol md="12">
            <MDBCard className="mt-5">
              <MDBCardBody>
                <MDBTable>
                  <MDBTableHead color="primary-color" textWhite>
                    <tr>
                      <th className="text-center">#</th>
                      <th className="text-center">Titulo</th>
                      <th className="text-center">Sub Categorias</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Imagem</th>
                      <th className="text-center">Link Download</th>
                      <th className="text-center">Editar</th>
                      <th className="text-center">Excluir Publicação</th>
                    </tr>
                  </MDBTableHead>
                  {post.data.map(post => {
                    if (post) {
                      return (
                        <MDBTableBody key={post.id}>
                          <tr className="text-center">
                            <th>{post.id}</th>
                            <td>{post.title}</td>
                            <td>{post.subcategories.name}</td>
                            <td>
                              <MDBBadge
                                color={
                                  post.type === "public" ? "success" : "danger"
                                }
                              >
                                {post.type}
                              </MDBBadge>
                            </td>
                            <td>
                              {post.file_id === null ? (
                                <img
                                  src={imgDefault}
                                  alt="thumbnail"
                                  className="img-thumbnail mx-auto d-block"
                                />
                              ) : (
                                <img
                                  src={post.file.url}
                                  alt="thumbnail"
                                  className="img-thumbnail mx-auto d-block"
                                />
                              )}
                            </td>
                            <td>
                              <a href={post.url} alt={post.title}>
                                <MDBIcon icon="link" className="mr-1" />
                              </a>
                            </td>
                            <td>
                              <MDBTooltip
                                placement="left"
                                tag="div"
                                tooltipContent="Editar a Postagem"
                              >
                                <MDBBtn
                                  size="sm"
                                  color="info"
                                  onClick={() =>
                                    this.toggleUpdate(post.title, post.id, post.description, post.url, post.file, post.subCategories, post.type)
                                  }
                                >
                                  <MDBIcon icon="edit" className="mr-1" />
                                </MDBBtn>
                              </MDBTooltip>
                            </td>
                            <td>
                              <MDBTooltip
                                placement="left"
                                tag="div"
                                tooltipContent="Excluir a Postagem"
                              >
                                <MDBBtn
                                  size="sm"
                                  color="danger"
                                  onClick={() => this.toggleDelete(post.title, post.id)}
                                >
                                  <MDBIcon icon="trash-alt" className="mr-1" />
                                </MDBBtn>
                              </MDBTooltip>
                            </td>
                          </tr>
                        </MDBTableBody>
                      );
                    } else return null;
                  })}
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
        {/* INICIO  modal para Editar */}
        {modalUpdate && (
          <Modal>
            <MDBModal isOpen={modalUpdate} toggle={this.toggleUpdate}>
              <MDBModalHeader toggle={this.toggleUpdate}>
                Editar a Postagem "{modalTitle}"
              </MDBModalHeader>
              <form
                className="needs-validation"
                onSubmit={() => this.handleUpdatePost(modalId)}
                noValidate
              >
                <MDBModalBody>
                  <MDBInput
                    label="Altere o Título"
                    type="text"
                    name="modalTitle"
                    value={modalTitle}
                    onChange={this.handleInputChange}
                    id="modalTitleId"
                    className="form-control"
                    outline
                    required
                  />
                  <div className="invalid-feedback">
                    Você precisa informar um Título Válido!
                  </div>
                  <MDBInput
                    label="Altere a Descrição"
                    type="text"
                    name="modalDescription"
                    value={modalDescription}
                    onChange={this.handleInputChange}
                    id="modalDescriptionId"
                    className="form-control"
                    outline
                    required
                  />
                  <div className="invalid-feedback">
                    Você precisa informar uma Descrição Válido!
                  </div>
                  <MDBInput
                    label="Altere o link"
                    type="text"
                    name="modalUrl"
                    value={modalUrl}
                    onChange={this.handleInputChange}
                    id="modalUrlId"
                    className="form-control"
                    outline
                    required
                  />
                  <div className="invalid-feedback">
                    Você precisa informar uma Descrição Válido!
                  </div>
                  {/* <Select
                  options={PostType}                  
                  getOptionLabel={PostType => PostType.name}
                  getOptionValue={PostType => PostType.id}
                  value={selectedType}
                  onChange={this.handleChangeType}
                  placeholder={"Status da publicação"}
                  className={"mb-3"}
                  isRequired
                  required
                /> */}
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
        {/* INICIO modal para deletar */}
        {modalDelete && (
          <Modal>
            <MDBModal isOpen={modalDelete} toggle={this.toggleDelete}>
              <MDBModalHeader toggle={this.toggleDelete}>
                Apagar a categoria "{modalName}"
              </MDBModalHeader>
              <MDBModalBody>
                <span>
                  Você deseja deletar a publicação <strong>"{modalName}"</strong>
                  ?
                </span>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn onClick={this.toggleDelete} color="secondary">
                  Não
                </MDBBtn>
                <MDBBtn
                  color="primary"
                  onClick={() => this.handleDeletePost(modalId)}
                >
                  Sim
                </MDBBtn>
              </MDBModalFooter>
            </MDBModal>
          </Modal>
        )}
        {/*FIM  modal para deletar */}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  post: state.post
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(PostActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Posts);
