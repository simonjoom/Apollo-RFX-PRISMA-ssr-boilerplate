import '@babel/polyfill'
import path from 'path'
import express from 'express'
import favicon from 'serve-favicon'
import webpack from 'webpack'
import { AUTH_TOKEN, PORTAPI, PORT } from '../constants'

const chalk = require('chalk');
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import webpackHotServerMiddleware from 'webpack-hot-server-middleware'
import { findVideos, findVideo } from './api'
import { GraphQLServer } from 'graphql-yoga'

const {Prisma} = require('prisma-binding')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')
const Subscription = require('./resolvers/Subscription')
const Feed = require('./resolvers/Feed')

const resolvers = {
  Query,
  Mutation,
  AuthPayload,
  Subscription,
  Feed
}
// ... or using `require()`
// const { GraphQLServer } = require('graphql-yoga')
/*
const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`

const resolvers = {
  Query: {
    hello: (_, {name}) => `Hello ${name || 'World'}`,
  },
}*/

//import clientConfig from '../webpack/client.dev'
//import serverConfig from '../webpack/server.dev'

const DEV = process.env.NODE_ENV === 'development';

console.log("DEV", process.env.NODE_ENV)
let clientConfig;
let serverConfig, formatWebpackMessages;
if (DEV) {
  clientConfig = require("../webpack/client.dev");
  serverConfig = require("../webpack/server.dev");
  formatWebpackMessages = require("./formatmessage");
} else {
  clientConfig = require("../webpack/client.prod");
  serverConfig = require("../webpack/server.prod");
}

const publicPath = clientConfig.output.publicPath
const outputPath = clientConfig.output.path
const jwToken = null;
//app.use(favicon(path.resolve(__dirname, '../public', 'favicon.ico')))
// UNIVERSAL HMR + STATS HANDLING GOODNESS:

const app = express();
app.get('/api/videos/:category', async (req, res) => {
  // const jwToken = req.headers.authorization.split(' ')[1]
  const data = await findVideos(req.params.category, jwToken)
  res.json(data)
})

app.get('/api/video/:slug', async (req, res) => {
  // const jwToken = req.headers.authorization.split(' ')[1]
  const data = await findVideo(req.params.slug, jwToken)
  res.json(data)
})

if (DEV) {
  console.log("run")
  let isFirstCompile = true;
  let multiCompiler, devMiddleware;
  try {
    multiCompiler = webpack([clientConfig, serverConfig]);
    devMiddleware = webpackDevMiddleware(multiCompiler, {
      publicPath: publicPath,
      writeToDisk: true,
      // hot: true,
      //contentBase: publicPath,
      watchContentBase: true,
      serverSideRender: true
    });
    app.use(devMiddleware)
    //const clientCompiler = webpack([clientConfig]);
    const clientCompiler = multiCompiler.compilers[0];
    const hotMiddleware = webpackHotMiddleware(clientCompiler);
    app.use(hotMiddleware)
    
    app.use("/staticssr", express.static(serverConfig.output.path))
    app.use(
      // keeps serverRender updated with arg: { clientStats, outputPath }
      webpackHotServerMiddleware(multiCompiler, {
        serverRendererOptions: {outputPath: clientConfig.output.path}
      }))
    
  } catch (err) {
    isFirstCompile = true;
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }
  
  multiCompiler.hooks.invalid.tap('invalid', () => {
    console.log('Compiling...');
  });
  
  const QLServer = new GraphQLServer({
    typeDefs: 'server/schema.graphql',
    resolvers,
    context: req => ({
      ...req,
      db: new Prisma({
        typeDefs: 'server/generated/prisma.graphql', // the auto-generated GraphQL schema of the Prisma API
        // endpoint: 'https://us1.prisma.sh/public-relicgargoyle-251/ts-test/dev', // the endpoint of the Prisma API
        endpoint: "https://eu1.prisma.sh/public-foamcentaur-934/hackernews-graphql-js/dev/",
        debug: true, // log all GraphQL queries & mutations sent to the Prisma API
        secret: 'mysecret123'
        // secret: 'mysecret123', // only needed if specified in `database/prisma.yml`
      }),
    })
  });
  
  multiCompiler.hooks.done.tap('done', stats => {
    
    // We have switched off the default Webpack output in WebpackDevServer
    // options so we are going to "massage" the warnings and errors and present
    // them in a readable focused way.
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;
    
    if (isSuccessful && isFirstCompile) {
      console.log(chalk.green('Compiled successfully!'));
      const options = {
        port: PORTAPI,
        debug: true,
        //endpoint: "https://eu1.prisma.sh/public-foamcentaur-934/hackernews-graphql-js/dev/",
        subscriptions: "/subscriptions",
        playground: "/playground"
      };
      
      QLServer.start(options, () => {
        console.log(`Api Server is running on localhost:${PORTAPI}`)
        
        app.listen(PORT, () => {
          console.log(`Server is running on localhost:${PORT}`)
        })
      })
    }
    // If errors exist, only show errors.
    if (messages.errors.length) {
      // Only keep the first error. Others are often indicative
      // of the same problem, but confuse the reader with noise.
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }
      console.log(chalk.red('Failed to compile.\n'));
      console.log(messages.errors.join('\n\n'));
      return;
    }
    isFirstCompile = false;
    
    // Show warnings if no errors were found.
    if (messages.warnings.length) {
      console.log(chalk.yellow('Compiled with warnings.\n'));
      console.log(messages.warnings.join('\n\n'));
      
      // Teach some ESLint tricks.
      console.log(
        '\nSearch for the ' +
        chalk.underline(chalk.yellow('keywords')) +
        ' to learn more about each warning.'
      );
      console.log(
        'To ignore, add ' +
        chalk.cyan('// eslint-disable-next-line') +
        ' to the line before.\n'
      );
    }
  });
} else {
  const clientStats = require('../buildClient/stats.json') // eslint-disable-line import/no-unresolved
  const serverRender = require('../buildServer/main.js').default // eslint-disable-line import/no-unresolved
  
  app.use("/static", express.static(outputPath))
  app.use(serverRender({clientStats, outputPath}))
  QLServer.start(options, () => {
    console.log(`Api Server is running on localhost:${PORTAPI}`)
    
    app.listen(PORT, () => {
      console.log(`Server is running on localhost:${PORT}`)
    })
  })
}

app.use(function(error, req, res, next) {
    // Gets called because of `wrapAsync()`
    res.json({message: error.message});
  }
)



