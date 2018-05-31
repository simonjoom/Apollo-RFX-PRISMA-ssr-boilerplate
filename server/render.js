import React from 'react'
import ReactDOM from 'react-dom/server'
import { renderToNodeStream } from 'react-dom/server';
import { Provider } from 'react-redux'
import { flushChunkNames, clearChunks } from 'react-universal-component/server'
import flushChunks from 'webpack-flush-chunks'
import { ReduxCache } from 'apollo-cache-redux';
import configureStore from './configureStore'
import initApollo from '../initApollo'
import App from '../src/components/App'
import { ApolloProvider, getDataFromTree } from 'react-apollo'

const DEV = process.env.NODE_ENV === 'development';
function wrapAsync(fn) {
  if (DEV) {
    return function (req, res, next) {
      // Make sure to `.catch()` any errors and pass them along to the `next()`
      // middleware in the chain, in this case the error handler.
      fn(req, res, next).catch(next);
    };
  } else {
    return fn;
  }
}

export default ({ clientStats, serverStats }) => wrapAsync(async (req, res) => {
  const { store, client } = await configureStore(req, res)
  // } catch (e) {
  //   return next('Unexpected error occurred', e);
  // }
  if (!store) return // no store means redirect was already served

  // let client = initApollo();

  const isDev = process.env.NODE_ENV === 'development';
  const myApp = createApp(App, client, store)

  getDataFromTree(myApp).then(() => {
    const appString = ReactDOM.renderToString(myApp, (err, html) => {
      if (err) {
        console.error('Error in renderToString:', err);
        return res.status(500).send('Internal Server Error');
      }
      console.log("sendres")
      res.send(html);
    });

    const state = store.getState();
    let serverState = Object.assign(
      state
      // {apollo: {data: client.cache.extract()}}
    );

    let serverState2 = client.cache.extract();

    console.log("initialStateapp", serverState)

    const stateJson = JSON.stringify(serverState)
    const stateJson2 = JSON.stringify(serverState2)
    //clearChunks()

    const chunkNames = flushChunkNames()
    console.log("chunkNames", chunkNames)
    const { js, styles, cssHash } = flushChunks(clientStats, { chunkNames });
    let vd = clientStats.assetsByChunkName['vendors'];
    let vd2 = clientStats.assetsByChunkName['runtime~main'];
    //console.log(serverStats);
    //stateJson[chunkNames]="page/Video~page/Video2";

    vd = (typeof vd === 'string') ? vd : (vd ? vd[0] : vd);
    vd2 = (typeof vd2 === 'string') ? vd2 : (vd2 ? vd2[0] : vd2);

    const vendor = vd ? "<script type='text/javascript' src='/static/" + vd + "'></script>" : "<script type='text/javascript' src='/static/vendors.js'></script>";

    const runtime = vd2 ? "<script type='text/javascript' src='/static/" + vd2 + "'></script>" : "";

    console.log('REQUESTED PATH:', req.path)
    console.log('CHUNK NAMES RENDERED', chunkNames)
    res.status(200);
    res.send(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${state.title}</title>
          <link charset="utf-8" type="text/css" rel="stylesheet" href="/staticssr/vendor.css">
          ${styles}
        </head>
        <body>
          <script>window.REDUX_STATE = ${stateJson};window.__APOLLO_STATE__ = ${stateJson2}</script>
          <div id="root">${appString}</div>
          ${cssHash}
          ${runtime}
          ${js}
          ${vendor}
        </body>
      </html>`)
    return res.end();
  })
})

const createApp = (App, client, store) => (
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>
)

