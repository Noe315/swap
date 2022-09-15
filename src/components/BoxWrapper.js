import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid;
  width: 64vw;
  margin: 10vw auto;
  border-radius: 20px;
`;

export default function BoxWrapper(props) {
  return <Wrapper>{props.children}</Wrapper>
}