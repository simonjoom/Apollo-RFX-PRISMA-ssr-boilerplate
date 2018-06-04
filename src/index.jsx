
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
//import AppContainer from 'react-hot-loader/lib/AppContainer'
import configureStore from './configureStore'
//import { Provider } from 'react-redux'
import App from './components/App'

import gql from 'graphql-tag'

// const {store, firstRoute,client} = configureStore(window.REDUX_STATE)
const withRedux = false;
let inits = (withRedux) ? window.REDUX_STATE : true;
const { store, firstRoute, client } = configureStore(inits)

const root = document.getElementById('root')

const app = (<ApolloProvider client={client}><App /></ApolloProvider>)

const render = App => {
  if (root) { return ReactDOM.hydrate(app, root) }
}

const route = firstRoute()
console.log('Willrenderapp', route)

try {
  store.dispatch(route).then(() => {
    //below is done already
    /* const state = store.getState()
     let storeApollo = JSON.parse(JSON.stringify({ state }))
     client.dispatch(storeApollo).then(() => {*/
    render(App)
    // })
  })
}
catch (error) {
  console.log(error)
}
