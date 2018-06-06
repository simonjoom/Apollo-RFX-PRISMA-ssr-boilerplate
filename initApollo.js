import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ApolloLink, split } from 'apollo-link'
import { withClientState } from 'apollo-link-state'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition, hasDirectives } from 'apollo-utilities'
import {
  InMemoryCache, defaultDataIdFromObject,
  IntrospectionFragmentMatcher
} from 'apollo-cache-inmemory'
import { getOperationAST } from 'graphql'
import { AUTH_TOKEN, PORTAPI } from './constants'
import gql from 'graphql-tag'
//import ApolloCacheRouter from 'apollo-cache-router'
import { makeExecutableSchema, forEachField } from 'graphql-tools'
import { onError } from 'apollo-link-error'

import { printIntrospectionSchema, buildASTSchema, graphql, parse } from 'graphql'

// const initiateState = {page: "HOME",__typename:'rfx'}

const components = {
  HOME: 'Home',
  LIST: 'List',
  VIDEOLIST: 'ListVideo',
  VIDEO: 'Video',
  PLAY: 'Video',
  ADMIN: 'Admin',
  LOGIN: 'Login',
  NOT_FOUND: 'NotFound'
}
const resolversold = {
  Query: {}
}
/* to use next ?? 
const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: {
    // eslint-disable-next-line id-match
    __schema: {
      types: [
        {
          kind: 'INTERFACE',
          name: "LocationState",
          possibleTypes: [
            { name: "LocationState" },
          ]
        }, {
          kind: 'INTERFACE',
          name: "location",
          possibleTypes: [
            { name: "LocationState" },
          ]
        }
      ]
    }
  }
});*/

const typeDefs = `

scalar Object

type Payload {
  ref:String,
  routesAdded:String
}

type State {
  title : String
  location: LocationState
  language : Language
  payload : Payload
  query : Object
  search : String
  page : String
  slug : String
  category : String
  playing:Boolean
  packages: [String]
  videosByCategory:Object
  videosHash:Object
}

type Language {
  locale :String
}

type LocationState {
  kind: String
  direction: String
  blocked: String
  basename:String
  hash:String
  key:String
  pathname: String
  entries: [Location!]
  type: String
  from: String
  ready: Boolean
  error: String
  payload: Payload
  query: Object
  search: String
  prev: Location
  universal: Boolean 
  url: String
}

type Location {
  hash: String
  basename: String
  location: LocSmall
  query : Object
  params: Object
  state: Object
  type : String
}

type LocSmall {
  url: String
  pathname: String
  search: String
  key: String
  scene: String
  index: Int
}

type Store {
  state : State
}
type Query {
  store : Store
  state : State
}

type Mutation{
  store(store: Store!) : Store
  updateNetworkStatus(isConnected: Boolean!) : Boolean
  setLocale(locale: String!): String
}

`
/*

  url: String
  pathname : String
  payload : Payload
  query: Object
  state(type: String!) : State

const schema = makeExecutableSchema({
  typeDefs:parse(typeDefs),
  resolvers: {
    ...resolversold
  }
});*/

const FETCH_STORE = gql`
  query getState{
    state @client {
      title
      location {
          pathname
          type
          payload
          query
          search
          prev
          entries
          kind
          universal 
          url 
      }
      language {
        locale
      }
      page
      category
      packages
      playing
      slug
      videosByCategory
      videosHash
    }
  }
`
/* add to state to activate UNION/INTERFACE
      __schema {
        types {
          kind
          name
          possibleTypes {
            name
          }
        }
      }*/


function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}
const removeObjType = function (object) {
  Object.keys(object).forEach(key => {
    if (object[key] && typeof key !== 'number' && typeof object[key] === 'object') // if the content id is simila
    {
      delete object[key].__typename
      removeObjType(object[key])
    }
  })
}
let tree = []
const addObjType = function (object, mytree = tree) {
  Object.keys(object).forEach(key => {
    if (object[key] && typeof key !== 'number' && typeof object[key] === 'object') // if the content id is simila
    {

      object[key].__typename = capitalizeFirstLetter(key)
      if (mytree.length > 0) {
        if (key == "location" && mytree.length == 1)
          object[key].__typename = "LocationState";
        if (key == "location" && mytree.length == 2)
          object[key].__typename = "LocSmall";
      }

      mytree.push(key)
      addObjType(object[key], mytree)
    }
  })
}

let client
const resolvers = {
  Mutation: {
    setLocale: (_, { locale }, { cache }) => {
      const databef = Object.assign({}, cache.readQuery({ query: FETCH_STORE })).state
      databef.language.locale = locale
      cache.writeQuery({ query: FETCH_STORE, data: { state: databef } })
    },
    store: (_, { store }, { cache }) => {
      const { state } = store
      console.log('storeStatebefore', state)
      /*
            stateout.state.__schema = {
              types: [{
                kind: 'INTERFACE',
                name: "LocationState",
                possibleTypes: [
                  { name: "LocationState" },
                ]
              },{
                kind: 'INTERFACE',
                name: "location",
                possibleTypes: [
                  { name: "LocationState" },
                ]
              }]
            }*/
      cache.writeQuery({ query: FETCH_STORE, data: { state } })
      return store
    },
    updateNetworkStatus: (_, { isConnected }, { cache }) => {
      cache.writeData({ data: { isConnected } })
      return null
    }
  }
}


const isSub = ({ query }) => {
  const { kind, operation } = getMainDefinition(query)
  return kind === 'OperationDefinition' && operation === 'subscription'
  // return query.definitions.filter(x => x.kind === 'OperationDefinition').some((x) => x.operation === 'subscription');
}


function create(link, logger, history) {



  //  TODO or not TODO?
  /* const netCache = new InMemoryCache();
  const localCache = new InMemoryCache();
  const cache = ApolloCacheRouter.override(
    ApolloCacheRouter.route([netCache, localCache], document => {
      if (hasDirectives(['client'], document) || getOperationAST(document).name.value === 'GeneratedClientQuery') {
        // Pass all @client queries and @client defaults to localCache
        return [localCache];
      } else {
        // Pass all the other queries to netCache
        return [netCache];
      }
    }),
    {
      reset: () => {
        // On apolloClient.resetStore() reset only netCache and keep localCache intact
        return netCache.reset();
      }
    }
  );*/

  const linkError = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`))
    }
    if (networkError) console.log(`[Network error]: ${networkError}`)
  })

  const cache = new InMemoryCache({
    dataIdFromObject: object => {
      switch (object.__typename) {
        case 'Product': return object.sku // use `sku` as the primary key
        default: return defaultDataIdFromObject(object) // fall back to default handling
      }
    }
  })

  console.log(parse(typeDefs))  //just do not delete useful to test if the types are working
  // const cacheSt = new InMemoryCache();
  const linkState = withClientState({
    defaults: {},
    resolvers,
    cache,
    typeDefs
  })
  const allLinks = logger ? [logger, linkState, link] : [linkState, link]

  client = new ApolloClient({
    //  connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    // link: link,
    link: ApolloLink.from(allLinks),
    cache
  })

  if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__)
  }
  client.getInitialState = () => {
    const obj = Object.assign({}, cache.readQuery({ query: FETCH_STORE }))
    removeObjType(obj)
    console.log(obj)
    return obj.state
  }


  client.saveStore = store => {
    tree = [];
    addObjType(store)

    console.log('dispatchstate', store)

    //some init to prevent apollo cache not complaining missing fields.

    if (!store.state.location.payload)
      store.state.location.payload = {}
    if (!store.state.location.pathname)
      store.state.location.pathname = ''
    if (!store.state.location.kind)
      store.state.location.kind = ''
    if (!store.state.location.search)
      store.state.location.search = ''
    if (!store.state.location.prev)
      store.state.location.prev = ''
    if (!store.state.location.entries)
      store.state.location.entries = []


    return client.mutate({
      mutation: gql`
          mutation store($store:Store) {
            store(store:$store) @client
          }
        `,
      variables: {
        store
      }
    })
  }
  client.getState = () => {
    const state = Object.assign({}, cache.readQuery({ query: FETCH_STORE }))
    console.log('queryState', state)
    return state.state
  }


  client.mydispatchpage = action => {
    console.log('dispatchactionhistorycall', action.type)

    return client.mutate({
      mutation: gql`
          mutation updatePage($type:String) {
            state(type:$type) @client
            {
              page
              type
              direction
              pathname
              universal
            }
          }
        `,
      variables: {
        type: action.type
      }
    })
  }

  return client
}

let apolloClient
export default function initApollo({ history }) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  const logger = new ApolloLink((operation, forward) => {
    console.log('middlewareloggerrun', operation)
    const obs = forward(operation)
    if (isSub({ query: operation.query })) {
      return obs
    }

    return obs.map(result => {
      console.log(`received result from ${operation.operationName}`, result)
      return result
    })
  })

  if (!process.browser) {
    const http = new HttpLink({
      uri: `http://localhost:${PORTAPI}`, // Server URL (must be absolute)
      credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
    })
    // if (!apolloClient)
    const apolloClient = create(http, logger, history)
    return apolloClient
  }

  const httpLink = new HttpLink({ uri: `http://localhost:${PORTAPI}`, credentials: 'same-origin' })


  const middlewareAuthLink = new ApolloLink((operation, forward) => {
    console.log('middlewarerun', operation)
    const token = localStorage.getItem(AUTH_TOKEN)
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
      headers: {
        authorization: authorizationHeader
      }
    })
    return forward(operation)
  })

  const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)

  const wsLink = new WebSocketLink({
    uri: `ws://localhost:${PORTAPI}/subscriptions`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem(AUTH_TOKEN)
      }
    }
  })
  const link = split(isSub, wsLink, httpLinkWithAuthToken)

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(link, logger, history)
  }

  return apolloClient
}
