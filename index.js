module.exports = {
  name: 'mantel',

  included: function(app) {
    this._super.included(app);
    this.app.import('bower_components/firebase/firebase.js');
    this.app.import('vendor/mantel/register-version.js');
    this.app.import('vendor/ember-inflector.named-amd.js', {
      exports: {
        'ember-inflector': [
          'default',
          'pluralize',
          'singularize'
        ]
      }
    });
  }
};
