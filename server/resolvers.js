import cheerio from 'cheerio';
import fetch from 'node-fetch';

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

const htmlFields = () => validHTMLTags.reduce((prev, tag) => ({
  ...prev,
  [`${tag}`]: {
    type: HTMLNode,
    args: {
      ...validAttributes,
    },
    resolve(root, args, context) {
      const here = {
        tag,
        args,
        url: root.url || root[0].url,
      }
      console.log(here)
      return [...root, here];
    }
  },
  content: {
    type: GraphQLString,
    resolve: async (root, args, context) => {
      const res = await fetch(root[0].url);
      const $ = cheerio.load(await res.text());
      const selector = root.reduce((prev, curr) => {
        let tag = '';
        if(curr.args.id) {
          tag = `#${curr.args.id}`;
        } else if (curr.args.class) {
          tag = `.${curr.args.class}`;
        }

        const ret = `${prev} ${curr.tag}${tag}`;
        console.log(ret)
        return ret;
      }, '');
      return $(selector).html();
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
