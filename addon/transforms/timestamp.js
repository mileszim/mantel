import DS from "ember-data";
/* global Firebase */


export default DS.Transform.extend({
  deserialize: function(value) {
    if (!value) {
      return null;
    }
    return new Date(value);
  },

  serialize: function(value) {
    if (value === Firebase.ServerValue.TIMESTAMP) {
      return value;
    }
    if (!value || !value.getTime) {
      return null;
    }
    return value.getTime();
  }
});


export function now() {
  return Firebase.ServerValue.TIMESTAMP;
}