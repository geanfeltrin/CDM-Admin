import React, { Component } from "react";
import Dropzone from "react-dropzone";

import { DropContainer, UploadMessage } from "./styles";

export default class ImgDropAndCrop extends Component {
  renderDragMessage = (isDragActive, isDragReject) => {
    if (!isDragActive) {
      return <UploadMessage>{this.props.message}</UploadMessage>;
    }
    if (isDragReject) {
      return <UploadMessage type="error">Arquivo não suportado</UploadMessage>;
    }
    return <UploadMessage type="success">Solte os arquivos aqui</UploadMessage>;
  };

  render() {
    const { onUpload, backgroundColor, accept } = this.props;
    return (
      <Dropzone
        accept={accept ? accept : "image/*"}
        onDropAccepted={onUpload}
        multiple={false}
      >
        {({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
          <DropContainer
            {...getRootProps()}
            isDragActive={isDragActive}
            isDragReject={isDragReject}
            backgroundColor={backgroundColor}
          >
            <input {...getInputProps()} />
            {this.renderDragMessage(isDragActive, isDragReject)}
          </DropContainer>
        )}
      </Dropzone>
    );
  }
}
