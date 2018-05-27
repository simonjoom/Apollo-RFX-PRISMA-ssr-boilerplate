import { createStore, applyMiddleware, compose, combineReducers } from 'redux'
//import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
import { apolloReducer } from 'apollo-cache-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { createRouter } from 'rfx/core'
import * as actionCreators from 'rfx/actions'
import languageReducer from './containers/LanguageProvider/reducer';

import routes from './routes'
import * as reducers from './reducers'

export default (preloadedState, initialEntries) => {
  const options = { initialEntries, basenames: ['/foo', '/bar'] }
  const {
    reducer, middleware, firstRoute, history, ctx
  } = createRouter(
    routes,
    options
  )

  const rootReducer = combineReducers({ ...reducers,
    apollo: apolloReducer,
    language: languageReducer,
    location: reducer })
  const middlewares = applyMiddleware(middleware)
  const enhancers = composeEnhancers(middlewares)
  const store = createStore(rootReducer, preloadedState, enhancers)

  if (module.hot && process.env.NODE_ENV === 'development') {
    module.hot.accept('./reducers/index', () => {
      const reducers = require('./reducers/index')
      const rootReducer = combineReducers({ ...reducers, location: reducer })
      store.replaceReducer(rootReducer)
    })
  }

  if (typeof window !== 'undefined') {
    window.routes = routes
    window.store = store
    window.hist = history
    window.actions = actionCreators
    window.ctx = ctx
  }

  return { store, firstRoute }
}

const composeEnhancers = (...args) =>
  typeof window !== 'undefined'
    ? composeWithDevTools({ actionCreators })(...args)
    : compose(...args)
