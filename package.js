Package.describe({
  name: 'zuzel:reactive-query',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.2.1');
  api.use([
    'reactive-dict',
    'tracker',
    'underscore',
  ], ['client']);
  api.export([
      'ReactiveQuery'
  ],['client'])
  api.addFiles(['ReactiveQuery.js'], ['client']);
});

Package.onTest(function(api) {
  api.use([
    'ecmascript',
    'tinytest',
    'tracker',
    'reactive-dict',
    'underscore',
    'zuzel:reactive-query'
  ]);

  api.export([
    'ReactiveQueryUtils'
  ], ['client'])
  api.addFiles([
    'helpers/ReactiveQueryUtils.js',
    'test/merge-method.js',
    'test/main.js',
    'test/force-method.js',
    'test/uri.js'
  ], ['client']);
});
