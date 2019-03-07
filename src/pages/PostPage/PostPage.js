import React, { Component, Fragment } from "react";
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
    uploadedFiles: []
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
  };

  async componentDidMount() {
    const { getPostRequest } = this.props;

    getPostRequest();

    const response = await api.get("category");
    this.setState({ category: response.data });
  }

  handleDeletePost = async id => {
    await api.delete(`post/${id}`);
    const { getPostRequest } = this.props;
    getPostRequest();
  };
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
      uploadedFiles
    } = this.state;

    return (
      <Container>
        <Modal>
          <MDBBtn
            color="primary"
            onClick={() => {
              openPostModal();
              this.handleClear();
            }}
          >
            Cadastrar Nova Publicação
          </MDBBtn>

          <MDBModal isOpen={post.PostModalOpen} toggle={closePostModal}>
            <MDBModalHeader toggle={closePostModal}>
              Cadastrar Nova Publicação
            </MDBModalHeader>
            <form
              className="needs-validation"
              onSubmit={this.handleCreatePost}
              noValidate
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
                  onClick={() => {
                    closePostModal();
                    this.handleClear();
                  }}
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
                            <td>{post.type}</td>
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
                                tooltipContent="Excluir a Postagem"
                              >
                                <MDBBtn
                                  size="sm"
                                  color="danger"
                                  onClick={() => this.handleDeletePost(post.id)}
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
