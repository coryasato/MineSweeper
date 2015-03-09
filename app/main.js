/** @jsx React.DOM */

var React = require('react');
var ContainerView = React.createFactory(require('./components/ContainerView'));

var mountNode = document.getElementById('react-main-mount');

React.render(new ContainerView(), mountNode);