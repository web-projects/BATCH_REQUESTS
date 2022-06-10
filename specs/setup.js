/**
 * Setup.js
 *
 * Author:
 *  IPA5 Dashboard Team
 *
 * Provides basic setup information in order to properly run
 * the unit tests both for ReactJS, Redux and the backend server.
 */
const jsdom = require('jsdom');

const { JSDOM } = jsdom;

process.env.NODE_ENV = 'test';

const exposedProperties = [
  'window',
  'navigator',
  'document',
];

global.dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost',
});

global.window = global.dom.window;
global.document = global.dom.window.document;
global.navigator = global.window.navigator;

Object.keys(document.defaultView || []).forEach((property) => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

function noop() {
  return null;
}

require.extensions['.css'] = noop;
require.extensions['.scss'] = noop;
require.extensions['.md'] = noop;
require.extensions['.png'] = noop;
require.extensions['.svg'] = noop;
require.extensions['.jpg'] = noop;
require.extensions['.jpeg'] = noop;
require.extensions['.gif'] = noop;
