const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const app = express();

app.use(express.json());

app.use(session({
  secret: 'fingerprint_customer',
  resave: true,
  saveUninitialized: true
}));

const routes = require('./router/general.js').general;
const auth = require('./router/auth_users.js').authenticated;

app.use('/', routes);

app.use('/customer/auth/*', function authMiddleware(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization.accessToken;

    jwt.verify(token, 'access', function (err, user) {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not logged in" });
  }
});

app.use('/customer', auth);

const PORT = 5000;

app.listen(PORT, function () {
  console.log(`Server is running on port ${PORT}`);
});
