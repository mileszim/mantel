import Ember from 'ember';

import Model from 'fireplace/model/model';
import Store from 'fireplace/store';
import attr  from 'fireplace/model/attr';
import one   from 'fireplace/relationships/has-one';

import { makeSnapshot } from '../../helpers/firebase';

var get = Ember.get;
var set = Ember.set;

var Person;
module("Model Firebase events", {
  setup: function() {
    Person = Model.extend({
      firstName: attr(),
      lastName:  attr()
    });
    Person.typeKey = "Person";
  }
});

test("onFirebaseChildAdded sets an attribute", function() {
  var person   = Person.create();
  var snapshot = makeSnapshot("first_name", "John");

  // to make sure it's notified of changes
  equal(get(person, "firstName"), undefined, "should not yet be set");

  Ember.run(function() {
    person.onFirebaseChildAdded(snapshot);
  });

  equal(get(person, "firstName"), "John", "sets the attribute");
});

test("onFirebaseChildRemoved clears an attribute", function() {
  var person   = Person.create({firstName: "Bobby", snapshot: makeSnapshot("123", {first_name: "Bobby"})});

  // child_removed sends the old value with the snapshot, not null
  var snapshot = makeSnapshot("first_name", "Bobby");

  Ember.run(function() {
    person.onFirebaseChildRemoved(snapshot);
  });

  equal(get(person, "firstName"), null, "clears the attribute");
});

test("onFirebaseChildChanged updates an attribute", function() {
  var person   = Person.create({firstName: "Bobby"});
  var snapshot = makeSnapshot("first_name", "Johnny");

  Ember.run(function() {
    person.onFirebaseChildChanged(snapshot);
  });

  equal(get(person, "firstName"), "Johnny", "updates the attribute");
});

test("onFirebaseValue destroys the object if snapshot value is null", function() {
  var person   = Person.create({store: Store.create({firebaseRoot: "https://foo.firebaseio.com"})});
  var snapshot = makeSnapshot("123", null);

  ok(!person.isDestroyed, "is not destroyed");

  Ember.run(function() {
    person.onFirebaseValue(snapshot);
  });

  ok(person.isDestroyed, "is now destroyed");
});

module("Model Firebase events with relationship", {
  setup: function() {
    Person = Model.extend({
      firstName: attr(),
      lastName:  attr(),
      avatar: one({embedded: false})
    });
  }
});

// firebase triggers child_added events first, then value
// so we need to be able to handle not having the snapshot yet
test("handles child_added events occurring before value", function() {
  expect(4);

  var store  = Store.create({firebaseRoot: "https://foo.firebaseio.com"});
  var person = Person.create({store: store});

  var firstNameSnap = makeSnapshot("first_name", "Ted");
  var lastNameSnap  = makeSnapshot("last_name",  "Johnson");
  var avatarSnap    = makeSnapshot("avatar",     "123");

  var mockAvatar = "an avatar";
  store.findOne = function(type, id, query) {
    equal(id, "123", "calls find for the avatar with the correct ID");
    return mockAvatar;
  };

  Ember.run(function() {
    person.onFirebaseChildAdded(lastNameSnap);
    person.onFirebaseChildAdded(firstNameSnap);
    person.onFirebaseChildAdded(avatarSnap);
    // ... at some point later person.onFirebaseValue(...) will be called
  });

  equal(get(person, "firstName"), "Ted",      "sets the first name");
  equal(get(person, "lastName"),  "Johnson",  "sets the last name");
  equal(get(person, "avatar"),    mockAvatar, "finds the avatar");
});
