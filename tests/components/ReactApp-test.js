/** @jsx React.DOM */

// jest.dontMock('../../components/ReactApp.js');

// describe('CheckboxWithLabel', function() {
//   it('changes the text after click', function() {
//     var React = require('react/addons');
//     var CheckboxWithLabel = require('../../components/ReactApp.js');
//     var TestUtils = React.addons.TestUtils;

//     var checkbox = TestUtils.renderIntoDocument(
//       <CheckboxWithLabel labelOn='On' lableOff='Off' />
//     );

//     var label = TestUtils.findRenderedDOMComponentWithTag(
//       checkbox, 'label');
//     expect(label.getDOMNode().textContent).toEqual('Off');

//     var input = TestUtils.findRenderedDOMComponentWithTag(
//       checkbox, 'input');
//     TestUtils.Simulate.change(input);
//     expect(label.getDOMNode().textContent.toEqual('On'));
//   });
// });