/* eslint-disable global-require */

import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo';
//import AppContainer from 'react-hot-loader/lib/AppContainer'
import configureStore from './configureStore';
import { Provider } from 'react-redux'
import App from './components/App'
import initApollo from '../initApollo'

const {store, firstRoute} = configureStore(window.REDUX_STATE)

const client = initApollo(store);

const root = document.getElementById('root');

const app = (
  <Provider store={store}>
    <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
  </Provider>);

const render = App => {
  //const renderMethod = !!module.hot ? ReactDOM.render : ReactDOM.hydrate
  if (root)
    ReactDOM.hydrate(app,
      root
    )
}

store
.dispatch(firstRoute())
.then(() => {
  render(App)
}).catch(console.log)
