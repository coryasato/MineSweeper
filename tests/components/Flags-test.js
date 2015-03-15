require('../testdom.js')('<html><body></body></html>');

var expect = require('chai').expect;

describe('Flags', function() {
  var React = require('react/addons');
  var Flags = require('../../app/components/DashboardUI').Flags;
  var TestUtils = React.addons.TestUtils;
  var props, testFlags, flags;

  beforeEach(function() {
    // Sets values that will be used as default props for Flags.
    props = {
      flags: 10
    };

    testFlags = TestUtils.renderIntoDocument(
      <Flags flags={props.flags} />
    );

    flags = TestUtils.findRenderedDOMComponentWithClass(testFlags, 'flags');
  });
  
  afterEach(function(done) {
    React.unmountComponentAtNode(document.body);
    document.body.innerHTML = "";
    done();
  });

  it('should display the correct amount of flags', function() {
    expect(flags.getDOMNode().textContent).to.equal('10Flags');
    
    testFlags.setProps({flags: 20});
    
    expect(flags.getDOMNode().textContent).to.equal('20Flags');
  });

});