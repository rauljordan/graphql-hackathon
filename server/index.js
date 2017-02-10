import 'babel-polyfill';

import express from 'express';
import cors from 'cors';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import bodyParser from 'body-parser';

import schema from './schema';
import resolvers from './resolvers';

/*
 * Initialize the express app and setup the authentication routes
 */
const app = express();

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

/*
 * Setup the route handler for any GraphQL queries to this server
 */
app.use('/graphql', graphqlExpress(async (req) => {
  const query = req.query.query || req.body.query;
  if (query && query.length > 2000) {
    throw new Error('Query too large.');
  }
  return {
    schema: makeExecutableSchema({
      typeDefs: schema,
      resolvers
    }),
    context: {}
  };
}));

/*
 * Setup Graphiql for development mode
 */
app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}));

app.listen(3010);
console.log('Server started on port 3010');
