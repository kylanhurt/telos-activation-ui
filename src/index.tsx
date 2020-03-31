import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css'
import { createStore, applyMiddleware, compose, } from 'redux'
import { rootReducer } from './redux/reducers'
import { Provider } from 'react-redux'
import createSagaMiddleware from 'redux-saga'
import invoiceTxSaga from './redux/sagas/invoiceTxSaga'

const middleware = []
const enhancers = []
const sagaMiddleware = createSagaMiddleware()
middleware.push(sagaMiddleware)

enhancers.push(applyMiddleware(...middleware))

const composeEnhancers = window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'] as typeof compose || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(...enhancers),
)

sagaMiddleware.run(invoiceTxSaga)

ReactDOM.render(
  <React.StrictMode>
     <Provider store={store}>
       <App />
     </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
