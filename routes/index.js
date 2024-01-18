var express = require('express');
var router = express.Router();
const News = require('../model/newsModel')

/* GET home page. */
router.get('/', async function(req, res, next) {
  const data = await News.find({})
    
  res.render('front-page/home', {
    news: data, 
  });
});
router.get('/login', (req, res, next) => {
  res.render('front-page/login', { errors: {} })
})
router.get('/signup', (req, res, next) => {
  res.render('front-page/sign-up', { errors: {} })
})
router.get('/staff', async (req, res, next) => {
  res.render('front-page/staff');
})
router.get('/about-us', async (req, res, next) => {
  res.render('front-page/aboutUs');
})

module.exports = router;
