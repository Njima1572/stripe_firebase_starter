import styled from "styled-components";
const Button = styled.button.attrs((props: any) => ({ ...props }))`
  border-radius: 6px;
  border: 0.5px solid gray;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer:
  padding: 4px 6px;
  background-color: ${(props) =>
    props.backgroundColor ? props.backgroundColor : "#AA00AA"};
  color: ${(props) => (props.color ? props.color : "#FFFFFF")};
  disabled: ${(props) => props.disabled}
`;

export default Button;
