import React from 'react'
import './styles/App.scss'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import TelosCrewLogo from './assets/img/telos-crew-logo-trans-bg.png'
import { Main } from './scenes/Main'

function App() {
  return (
    <div className="App">
      <header>
        <img src={TelosCrewLogo} alt="Telos Crew logo" />
      </header>
      <div id="routerWrap">
        <Router>
          <div id="content">
            <Switch>
              <Route path="/">
                <Main />
              </Route>
            </Switch>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
