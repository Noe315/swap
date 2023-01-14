import styled from 'styled-components/macro';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  border: 1px solid;
  ${'' /* width: ${props => (props.style ? props.style : '64vw')}; */}
  width: 53vw;
  margin: 3vw auto;
  border-radius: 20px;
  background-color: rgba(33,37,41);
  border-color: gray;
`;

export default function BoxWrapper(props) {
  // return <Wrapper width={props.style} >{props.children}</Wrapper>
  return <Wrapper>{props.children}</Wrapper>
}