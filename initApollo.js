import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ReduxCache } from 'apollo-cache-redux';
import { ApolloLink, split } from 'apollo-client-preset'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
//import { InMemoryCache } from 'apollo-cache-inmemory'
import { AUTH_TOKEN ,PORTAPI } from './constants'

let apolloClient = null

function create(store, link) {
  return new ApolloClient({
    connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    link: link,
    cache: new ReduxCache({store})
    //new InMemoryCache().restore(initialState || {})
  })
}

export default function initApollo(store) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!process.browser) {
    return create(store, new HttpLink({
      uri: `http://localhost:${PORTAPI}`, // Server URL (must be absolute)
      credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
    }))
  }
  
  const httpLink = new HttpLink({uri: `http://localhost:${PORTAPI}`})
  
  const middlewareAuthLink = new ApolloLink((operation, forward) => {
    const token = localStorage.getItem(AUTH_TOKEN)
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
      headers: {
        authorization: authorizationHeader,
      },
    })
    return forward(operation)
  })
  
  const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink)
  
  const wsLink = new WebSocketLink({
    uri: `ws://localhost:${PORTAPI}/subscriptions`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem(AUTH_TOKEN),
      },
    }
  })
  
  const link = split(
    ({query}) => {
      const {kind, operation} = getMainDefinition(query)
      return kind === 'OperationDefinition' && operation === 'subscription'
    },
    wsLink,
    httpLinkWithAuthToken,
  )
  
  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(store, link)
  }
  
  return apolloClient
}