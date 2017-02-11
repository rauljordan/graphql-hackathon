import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';


export const validHTMLTags = [
  {
    name: 'div',
    validAttributes: {
      id: 'String',
      class: 'String',
    },
  },
  {
    name: 'img',
    validAttributes: {
      id: 'String',
      class: 'String',
      src: 'String',
    },
  }
];

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'world';
        }
      }
    }
  })
});


console.log(schema)