const { assert } = reuire('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert.equal(user, expectedUserID)
  });

  it('should return undefined is user is not found', function() {
    const user = getUserByEmail("user4@example.com", testUsers)
    const expectedUserID = undefined;
    // assert.equal(actual, expected, [message])
    assert.equal(user, expectedUserID);
  });


});