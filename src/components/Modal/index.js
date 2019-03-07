import React from "react";
import {
  MDBContainer,
  MDBBtn,
  MDBModal,
  MDBModalBody,
  MDBModalHeader,
  MDBModalFooter
} from "mdbreact";

const Modal = ({ props, children, size, title }) => (
  <MDBContainer>{children}</MDBContainer>
);

export default Modal;
