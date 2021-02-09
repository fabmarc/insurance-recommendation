import styled from 'styled-components';

const Root = styled.div`
  width: 580px;
  height: 380px;
  display: flex;
  background: aliceblue;
  flex-direction: column;
`;

const Wrapper = styled.div`
  margin: 16px;
  height: 100%;
  overflow: auto;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: auto;
  margin-bottom: 16px;
`;

const Title = styled.h1`
  margin: 16px;
  text-align: center;
`;

export { Root, Title, Wrapper, Content, Body };
