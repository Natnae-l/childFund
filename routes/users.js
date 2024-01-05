var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const passport = require('passport')


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.get('/dashboard', (req, res, next) => {
  res.render('dashboard/dashboard', { title: 'Express' })
})
router.post('/signup', userController.addUser)

router.post('/login', passport.authenticate('local', {
  successRedirect: '/dashboard',
  failureRedirect: '/login'
}));

module.exports = router;
