require('dotenv').config()
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const expressSession = require('express-session');
const app = express();
require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", error => console.log("connection is not established", error));
db.once("open", () => console.log("connection has been established"));


const schema = new mongoose.Schema({
  Username: {
    type: String
  },
  googleId: {
    type: String
  },
  facebookId: {
    type: String
  }
})

const User = mongoose.model('User', schema);

app.use(express.json());

const Google_Client_Id = '630034178836-n1rr5531dfhgpeqin4tl1id0p6pa5fmr.apps.googleusercontent.com';
const Google_Client_SECRET = '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';
const Facebook_Client_Id = '621430123251418';
const Facebook_Client_SECRET = '0841b0e8c68fdb7c58da625c3f99c78e';

passport.use(new GoogleStrategy({
  clientID: Google_Client_Id,
  clientSecret: Google_Client_SECRET,
  callbackURL: '/google'
}, (accessToken, refreshToken, profile, callback) => {
  User.findOne({ googleId: profile.id })
  .then((user) => {
    if (user) {
      return callback(null, user);
    } else {
      const newUser = new User({ googleId: profile.id });
      return newUser.save();
    }
  })
  .then((newUser) => {
    return callback(null, newUser);
  })
  .catch((err) => {
    return callback(err);
  });
  console.log("Google Login Data:");
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  console.log("profile", profile);
  callback(null, profile);
}));

passport.use(new FacebookStrategy({
  clientID: Facebook_Client_Id,
  clientSecret: Facebook_Client_SECRET,
  callbackURL: '/facebook',
  profileFields: ['emails', 'displayName', 'name', 'picture']
}, (accessToken, refreshToken, profile, callback) => {
  console.log("Facebook Login Data:");
  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);
  console.log("profile", profile);
  callback(null, profile);
}));

app.use(expressSession({
  secret: 'harshal',
  resave: true,
  saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, callback) => {
  callback(null, user);
});

passport.deserializeUser((user, callback) => {
  callback(null, user);
});

            // Middleware //

            //Register 
const Register = require('./routes/Register')
app.use('/Register', Register)

           //login //
const login = require('./routes/login')
app.use('/login', login)


app.get('/login/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/login/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/google', passport.authenticate('google', {
  failureRedirect: '/login' // Specify a failure redirect route
}), (req, res) => {
  res.redirect('/');
});

app.get('/facebook', passport.authenticate('facebook', {
  failureRedirect: '/login' // Specify a failure redirect route
}), (req, res) => {
  res.redirect('/');
});

app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      // Handle the error, e.g., by redirecting to an error page or logging it
      console.error(err);
      return res.redirect('/error');
    }
    
    // Redirect the user to the home page or another page after logout
    res.redirect('/');
  });
});

app.get('/', (req, res) => {
  res.send(req.user ? req.user : 'Not logged in, login with Google or Facebook');
});

app.listen(process.env.PORT, () => {
  console.log(`server is listening on port ${process.env.PORT}`);
});
