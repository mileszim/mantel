import Ember from 'ember';
import DS from 'ember-data'


export default DS.Adapter.extend({
  defaultSerializer: 'mantel'
});