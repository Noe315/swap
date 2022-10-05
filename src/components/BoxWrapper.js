import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid;
  ${'' /* width: ${props => (props.style ? props.style : '64vw')}; */}
  width: 64vw;
  margin: 10vw auto;
  border-radius: 20px;
`;

export default function BoxWrapper(props) {
  // return <Wrapper width={props.style} >{props.children}</Wrapper>
  return <Wrapper>{props.children}</Wrapper>
}