// This is a node server where we store everything to make the node backend.
const express = require('express');
const DB = require('./db');
const config = require('./config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const db = new DB('sqlitedb');
const app = express();
const router = express.Router();

router.use(bodyParser.urlencoded({ extend: false }));
router.use(bodyParser.json());


// Express is a server and a router.

// CORS middleware - intent is to ensure we do not run into any cross origin resource errors:

const allowCrossDomain = function (request, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', '*');
  next();
};
app.use(allowCrossDomain);

// Below is the route for registering a new  user:

router.post('/register', (request, res) => {
  db.insert([
    request.body.name,
    request.body.email,
    bcrypt.hash(request.body.password, 8),
  ],
  (err) => {
    if (err) return res.status(500).send('There was a problem registering the user');
    // a error code of 500 means something has gone wrong with the website's server
    db.selectByEmail(request.body.email ), (err, user) => {
      if (err) return res.status(500).send('There was a problem getting user');
      const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 });
      res.status(200).send({ auth: true, token, user });
    };
  });
});

// Below is the route for registering an administrator and loggin in

router.post('/register-admin', (request, res) => {
    db.insertAdmin([
        request.body.name,
        request.body.email,
        bcrypt.hashSync(request.body.password, 8),
        1
    ],
    function (err) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        db.selectByEmail(request.body.email, (err,user) => {
            if (err) return res.status(500).send("There was a problem getting user")
            let token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400 // expires in 24 hours
            });
            res.status(200).send({ auth: true, token: token, user: user });
        });
    });
});

// This says that if the request email is not found then return not found, if the email is found then compare the request password against the password in the database. If there is a match, then create a token and pass back the user, token, and an auth prop set to true.
router.post('/login', (request, res) => {
  db.selectByEmail(request.body.email, (err, user) => {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    const passwordIsValid = bcrypt.compareSync(request.body.password, user.user_pass);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
    const token = jwt.sign({ id: user.id }, config.secret, { expiresIn: 86400, // expires in 24 hours
    });
    res.status(200).send({ auth: true, token, user });
  });
});

// Create the express server below:

app.use(router);

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log('Express server listening on port: ', port)
});
