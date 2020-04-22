const successJson = require("../commons/response").successJson;
const errorJson = require("../commons/response").errorJson;
const property = require("../commons/propertyFile");
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.login = (req, res, next) => {
  try {
    console.log("login initiated");
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        throw err;
      }
      if (!user) {
        errorJson.status = property.unauthorizedCode;
        errorJson.msg = info.message;
        res.send(errorJson);
      } else {
        req.logIn(user, function (err) {
          if (err) {
            console.log("error in passport req.login()");
            return next(err);
          }
          console.log("login success")
          successJson.status = property.successCode;
          successJson.msg = property.S002 + user.name;
          res.send(successJson);
        });
      }
    })(req, res, next);
  } catch (error) {
    console.log("error in login api", error);
    errorJson.status = property.failureCode;
    errorJson.msg = error;
    res.send(errorJson);
  }
};

exports.register = (req, res) => {
  try {
    console.log("body", req.body);
    const { name, email, password } = req.body;

    // validate if all keys and values are present
    if (!name || !email || !password) {
      errorJson.status = property.failureCode;
      errorJson.msg = property.F001;
      res.send(errorJson);
    } else {
      // validation pass
      User.findOne({ email: email }).then((user) => {
        if (user) {
          errorJson.status = property.duplicateCode;
          errorJson.msg = property.F002;
          res.send(errorJson);
        } else {
          // user not found;
          const newUser = new User({
            name: name,
            email: email,
            password: password,
          });

          // password hashing
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hashedPass) => {
              if (err) {
                throw err;
              }
              newUser.password = hashedPass;
              //create user with hashedPass;
              newUser
                .save()
                .then((createdUser) => {
                  console.log("created user", createdUser);
                  successJson.status = property.successCode;
                  successJson.msg = property.S001;
                  res.send(successJson);
                })
                .catch((err) => {
                  console.log("error while user save in DB", err);
                  throw err;
                });
            });
          });
        }
      });
    }
  } catch (error) {
    errorJson.status = property.failureCode;
    errorJson.msg = error;
    res.send(errorJson);
  }
};

exports.logout = (req, res) => {
  console.log("logging out user");
  req.logout();
  successJson.status = property.successCode;
  successJson.msg = property.S003;
  res.send(successJson);
};
