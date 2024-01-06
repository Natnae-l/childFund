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
logOut = async(req, res, next) => {
  req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
}

updateUser = async (req, res, next) => {
  let user = await User.findOne({_id: req.user._id})
  console.log(req.user._id)
  
  if (user){
    bcrypt.compare(req.body.oldPassword, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        let updater = {};
        
          if (req.body.firstName && req.body.firstName != user.firstName) updater.firstName = req.body.firstNname;
          if (req.body.email && req.body.email != user.email) updater.email = req.body.email;


          if (typeof(req.body.newPassword) != undefined && req.body.oldPassword != req.body.newPassword){
            bcrypt.compare(req.body.oldPassword, user.password, function(err, response) {
              if (response){
              bcrypt.genSalt(10, (err, salt) => {
              bcrypt.hash(req.body.newPassword, salt, (err, hash) => {
                if (err) throw err;
                
                updater.password = hash;
                if (Object.values(updater).length > 0) {
                    User.findByIdAndUpdate({_id: req.user._id}, updater)
                      .then(data => {
                        res.redirect('/dashboard')
                      })
                      .catch(err => console.log(err))
                } else if(Object.values(updater).length == 0){
                  res.redirect('/login')
                }
              })
            })}  
          });
            }         
      } else {
        res.send('User not updated')
      }
    });
  }
}

module.exports = {
    addUser, logOut, updateUser
}
