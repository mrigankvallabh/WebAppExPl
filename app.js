const path = require('path');

const chalk = require('chalk');
const express = require('express');
const morgan = require('morgan');
const debug = require('debug')('app');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const app = express();
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'globomantics',
  resave: true,
  saveUninitialized: true
}));

const passportConfig = require('./src/config/passport');
passportConfig(app);

app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
  res.render('index', {
    title: 'Welcome to Globomontics',
    data: ['A', 'B', 'C']
  });
});

const authRouter = require('./src/routers/authRouter');
app.use('/auth', authRouter);

const adminRouter = require('./src/routers/adminRouter');
app.use('/admin', adminRouter);

const sessionsRouter = require('./src/routers/sessionsRouter');
app.use('/sessions', sessionsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  debug(`Listening on port ${chalk.green(PORT)}`);
});
