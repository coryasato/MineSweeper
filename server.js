var express     = require('express'),
    path        = require('path'),
    bodyParser  = require('body-parser'),
    cors        = require('express-cors');

var app = express();
// JSX transpiler
require('node-jsx').install();

/**
 * Server Setup
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  allowedOrigins: ['http://fonts.googleapis.com']
}));

/**
 * Routes
 */

require('./app/routes/coreRoutes.js')(app);

app.get('*', function(req, res) {
  res.json({
    "route": "Page does not exist!"
  });
});

/**
 * Start Server
 */

app.listen(8080);

