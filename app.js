const express = require('express');
const app = express();
const session = require('express-session');
const configRoutes = require('./routes');
const path = require('path');
const static = express.static(__dirname + '/public');
const expressHandlebars = require('express-handlebars');

app.use('./public', static);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(
  session({
    name: 'AuthCookie',
    secret: 'kontomire',
    saveUninitialized: true,
    resave: false
  })
);

configRoutes(app);

app.listen(3000, () => {
  console.log('Your routes will be running on http://localhost:3000');
});
