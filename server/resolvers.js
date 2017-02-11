import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt
} from 'graphql';

const validAttributes = {
  id: { type: GraphQLString },
  class: { type: GraphQLString },
  src: { type: GraphQLString },
  content: { type: GraphQLString },
};

export const validHTMLTags = [
  'div',
  'span',
  'img',
  'a',
  'b',
];

const htmlFields = () => validHTMLTags.reduce((prev, curr) => ({
  ...prev,
  [`${curr}`]: {
    type: HTMLNode,
    args: {
      ...validAttributes
    },
    resolve(root, args) {
      console.log(root, args)
      return {foo: 'bar'};
    }
  },
  content: {
    type: GraphQLString,
    resolve(root, args) {
      return 'alsdkfj'
    }
  }
}), {})

const HTMLNode = new GraphQLObjectType({
  name: 'HTMLNode',
  fields: htmlFields,
});


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
    ...htmlFields(),
    image: {
      type: Image,
      resolve() {
        return {
          foo: 'foo',
        }
      }
    },
    url: {
      type: GraphQLString,
      resolve(root, args, context) {
        return root.url;
      }
    },
    hostname: {
      type: GraphQLString,
      resolve(root, args, context) {
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
