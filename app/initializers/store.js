export default {
  name: 'mantel:inject-store',

  initialize: function(container, application) {
    application.inject('controller',   'store', 'store:main');
    application.inject('route',        'store', 'store:main');
    application.inject('data-adapter', 'store', 'store:main');
    application.inject('collection',   'store', 'store:main');
    application.inject('component',    'store', 'store:main');
  }
};