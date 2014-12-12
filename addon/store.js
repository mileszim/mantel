import Ember from 'ember';
import DS    from 'ember-data';


export default DS.Store.extend({
  defaultSerializer: 'mantel'
});