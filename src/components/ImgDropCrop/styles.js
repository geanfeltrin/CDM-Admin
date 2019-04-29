import styled, { css } from "styled-components";

const dragActive = css`
  border-color: #78e5d5;
`;
const dragReject = css`
  border-color: #e57878;
`;

const backgroundColor = {
  default: "#999",
  download: "aliceblue",
  thumbnail: "ghostwhite"
};

export const DropContainer = styled.div.attrs({
  className: "dropzone"
})`
  border: 1px dashed #ddd;
  border-radius: 4px;
  cursor: pointer;

  transition: height 0.2s ease;
  margin: auto;
  display: flex;
  height: 100px;
  width: 100%;
  background-color: ${props =>
    backgroundColor[props.backgroundColor || "default"]};
  ${props => props.isDragActive && dragActive};
  ${props => props.isDragReject && dragReject};
`;

const messageColors = {
  default: "#999",
  error: "#e57878",
  success: "#78e5d5"
};

export const UploadMessage = styled.p`
  display: flex;
  color: ${props => messageColors[props.type || "default"]};
  justify-content: center;
  align-items: center;
  padding: 20px;
  margin-bottom: 0;
  text-align: center;
`;
