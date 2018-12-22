const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const app = express();

mongoose.connect("mongodb://localhost:27017/volunteer");
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection errors'))

app.use(session({
  secret: 'change ballot 1a2b3c',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

app.use(function(req, res, next){
  res.locals.currentUser = req.session.userId;
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/view');

const routes = require('./routes/index');
app.use('/', routes);

app.use(function(req, res, next){
  const err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(3000, function(){
  console.log('Express app listening on port 3000')
})
