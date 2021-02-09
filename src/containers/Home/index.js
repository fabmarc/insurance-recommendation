import React from 'react';
import { Link } from 'react-router-dom';
import { Root, Wrapper, Title } from '../../components';

export default function Home() {
  return (
    <Root>
      <Title>Home</Title>
      <Wrapper>
        <Link to="/survey">Get your Insurance Recommendation</Link>
      </Wrapper>
    </Root>
  );
}
