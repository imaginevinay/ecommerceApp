const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const passport = require("passport");
module.exports = function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      console.log("email passport", email, password);
      User.findOne({ email: email }, function (err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
            console.log("user not found")
          return done(null, false, { message: "Email not found" });
        }

        // match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            throw err;
          }
          if (isMatch) {
            return done(null, user,{message:"Welcome"});
          } else {
            return done(null, false, { message: "Incorrect password" });
          }
        });
      });
    })
  );


  passport.serializeUser(function (user, done) {
    console.log("serialized", user);
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    console.log("deserializing", id);

    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
