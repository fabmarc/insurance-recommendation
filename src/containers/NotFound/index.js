import React from 'react';
import { Link } from 'react-router-dom';
import { Root, Wrapper, Title } from '../../components';

export default function Home() {
  return (
    <Root>
      <Title>Not Found</Title>
      <Wrapper>
        <Link to="/">Home</Link>
      </Wrapper>
    </Root>
  );
}
