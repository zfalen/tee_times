require('dotenv').load();
var express = require('express');
var app = express();
var path = require('path');
var http = require('http');
var fs = require('fs');
var bodyParser = require('body-parser');
var Event = require('./models/eventModel');
var User = require('./models/userModel');
var passportLocal = require('passport-local');
var passport = require('passport');
var flash = require('connect-flash');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var axios = require('axios');
var _ = require('lodash');


var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

var options = {
  server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
  replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
};

var mongodbUri = process.env.MONGOLAB_URI || 'mongodb://localhost/forePlay';
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

var accountSid = 'ACa66dc19c03ae8cae1d7d814bf301b3e0';
var authToken = '20db1bc69612403cf7749a9a610835b8';

var client = require('twilio')(accountSid, authToken);

mongoose.connect(mongooseUri, options);

app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms

app.set('view engine', 'ejs'); // set up ejs for templating


// PASSPORT
// ==========================================

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

require('./config/passport')(passport); // pass passport for configuration

require('./routes/userRoutes.js')(app, passport); // routes for passport


// ROUTES FOR OUR API
// =============================================================================

var router = express.Router();


router.use(function(req, res, next) {
  console.log('Something is happening.');
  next();
});

app.use('/api', router);

router.route('/message')

    .post(function(req, res){
      //Send an SMS text message
      client.sendMessage({

          to: req.body.phoneNumber, // Any number Twilio can deliver to
          from: '+14062152056', // A number you bought from Twilio and can use for outbound communication
          body: 'Hello, ' + req.body.name + '! Your tee time is confirmed.\n\nDate: ' + req.body.date + '\nTime: ' + req.body.startTime // body of the SMS message

      }, function(err, responseData) { //this function is executed when a response is received from Twilio

          if (err) {
            res.send(err);
          }

          if (!err) { // "err" is an error received during the request, if any

              // "responseData" is a JavaScript object containing data received from Twilio.
              // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
              // http://www.twilio.com/docs/api/rest/sending-sms#example-1

              console.log(responseData.from); // outputs "+14506667788"
              console.log(responseData.body); // outputs "word to your mother."

          }
      });

      res.json({message: 'Success!'})
    })

router.route('/event')

    .post(function(req, res) {
      mongoose.model('Event').create({
        title: req.body.title,
        start: req.body.start,
        end: req.body.end,
        players: req.body.players,
        holes: req.body.holes,
        walking: req.body.walking,
        // approved: req.body.approved
      }, function(err, thing) {
        if (err) {
          res.send(err);
        } else {
          res.json(thing);
        }
      }
        )})

    .get(function(req, res) {

      mongoose.model('Event').find({}, function(err, blog) {
        if (err) {
          res.send(err);
        }
        res.json(blog);
      });
    });

router.route('/event/:event_id')

    .put(function(req, res) {
      mongoose.model('Event').findById(req.params.event_id, function(err, thing) {
        if (err) {
          res.send(err);
        } else {
          thing.title = req.body.title;
          thing.start = req.body.start;
          thing.end = req.body.end;
          thing.players = req.body.players;
          thing.holes = req.body.holes;
          thing.walking = req.body.walking;
          // thing.approved = req.body.approved;
          thing.save();
          res.json(thing);
        }
      })
    })

    .get(function(req, res) {
      mongoose.model('Event').findById(req.params.event_id, function(err, thing) {
        if (err) {
          res.send(err);
        }
        res.json(thing);
      });
    })

    .delete(function(req, res) {
      mongoose.model('Event').remove({
        _id: req.params.event_id
      }, function(err, blog) {
        if (err) {
          res.send(err);
        }
        res.json({ message: 'Successfully deleted'});
      })
    })

if (process.env.NODE_ENV === 'production') {
  console.log('*****************-----------------------Running in production mode---------------------**************************');
  app.use('/static', express.static('static'));
} else {
    // When not in production, enable hot reloading
  var chokidar = require('chokidar');
  var webpack = require('webpack');
  var webpackConfig = require('./webpack.config.dev');
  var compiler = webpack(webpackConfig);
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: false,
    publicPath: webpackConfig.output.publicPath
  }));
  app.use(require('webpack-hot-middleware')(compiler));
    // Do "hot-reloading" of express stuff on the server
    // Throw away cached modules and re-require next time
    // Ensure there's no important state in there!
  var watcher = chokidar.watch('./server');
  watcher.on('ready', function() {
    watcher.on('all', function() {
      console.log('Clearing /server/ module cache from server');
      Object.keys(require.cache).forEach(function(id) {
        if (/\/server\//.test(id)) {
          delete require.cache[id];
        }
      });
    });
  });
}

var static_path = path.join(__dirname, '/');
app.use(express.static('public'));

var port = process.env.PORT || 3000;

app.get('/sampleSite', function(req, res) {
        res.render('sampleSite.ejs');
});

app.use(express.static(static_path))
  .get('/', function(req, res) {
    res.render('login', {
      root: static_path
    });
  }).listen(process.env.PORT || 3000, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('The magic happens at ' + ':' + port);
  });
