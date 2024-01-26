var express = require('express');
var router = express.Router();
const userController = require('../controllers/user')
const passport = require('passport')
const authenticate = require('../config/auth')
const multer  = require('multer');
const path = require('path');
const News = require('../model/newsModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/'); // The folder where uploaded images will be stored
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // Rename the image file
  }
});
// Create the Multer instance
const upload = multer({ storage: storage });

router.post('/sendupdate',authenticate.ensureAuthenticated, upload.single('image'), async(req, res) => {

   let newNews = new News({
    image: '/uploads/'+ req.file.filename,
    text: req.body.text,
    link: req.body.link
   })
   await newNews.save()
  // File upload was successful
  res.redirect('/dashboard/sendUpdate')
});


/* GET users listing. */
router.get('/dashboard', authenticate.ensureAuthenticated, userController.getMessage)
router.get('/dashboard/profile', authenticate.ensureAuthenticated, async(req, res, next) => {
  res.render('dashboard/profile')
})
router.get('/dashboard/sendUpdate', authenticate.ensureAuthenticated, async(req, res, next) => {
  res.render('dashboard/sendNews')
})
router.get('/dashboard/donate', authenticate.ensureAuthenticated, async(req, res, next) => {
  res.render('dashboard/donate')
})
router.get('/sendmessage', authenticate.ensureAuthenticated, (req, res, next) => {
  res.render('dashboard/sendMessage')
})
router.post('/update/user',authenticate.ensureAuthenticated, userController.updateUser)
router.post('/signup', userController.addUser)
router.post('/subscribe', userController.addSub)
router.post('/donate', authenticate.ensureAuthenticated, userController.donatePlan)
router.post('/login', passport.authenticate('local', {successRedirect: '/dashboard', failureRedirect: '/login', failureFlash: true}), (err, req, res, next) => {
    if (err) {
      next(err)
    }
});
// router.post('/login', function(req, res, next) {
//   passport.authenticate('local', function(err, user, info) {
//     if (err) {
//       return next(err); // will generate a 500 error
//     }
//     // Generate a JSON response reflecting authentication status
//     if (! user) {
//        res.redirect('/login')
//     }
//     req.login(user, function(err){
//       if(err){
//         return next(err);
//       }
//       res.redirect('/dashboard')      
//     });
//   })(req, res, next);
// });
router.post('/logout',authenticate.ensureAuthenticated, userController.logOut) 
// message controller
// router.post('/sendupdate',authenticate.ensureAuthenticated, userController.sendNews)
router.delete('/deletemessage/:_id',authenticate.ensureAuthenticated, userController.deleteMessage)
router.post('/sendmessage',authenticate.ensureAuthenticated, userController.sendMessage, userController.alertEmail)

module.exports = router;
