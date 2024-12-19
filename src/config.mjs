// TODO: Use everywhere?

import defaultImage from './assets/images/default.png';

const CONFIG = {
  name: 'Chris Chinchilla',

  origin: 'https://chrischinchilla.com',
  basePathname: '/',
  trailingSlash: false,

  title: 'Chris Chinchilla - Technical communicator, blogger, podcaster, streamer, game and fiction writer',
  description:
    'A technical communicator with a love of explaining technical concepts in documentation, blog posts, videos, books and more. Also a podcaster, video maker, writer of interactive fiction, and games.',
  defaultImage: defaultImage,

  defaultTheme: 'system', // Values: "system" | "light" | "dark" | "light:only" | "dark:only"

  language: 'en',
  textDirection: 'ltr',

  dateFormatter: new Intl.DateTimeFormat('en', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  }),

  // TODO: Update or remove
  // googleAnalyticsId: false, // or "G-XXXXXXXXXX",
  // googleSiteVerificationId: 'orcPxI47GSa-cRvY11tUe6iGg2IO_RPvnA1q95iEM3M',

  blog: {
    disabled: false,
    postsPerPage: 30,
    // TODO: Change?
    list: {
      pathname: 'blog', // blog main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    post: {
      permalink: '/blog/%slug%',
      // pathname: '', // empty for /some-post, value for /pathname/some-post
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: 'category', // set empty to change from /category/some-category to /some-category
      noindex: true,
      disabled: false,
    },

    tag: {
      pathname: 'blog/tag', // set empty to change from /tag/some-tag to /some-tag
      noindex: true,
      disabled: false,
    },
  },



  
  game: {
    disabled: false,
    postsPerPage: 30,
    // TODO: Change?
    list: {
      pathname: 'game', // blog main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    post: {
      permalink: '/game/%slug%',
      // pathname: '', // empty for /some-post, value for /pathname/some-post
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: 'category', // set empty to change from /category/some-category to /some-category
      noindex: true,
      disabled: false,
    },

    tag: {
      pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
      noindex: true,
      disabled: false,
    },
  },


  podcast: {
    disabled: false,
    postsPerPage: 15,
    // TODO: Change?
    list: {
      pathname: 'podcasts', // blog main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    post: {
      permalink: '/podcast/%slug%',
      // pathname: '', // empty for /some-post, value for /pathname/some-post
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: 'category', // set empty to change from /category/some-category to /some-category
      noindex: true,
      disabled: false,
    },

    tag: {
      pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
      noindex: true,
      disabled: false,
    },
  },

  book: {
    disabled: false,
    postsPerPage: 15,
    // TODO: Change?
    list: {
      pathname: 'books', // blog main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    post: {
      permalink: '/book/%slug%',
      // pathname: '', // empty for /some-post, value for /pathname/some-post
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: 'category', // set empty to change from /category/some-category to /some-category
      noindex: true,
      disabled: false,
    },

    tag: {
      pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
      noindex: true,
      disabled: false,
    },
  },

  
  event: {
    disabled: false,
    postsPerPage: 15,
    // TODO: Change?
    list: {
      pathname: 'events', // blog main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    post: {
      permalink: '/event/%slug%',
      // pathname: '', // empty for /some-post, value for /pathname/some-post
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: 'category', // set empty to change from /category/some-category to /some-category
      noindex: true,
      disabled: false,
    },

    tag: {
      pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
      noindex: true,
      disabled: false,
    },
  },
  client: {
    disabled: false,
    postsPerPage: 4,

    list: {
      pathname: 'clients', // blog main path, you can change this to "articles" (/articles)
      noindex: false,
      disabled: false,
    },

    client: {
      permalink: '/client/%slug%',
      // pathname: '', // empty for /some-post, value for /pathname/some-post
      noindex: false,
      disabled: false,
    },

    category: {
      pathname: 'category', // set empty to change from /category/some-category to /some-category
      noindex: true,
      disabled: true,
    },

    tag: {
      pathname: 'tag', // set empty to change from /tag/some-tag to /some-tag
      noindex: true,
      disabled: true,
    },
  },
};

export const SITE = { ...CONFIG, blog: undefined, client: undefined };
export const BLOG = CONFIG.blog;
export const BOOK = CONFIG.book;
export const CLIENT = CONFIG.client;
export const EVENT = CONFIG.event;
export const GAME = CONFIG.game;
export const PODCAST = CONFIG.podcast;
export const DATE_FORMATTER = CONFIG.dateFormatter;
