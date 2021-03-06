Package.describe({
  name: 'zuzel:reactive-query',
  version: '1.1.5',
  summary: 'Package that makes it easy to serialize application state in URL query params',
  git: 'https://github.com/iSuslov/reactive-query',
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
  api.addFiles(
      [
        'ReactiveQuery.js',
        'lib/ReactiveQueryUtils.js',
      ], ['client']);
});

Package.onTest(function(api) {
  api.use([
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
    'lib/ReactiveQueryUtils.js',
    'test/merge-method.js',
    'test/main.js',
    'test/force-method.js',
    'test/uri.js'
  ], ['client']);
});
