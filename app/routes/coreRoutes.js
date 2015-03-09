/** @jsx React.DOM */

var React = require('react');
var ContainerView = React.createFactory(require('../components/ContainerView'));

module.exports = function(app) {

  app.get('/', function(req, res) {

    var reactHtml = React.renderToString(ContainerView());

    res.render('index.ejs', { reactOutput: reactHtml });

  });

};