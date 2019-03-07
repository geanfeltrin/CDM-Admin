import React from "react";
import { MDBContainer } from "mdbreact";

const Modal = ({ props, children, size, title }) => (
  <MDBContainer>{children}</MDBContainer>
);

export default Modal;
