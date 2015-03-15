require('../testdom.js')('<html><body></body></html>');

var expect = require('chai').expect;

describe('Clock', function() {
  var React = require('react/addons');
  var Clock = require('../../app/components/DashboardUI').Clock;
  var TestUtils = React.addons.TestUtils;
  var props, testClock, time;

  beforeEach(function() {
    // Sets values that will be used as default props for Clock.  
    // updateClock mimics our callback that will get a new object every second.
    // It then passes that object down through the prop chain to update Clock.
    props = {
      clock: '00:00',
      gameHasStarted: false,
      updateClock: function(data) {
        testClock.setProps({clock: data.clock});
      }
    };

    testClock = TestUtils.renderIntoDocument(
      <Clock clock={props.clock} 
             gameHasStarted={props.gameHasStarted}
             updateClock={props.updateClock} />
    );
  });
  
  afterEach(function(done) {
    React.unmountComponentAtNode(document.body);
    document.body.innerHTML = "";
    done();
  });

  it('should display "00:00" on initial render', function(){
    time = TestUtils.findRenderedDOMComponentWithClass(testClock, 'clock');
    expect(time.props.children).to.equal('00:00');
  });

  it('should update time when gameHasStarted is true', function(done) {
    time = TestUtils.findRenderedDOMComponentWithClass(testClock, 'clock');

    expect(time.props.children).to.equal('00:00');
    expect(testClock.props.gameHasStarted).to.be.false;

    // Calls componentWillUpdate which calls startClock.
    testClock.setProps({gameHasStarted: true});

    setTimeout(function() {
      expect(testClock.props.gameHasStarted).to.be.true;
      expect(time.props.children).to.equal('00:01');
      done();
    }, 1000);
  });
});