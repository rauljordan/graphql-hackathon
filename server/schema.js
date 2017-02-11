import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString
} from 'graphql';

const validAttributes = {
  id: 'String',
  class: 'String',
  src: 'String',
  content: 'String',
};

export const validHTMLTags = [
  'div',
  'span',
  'img',
  'a',
  'b',
];

const DIV_TYPE = {
  div: new GraphQLObjectType({
    name: 'div',
    fields: {

    }
  }),
};

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      div: {
        type: GraphQLObjectType,
        resolve() {
          return { foo: 'bar'};
        }
      }
    }
  })
});


export default schema;