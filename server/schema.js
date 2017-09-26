import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

import { HtmlPage } from './resolvers';

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      scrape: {
        type: HtmlPage,
        // `args` describes the arguments that the `user` query accepts
        args: {
          url: { type: GraphQLString }
        },
        resolve: function (_, { url }) {
          return {
            url
          };
        }
      }
    }
  }),
});


export default schema;
