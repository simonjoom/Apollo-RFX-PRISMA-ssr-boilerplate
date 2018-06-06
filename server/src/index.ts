import { GraphQLServer } from 'graphql-yoga'
import { Prisma } from './generated/prisma'
import { resolvers, fragmentReplacements } from './resolvers'

const db = new Prisma({
  fragmentReplacements,
  endpoint: process.env.PRISMA_ENDPOINT,
  secret: process.env.PRISMA_SECRET,
  debug: true,
})

const server = new GraphQLServer({
  typeDefs: 'server/src/schema.graphql',
  resolvers,
  context: req => ({ ...req, db }),
}) 

export const options = {
  //port: process.env.PORTAPI,
  debug: true,
  // endpoint: "https://eu1.prisma.sh/public-foamcentaur-934/hackernews-graphql-js/dev/",
  subscriptions: '/subscriptions',
  playground: '/playground'
}

export default server;
/*
server.start(options,({ port }) =>
  console.log(`Server is running on http://localhost:${port}`),
)*/
