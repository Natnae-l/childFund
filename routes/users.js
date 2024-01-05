var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const passport = require('passport')
const authenticate = require('../config/auth')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard', authenticate.ensureAuthenticated, (req, res, next) => {
  res.render('dashboard/dashboard', { title: 'Express' })
})
router.get('/dashboard/profile', async(req, res, next) => {
  res.render('dashboard/profile')
})
router.get('/dashboard/donate', async(req, res, next) => {
  res.render('dashboard/donate')
})
router.post('/signup', userController.addUser)

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));
router.post('/logout', userController.logOut)

module.exports = router;
