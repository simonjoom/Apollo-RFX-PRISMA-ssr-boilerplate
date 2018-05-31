import { ApolloClient } from 'apollo-client'
import { HttpLink } from 'apollo-link-http'
import { ReduxCache } from 'apollo-cache-redux';
import { ApolloLink, split } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition, hasDirectives } from 'apollo-utilities'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { getOperationAST } from 'graphql'
import { AUTH_TOKEN, PORTAPI } from './constants'
import ApolloCacheRouter from 'apollo-cache-router';

//const initiateState = {page: "HOME",__typename:'rfx'}

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
const resolvers = {
  /* Query: {
     page: (_, arg, {cache}) => {
        console.log("ff",cache.data)
        return {page: components[cache.data.data.page], __typename: 'rfx'};
     }
   },*/
  /*Query: {
    state: (_, { type }, { cache }) => {
     // console.log("updatePage",cache.data)
      return null;
    }
  },*/
  Mutation: {
    state: (_, { type }, { cache }) => {
      const data = { state: { page: components[type],type: type, __typename: 'rfx' } };
      cache.writeData({ data });
      return data;
    }
  },
  Mutation: {
    updateNetworkStatus: (_, { isConnected }, { cache }) => {
      cache.writeData({ data: { isConnected } });
      return null;
    }
  }
}

const isSub = ({ query }) => {
  const { kind, operation } = getMainDefinition(query);
  return kind === "OperationDefinition" && operation === "subscription";
  //return query.definitions.filter(x => x.kind === 'OperationDefinition').some((x) => x.operation === 'subscription');
}

function create(link, logger, initiateState) {
  console.log(initiateState)
  //initiateState.updatePage=null;
  //initiateState.page=null;
  /*const initiateState = process.browser ? window.__APOLLO_STATE__ : {
    isConnected: true
  }*/
  let state = process.browser ? window.__APOLLO_STATE__ : initiateState;

  /*const netCache = new InMemoryCache();
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
  const cache = new InMemoryCache();
  console.log("logger", logger)
  const linkState = withClientState({
    defaults: state,
    resolvers,
    cache: cache
  });
  const allLinks = logger ? [logger, linkState, link] : [linkState, link];

  const client = new ApolloClient({
    //  connectToDevTools: process.browser,
    ssrMode: !process.browser, // Disables forceFetch on the server (so queries are only run once)
    //link: link,
    link: ApolloLink.from(allLinks)
    , cache: cache
  })
  if (typeof window !== 'undefined' && window.__APOLLO_STATE__) {
    cache.restore(window.__APOLLO_STATE__);
  }
  return client;
}

let apolloClient;
export default function initApollo(initiateState) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  const logger = new ApolloLink((operation, forward) => {
    console.log("middlewareloggerrun", operation);
    const obs = forward(operation);
    if (isSub({ query: operation.query })) {
      return obs;
    }

    return obs.map((result) => {
      console.log(`received result from ${operation.operationName}`, result);
      return result;
    })
  });

  if (!process.browser) {
    const http = new HttpLink({
      uri: `http://localhost:${PORTAPI}`, // Server URL (must be absolute)
      credentials: 'same-origin' // Additional fetch() options like `credentials` or `headers`
    });
    return create(http, logger, initiateState)
  }

  const httpLink = new HttpLink({ uri: `http://localhost:${PORTAPI}`, credentials: 'same-origin' })


  const middlewareAuthLink = new ApolloLink((operation, forward) => {
    console.log("middlewarerun", operation)
    const token = localStorage.getItem(AUTH_TOKEN)
    const authorizationHeader = token ? `Bearer ${token}` : null
    operation.setContext({
      headers: {
        authorization: authorizationHeader,
      },
    })
    return forward(operation)
  });

  const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

  const wsLink = new WebSocketLink({
    uri: `ws://localhost:${PORTAPI}/subscriptions`,
    options: {
      reconnect: true,
      connectionParams: {
        authToken: localStorage.getItem(AUTH_TOKEN),
      },
    }
  });
  const link = split(isSub, wsLink, httpLinkWithAuthToken);

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(link, logger, initiateState)
  }

  return apolloClient
}