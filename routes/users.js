var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const passport = require('passport')
const authenticate = require('../config/auth')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard', authenticate.ensureAuthenticated, userController.getMessage)
router.get('/dashboard/profile', authenticate.ensureAuthenticated, async(req, res, next) => {
  res.render('dashboard/profile')
})
router.get('/dashboard/donate', authenticate.ensureAuthenticated, async(req, res, next) => {
  res.render('dashboard/donate')
})
router.get('/sendmessage', authenticate.ensureAuthenticated, (req, res, next) => {
  res.render('dashboard/sendMessage')
})
router.post('/update/user',authenticate.ensureAuthenticated, userController.updateUser)
router.post('/signup', userController.addUser)

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));
router.post('/logout',authenticate.ensureAuthenticated, userController.logOut) 
// message controller
router.post('/sendmessage',authenticate.ensureAuthenticated, userController.sendMessage,userController.alertEmail)

module.exports = router;
