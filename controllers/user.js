const User = require('../model/user');
const bcrypt = require('bcryptjs')


addUser = async(req, res, next) => {
    let newUser = {
        firstName: req.body.firstName, lastName: req.body.lastName,
        password: req.body.password1, email: req.body.email
    }
        let errors = [];
      
        if (!newUser.firstName|| !newUser.email || !req.body.password1 || !req.body.password2) {
          errors.push({ msg: 'Please enter all fields' });
        }
      
        if (req.body.password1 != req.body.password2) {
          errors.push({ msg: 'Passwords do not match' });
        }
      
        if (req.body.password1 < 8 || req.body.password2 < 8) {
          errors.push({ msg: 'Password must be at least 8 characters' });
        }
      
        if (errors.length > 0) {
          res.render('front-page/sign-up', {
            errors, title: 'express'
          });
        } else {
          User.findOne({ email: newUser.email }).then(user => {
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('front-page/login', {errors, title: 'express'});
            } else {
                let newUser = {
                    firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email, password: req.body.password1
                }
      
              bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                  if (err) throw err;
                  newUser.password = hash;
                  newUser = new User(newUser)
                  newUser
                    .save()
                    .then(user => {
                        console.log('new user saved')
                      res.render('front-page/login', {title: 'express', errors: {}});
                    })
                    .catch(err => console.log(err));
                });
              });
            }
          });
        }
}
logUser = async(req, res, next) => {
    
}

module.exports = {
    addUser, logUser
}
