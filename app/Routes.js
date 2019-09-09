import React from 'react';
import { Switch, Route, Link } from "react-router-dom";

import routes from './constants/routes';
import App from './containers/App';

import PageDependencyTree from './components/PageDependencyTree';
import PageFileTree from './components/PageFileTree';

export default () => (
  <App>
    <Switch>
      <Route path={routes.HOME} exact={true} render={() => <PageDependencyTree />} />
      <Route path={routes.FILETREE} render={() => <PageFileTree />} />
    </Switch>
  </App>
);
