import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import * as reactRouterRedux from 'react-router-redux';
import { createBrowserHistory } from 'history';
import configureStore from './store/configureStore';

// REACT PAGES GET IMPORTED RIGHT HERE AND ROUTES GET SETUP BELOW
import Homepage from './pages/homePage.jsx';

const store = configureStore();
const history = reactRouterRedux.syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Switch>
        <Route exact={true} path="/" component={Homepage} />
      </Switch>
    </Router>
  </Provider>,
    document.getElementById('appContent'),
);
