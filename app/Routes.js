import React from 'react';
import { Switch, Route, Link } from "react-router-dom";

import routes from './constants/routes';
import App from './containers/App';
// import HomePage from './containers/HomePage';
import CounterPage from './containers/CounterPage';

export default () => (
  <App>
    <Switch>
      <Route path={routes.COUNTER} render={() => <CounterPage/> } />
      <Route path={routes.HOME} render={() => <CounterPage/> } />
    </Switch>
  </App>
);
