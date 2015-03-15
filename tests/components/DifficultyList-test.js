require('../testdom.js')('<html><body></body></html>');

var expect = require('chai').expect;
var _      = require('lodash');

describe('DifficultyList', function() {
  var React = require('react/addons');
  var DifficultyList = require('../../app/components/DashboardUI').DifficultyList;
  var TestUtils = React.addons.TestUtils;
  var props, testList, difficulty, radios, 
      checkedRadio, getCheckedRadio, getRadioByValue, restartButton;

  beforeEach(function() {
    // Sets values that will be used as default props for List.
    // onRestartButton gets an difficulty setting object on click and sets
    // a global state setting called difficulty.
    props = {
      onRestartButton: function(diff) {
        difficulty = diff.difficulty;
      }
    };

    testList = TestUtils.renderIntoDocument(
      <DifficultyList onRestartButton={props.onRestartButton}/>
    );

    radios = TestUtils.scryRenderedDOMComponentsWithTag(testList, 'input');
    restartButton = TestUtils.findRenderedDOMComponentWithTag(testList, 'button');

    getCheckedRadio = function(radios) {
      return _.find(radios, function(radio) {
        return radio.props.checked;
      });
    };

    getRadioByValue = function(radios, value) {
      return _.find(radios, function(radio) {
        return radio.getDOMNode().value === value;
      });
    };
  });
  
  afterEach(function(done) {
    React.unmountComponentAtNode(document.body);
    document.body.innerHTML = "";
    difficulty = undefined;
    done();
  });

  it('should set difficulty to Modest on initial render', function() {
    checkedRadio = getCheckedRadio(radios);
    
    expect(checkedRadio.getDOMNode().value).to.equal('modest');
  });

  it('should get difficulty by checked value', function() {
    var oldCheckedRadio = getCheckedRadio(radios);
    oldCheckedRadio.props.checked = false;
    var savvyRadio = getRadioByValue(radios, 'savvy');
    var proRadio = getRadioByValue(radios, 'pro');
    
    savvyRadio.props.checked = true;
    checkedRadio = getCheckedRadio(radios);

    expect(checkedRadio.getDOMNode().value).to.equal('savvy');

    savvyRadio.props.checked = false;
    proRadio.props.checked = true
    checkedRadio = getCheckedRadio(radios);

    expect(checkedRadio.getDOMNode().value).to.equal('pro');
  });

  it('should set difficulty when button is clicked', function() {    
    expect(difficulty).to.be.undefined;

    TestUtils.Simulate.click(restartButton);

    expect(difficulty).to.equal('modest');
  });

  it('should set difficulty to checked radio value', function() {
    var modestRadio = getCheckedRadio(radios);
    var savvyRadio = getRadioByValue(radios, 'savvy');
    var proRadio = getRadioByValue(radios, 'pro');

    modestRadio.getDOMNode().checked = false;
    savvyRadio.getDOMNode().checked = true;
    TestUtils.Simulate.click(restartButton);

    expect(difficulty).to.equal('savvy');

    savvyRadio.getDOMNode().checked = false;
    proRadio.getDOMNode().checked = true;
    TestUtils.Simulate.click(restartButton);

    expect(difficulty).to.equal('pro');
  });

});