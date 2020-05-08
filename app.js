var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var exphbs  = require('express-handlebars');
const mongoose = require('mongoose');
var session = require('express-session')
var bcrypt = require('bcrypt');
var passport = require('passport');
var flash = require('connect-flash');
var expressValidator = require('express-validator');
const MongoStore = require('connect-mongo')(session);

var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');

// var productSeeder = require('./seed/product-seeder');

var app = express();
mongoose.connect('mongodb://localhost/shopping', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
require('./config/passport');

const Handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
// const hbs = exphbs.create({
//   defaultLayout: 'layout', 
//   extname: '.hbs',
//   handlebars: allowInsecurePrototypeAccess(Handlebars)
// });
app.engine('hbs', exphbs({defaultLayout : 'layout', extname : '.hbs', handlebars: allowInsecurePrototypeAccess(Handlebars)}));
app.set('view engine', 'hbs');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// validators
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;
 
    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  cookie : { maxAge : 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

app.get('*',function(req, res, next){
  res.locals.login = req.isAuthenticated();
  next();
})
app.use('/', indexRouter);
app.use('/user', userRouter);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
