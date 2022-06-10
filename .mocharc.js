'use strict'

module.exports = {  
  exit: true,
  bail: true,
  slow: 1000,
  recursive: true,
  require: [
    'specs/setup.js',
    '@babel/register'
  ]
}
