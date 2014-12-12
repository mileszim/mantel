/* jshint node: true */
/* global require, module */
var EmberAddon = require('ember-cli/lib/broccoli/ember-addon');
var app        = new EmberAddon();

// Firebase
app.import('bower_components/firebase/firebase.js');


// Mock
app.import("bower_components/mockfirebase/browser/mockfirebase.js");


// Export
module.exports = app.toTree();
