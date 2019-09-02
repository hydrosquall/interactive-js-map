import React from 'react';
import { Switch, Route, Link } from "react-router-dom";

import routes from './constants/routes';
import App from './containers/App';

import PageDependencyTree from './components/PageDependencyTree';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} render={() => <PageDependencyTree/> } />
    </Switch>
  </App>
);
