var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('front-page/home');
});
router.get('/login', (req, res, next) => {
  res.render('front-page/login', { errors: {} })
})
router.get('/signup', (req, res, next) => {
  res.render('front-page/sign-up', { errors: {} })
})

module.exports = router;
