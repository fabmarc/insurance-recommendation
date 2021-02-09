import React from 'react';
import styled from 'styled-components';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Recommendation from './containers/Recommendation';
import NotFound from './containers/NotFound';
import Survey from './containers/Survey';
import Home from './containers/Home';

const Root = styled.main`
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default function App() {
  return (
    <Root>
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/survey" component={Survey} />
          <Route exact path="/recommendation" component={Recommendation} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Root>
  );
}
