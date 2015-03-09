require('../testdom')('<html><body></body></html>');

var assert = require('assert');

describe('sum', function() {
  it('adds stuff', function() {
    var React = require('react/addons');
    var sum = require('./sum');
    var TestUtils = React.addons.TestUtils;

    assert.equal(sum(1,2), 2);
  });
});