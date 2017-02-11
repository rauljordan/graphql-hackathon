import cheerio from 'cheerio';
import fetch from 'node-fetch';

import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList
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
  'body',
  'a',
  'b',
  'i',
  'p'
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

const getImgForUrl = async (url) => {
  const res = await fetch(url);
  const $ = cheerio.load(await res.text());

  return $('img').map(function() { return $(this).attr('src'); }).get();
};

const Image = new GraphQLObjectType({
  name: 'Image',
  fields: {
    src: {
      type: GraphQLString,
      resolve(root) {
        return root.src;
      }
    },
  }
});

export const HtmlPage = new GraphQLObjectType({
  name: 'HtmlPage',
  fields: () => ({
    ...htmlFields(),
    images: {
      type: new GraphQLList(GraphQLString),
      resolve(root, args, context) {
        return getImgForUrl(root.url);
      }
    },
    links: {
      type: new GraphQLList(HtmlPage),
      resolve: async (root, args, context) => {
        const res = await fetch(root.url);
        const $ = cheerio.load(await res.text());
        const links = $('a').map(function() {
          if (!$(this).attr('href')) {
            return;
          }
          if ($(this).attr('href') !== '#' && $(this).attr('href').indexOf('http') > -1) {
            return $(this).attr('href');
          }
        }).get();

        return links.map(url => ({ url }))
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
        const match = root.url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
        return match && match[3];
      }
    },
    title: {
      type: GraphQLString,
      resolve: async (root, args, context) => {
        const res = await fetch(root.url);
        const $ = cheerio.load(await res.text());
        return $('title').text();
      }
    }
  })
});
