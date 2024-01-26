const User = require('../model/user');
const Subscriber = require('../model/subModel');
const Message = require('../model/messageModel');
const bcrypt = require('bcryptjs')
const moment = require('moment');
const nodemailer = require("nodemailer");
const { trusted } = require('mongoose');
const fs = require('fs')
const News = require('../model/newsModel')

donatePlan = async (req, res, next) => {
 try {
  let {donationPlan} = req.body;
    let user = await User.findById({_id: req.user._id});
    if (user) await User.findByIdAndUpdate({_id: req.user._id}, {donationPlan: donationPlan});
    res.redirect('/dashboard/donate')
 } catch (error) {
  next(error)
 }
}

addUser = async(req, res, next) => {
  try {
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
      
        if (req.body.password1.length < 8 || req.body.password2.length < 8) {
          errors.push({ msg: 'Password must be at least 8 characters' });
        }
      
        if (errors.length > 0) {
          res.render('front-page/sign-up', {
            errors
          });
        } else {
          User.findOne({ email: newUser.email }).then(user => {
            if (user) {
              errors.push({ msg: 'Email already exists' });
              res.render('front-page/login', {errors});
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
                      res.render('front-page/login', {errors: {success: req.flash('user', true)}});
                    })
                    .catch(err => console.log(err));
                });
              });
            }
          });
        }
  } catch (error) {
    next(error)
  }
    
}
addSub = async (req, res, next) => {
    try {
      let subExist = await Subscriber.findOne({email: req.body.email})
      if (!subExist){
        const sub = new Subscriber({email: req.body.email})
        await sub.save()
        console.log('subscriber added')
        req.flash('thanks', 'subscribed')
        res.redirect('/');
        return;
      }
      res.redirect('/')
      
    } catch (error) {
      next(error)
    }
}
logOut = async(req, res, next) => {
  try {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/login');
    });
  } catch (error) {
    next(error)
  }
  
}

updateUser = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
  
}
sendMessage = async (req, res, next) => {
  try {
    let newMessage = {
    message: req.body.message,
    user: req.user._id,
    createdAt: Date.now()
  }
  if (newMessage.message){
    await new Message(newMessage).save()
    next()
  } else {
    res.render('dashboard/sendMessage')
  }
  } catch (error) {
    next(error)
  }
  
}
alertEmail = async(req, res, next) => {
  try {
    const email = (await User.find({}, 'email')).map(item => item.email);
  

const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: process.env.email,
      pass: process.env.password,
      port: 465,
      secure: true,
   }
});

const mailOptions = {
   from: process.env.email,
   to: email,
   subject: "VCO charity Org.",
   html: `<p>Greetings from VCO </p>
          <p>You have new message, please login to your account to see it!</p>
   <a href="http://localhost:3000/login">check your message</a>
   `
};

 transporter.sendMail(mailOptions, function(error, info){
   if(error){
      console.log(error);
   }else{
      console.log("Email sent: " + info.response);
   }
});
  res.redirect('/dashboard')
  } catch (error) {
    next(error)
  }
}
getMessage = async (req, res, next) => {
  try {
     let messages = await Message.find({}).sort({createdAt: -1})
    messages = messages.map(item => {
    return (
      {
        message: item.message,
        createdAt: moment(item.createdAt).format('DD MMMM YYYY'),
        _id: item._id
      }
    )
  })
  res.render('dashboard/dashboard', { messages })
  } catch (error) {
    next(error)
  }
 
}

sendNews = async (req, res, next) => {
  const image = req.body.image
  // reading file data
  const fileData = fs.readFile(image.path)
  
  // converting to binary
  const binary = Buffer.from(fileData)
  const newNews = new News({
    image: binary,
    link: req.body.link,
    text: req.body.text
  })
  console.log(newNews)
         await newNews.save()
  
  // saving in database
  
  
  // sending response back to client
  res.send("Done") 
}
deleteMessage = async (req, res, next) => {
  try {
    if (req.params._id){
    let deleted = await Message.findByIdAndDelete({_id: req.params._id});
    if (deleted){
      res.redirect('/dashboard')
      return
    }
    res.redirect('/dashboard')
  }
  res.redirect('/login')
  } catch (error) {
    next(error)
  }
  
}


module.exports = {
    addUser, logOut, updateUser, sendMessage,getMessage, alertEmail, donatePlan, addSub, sendNews, deleteMessage
}
