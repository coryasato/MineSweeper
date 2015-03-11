var express     = require('express'),
    path        = require('path'),
    bodyParser  = require('body-parser'),
    cors        = require('express-cors'),
    compress    = require('compression'),
    helmet      = require('helmet');

var app = express();
// JSX transpiler
require('node-jsx').install();

/**
 * Server Setup
 */

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Compress { Place before express.static }
app.use(compress({
    filter: function(req, res) {
        return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
    },
    level: 9
}));

app.use(express.static(path.join(__dirname, 'dist')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cors({
  allowedOrigins: ['http://fonts.googleapis.com']
}));

// Helmet to secure Express headers
app.use(helmet.xframe());
app.use(helmet.xssFilter());
app.use(helmet.nosniff());
app.use(helmet.ienoopen());
app.disable('x-powered-by');

app.enable('trust proxy');

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

