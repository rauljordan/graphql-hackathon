import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

const Image = new GraphQLObjectType({
  name: 'Image',
  fields: {
    src: {
      type: GraphQLString,
      resolve() {
        return 'cool.jpg';
      }
    },
    alt: {
      type: GraphQLString,
      resolve() {
        return 'an image';
      }
    },
    width: {
      type: GraphQLInt,
      resolve() {
        return 200;
      }
    },
    height: {
      type: GraphQLInt,
      resolve() {
        return 100;
      }
    }
  }
});

export const HtmlPage = new GraphQLObjectType({
  name: 'HtmlPage',
  fields: {
    // Image,
    url: {
      type: GraphQLString,
      resolve() {
        return 'http://graphqlhackathon.com/article/hackathon-winners-made-awesome-scraper';
      }
    },
    hostname: {
      type: GraphQLString,
      resolve() {
        return 'http://graphqlhackathon.com';
      }
    },
    path: {
      type: GraphQLString,
      resolve() {
        return '/article/hackathon-winners-made-awesome-scraper'
      }
    }
  }
});