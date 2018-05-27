# React & Apollo Tutorial

This is the sample project that belongs to the [React & Apollo Tutorial](https://www.howtographql.com/react-apollo/0-introduction/) on How to GraphQL.

## Running the App

### 1. Clone repository

```sh
git clone https://github.com/howtographql/react-apollo/
```

### 2. Deploy the Prisma database service

```sh
cd react-apollo/server
yarn prisma deploy
```

When prompted where (i.e. to which _cluster_) you want to deploy your service, choose any of the public clusters, e.g. `public-us1` or `public-eu1`. (If you have Docker installed, you can also deploy locally.)

### 3. Set the Prisma service endpoint

From the output of the previous command, copy the `HTTP` endpoint and paste it into `server/src/index.js` where it's used to instantiate the `Prisma` binding. You need to replace the current placeholder `__PRISMA_ENDPOINT`:

```js
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: '__PRISMA_ENDPOINT__',
      secret: 'mysecret123',
    }),
  }),
})
```

For example:

```js
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/public-hillcloak-flier-942261/hackernews-graphql-js/dev',
      secret: 'mysecret123',
    }),
  }),
})
```

Note that the part `public-hillcloak-flier-952361` of the URL is unique to your service.

### 4. Start the server

To start the server, all you need to do is install the the dependencies execute the `start` script by running the following command inside the `server` directory:

```sh
yarn install
yarn start
```

> **Note**: If you want to interact with the GraphQL APIs inside a [GraphQL Playground](https://github.com/graphcool/graphql-playground), you can also run `yarn dev`.

### 5. Run the app

Now that the server is running, you can start the app as well. The commands need to be run in a new terminal tab/window inside the root directory `react-apollo` (because the current tab is blocked by the process running the server):

```sh
yarn install
yarn start
```

You can now open your browser and use the app on `http://localhost:3000`.