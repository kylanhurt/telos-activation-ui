import React from 'react';
import './styles/App.less';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { Main } from './scenes/Main'

function App() {
  return (
    <div className="App">
      <Router>
        <div id="routerWrap">
          <Switch>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
