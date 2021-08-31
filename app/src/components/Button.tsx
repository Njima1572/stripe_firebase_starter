import styled from "styled-components";

const base_background = "#AA00AA";

const Button = styled.button.attrs((props: any) => ({ ...props }))`
  border-radius: 4px;
  border: 0.5px solid gray;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  padding: 8px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : base_background};
  color: ${(props) => (props.color ? props.color : "#FFFFFF")};
  &:disabled {
    background-color: ${(props) =>
      props.backgroundColor ? props.backgroundColor : base_background + "88"};
  }
  &:hover {
    background-color: ${(props) =>
      props.backgroundColor
        ? props.backgroundColor + "CC"
        : base_background + "CC"};
  }
`;

export default Button;
