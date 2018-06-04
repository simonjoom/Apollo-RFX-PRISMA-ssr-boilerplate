import { applyMiddleware, compose, combineReducers } from 'redux'
//import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction'
//import { apolloReducer } from 'apollo-cache-redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import { createRouter, createHistory } from 'rfx/core'
import {
  formatRoutes
} from 'rfx/utils'

import * as actionCreators from 'rfx/actions'
import languageReducer from './containers/LanguageProvider/reducer';

import initApollo from '../initApollo'
import routesdef from './routes'
import * as reducers from './reducers'


const randomString = () =>
  Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.')

const ActionTypes = {
  INIT: `@@redux/INIT${randomString()}`,
  REPLACE: `@@redux/REPLACE${randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
}

function isPlainObject(obj) {
  if (typeof obj !== 'object' || obj === null) return false

  let proto = obj
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto)
  }

  return Object.getPrototypeOf(obj) === proto
}

function createStore(reducer, preloadedState, client, enhancer) {
  if (typeof preloadedState === 'function' && typeof enhancer === 'undefined') {
    enhancer = preloadedState
    preloadedState = undefined
  }

  if (typeof enhancer !== 'undefined') {
    if (typeof enhancer !== 'function') {
      throw new Error('Expected the enhancer to be a function.')
    }

    return enhancer(createStore)(reducer, preloadedState, client)
  }

  if (typeof reducer !== 'function') {
    throw new Error('Expected the reducer to be a function.')
  }

  let currentReducer = reducer
  let currentState = preloadedState
  let currentListeners = []
  let isDispatching = false
  let firstdispatchdone = false;

  function getState() {
    if (isDispatching) {
      throw new Error(
        'You may not call store.getState() while the reducer is executing. ' +
        'The reducer has already received the state as an argument. ' +
        'Pass it down from the top reducer instead of reading it from the store.'
      )
    }
    //console.log("getState", currentState)
    return firstdispatchdone ? client.getState() : currentState
  }


  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(
        'Actions must be plain objects. ' +
        'Use custom middleware for async actions.'
      )
    }

    if (typeof action.type === 'undefined') {
      throw new Error(
        'Actions may not have an undefined "type" property. ' +
        'Have you misspelled a constant?'
      )
    }

    if (isDispatching) {
      throw new Error('Reducers may not dispatch actions.')
    }

    try {
      isDispatching = true
      currentState = currentReducer(currentState, action)
      if (client && action.type != ActionTypes.INIT) {
        console.log("dispatch", action, currentState)

        let storeApollo = JSON.parse(JSON.stringify({ state: currentState }))
        client.saveStore(storeApollo)
        firstdispatchdone = true;
      }
    } finally {
      isDispatching = false
    }

    return action
  }

  // When a store is created, an "INIT" action is dispatched so that every
  // reducer returns their initial state. This effectively populates
  // the initial state tree.
  dispatch({ type: ActionTypes.INIT })
  if (client)
    client.dispatch = dispatch;
  return {
    dispatch,
    getState
  }
}

export default (preloadedState, initialEntries) => {
  const withRedux = false;
  //const myformat = function () { }
  //  const routes = formatRoutes(routesdef, false)
  //  const history = createHistory(routesdef, { initialEntries, location: null, title: null, basenames: ['/foo', '/bar'] })
  //console.log(test)
  const options = { initialEntries, basenames: ['/foo', '/bar'] }
  // const client = initApollo({ history: history });

  const {
    reducer, middleware, firstRoute, ctx, history
  } = createRouter(
    routesdef,
    options
  )
  const client = initApollo({ history: history });

  if (!withRedux && preloadedState) {
    preloadedState = client.getInitialState();
  }

  const rootReducer = combineReducers({
    ...reducers,
    // apollo: apolloReducer,
    language: languageReducer,
    location: reducer
  })

  //console.log("loc", getLocation)
  let middlewares, store;
  middlewares = applyMiddleware(middleware)

  if (!withRedux) {
    store = createStore(rootReducer, preloadedState, client, middlewares)
  } else {
    let enhancers = composeEnhancers(middlewares)
    store = createStore(rootReducer, preloadedState, false, enhancers)
    if (module.hot && process.env.NODE_ENV === 'development') {
      module.hot.accept('./reducers/index', () => {
        const reducers = require('./reducers/index')
        const rootReducer = combineReducers({ ...reducers, location: reducer })
        store.replaceReducer(rootReducer)
      })
    }
  } 
  
  if (typeof window !== 'undefined') {
    window.routes = routesdef
    window.store = store
    window.hist = history
    window.actions = actionCreators
    window.ctx = ctx
  }

  return { store, firstRoute, client }
}

const composeEnhancers = (...args) =>
  typeof window !== 'undefined'
    ? composeWithDevTools({ actionCreators })(...args)
    : compose(...args)
