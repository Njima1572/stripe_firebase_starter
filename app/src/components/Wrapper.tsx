import styled from "styled-components";
const Wrapper = styled.div.attrs((props: { orientation: string }) => ({
  ...props,
}))`
  width: 100%;
  min-height: 100px;
  display: flex;
  flex-direction: ${({ orientation }) => orientation};
  justify-content: space-around;
  align-items: center;
  border: 1px solid black;
  border-radius: 8px;
  background-color: #efefef;
`;

export default Wrapper;
