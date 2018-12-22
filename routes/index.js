const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');
const Volunteer =  require('../models/volunteer');
const mid = require('../middleware');

// LOGIN INDEX.pug

router.get('/',  function(req, res, next){
  if(){
    return res.render('firstuser');
  }
  return res.render('index');
})

router.post('/', function(req, res, next){
  if(req.body.email && req.body.password){
    Staff.authenticate(req.body.email, req.body.password, function(error, user){
      if(error || !user){
        let err = new Error('wrong password or email');
        err.status = 401;
        return next(err);
      }else{
        req.session.userId = user._id;
        return res.redirect('/view');
      }
    });
  }else{
    let err = new Error('wrong password or email');
    err.status = 401;
    return next(err);
  }
});

// GET LIST
router.get('/view', mid.loggedIn, function(req, res, next){
  return res.render('view');
})
router.get('/addnew', mid.loggedIn, function(req, res, next){
  return res.render('addnew');
})
router.get('/profile', mid.loggedIn, function(req, res, next){
  return res.render('profile', {Name: staff.name, email: staff.email, phone: staff.phone, password: staff.password});
})
router.post('/profile', function(req, res, next){
  let newData = {};
  if(req.body.name) newData.name = req.body.name;
  if(req.body.email) newData.email = req.body.email;
  if(req.body.phone) newData.phone = req.body.phone;
  if(req.body.passwords) newData.password = req.body.passwords;
  let id = staff._id;
  Staff.findByIdAndUpdate(id, { $set: {newData}}, { new: true }, function (err, tank) {
    if (err) return next(err);
    res.send(staff);
  });
});

router.post('/firstuser', function(req, res, next){
  if(req.body.name &&
     req.body.phone &&
     req.body.email &&
     req.body.password){
       if(req.body.password !== req.body.confirmPassword){
         let err = new Error('passwords do not match')
         err.status = 400;
         return next(err);
       }

  let rootUser = {
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    password: req.body.password,
    level: 1
  };

  Staff.create(rootUser, function(error, staff){
    if(error){
      console.log(error)
      return next(error)
    } else{
      req.session.userId = staff._id;
      return res.redirect('/view');
    }
  });

  } else {
    let err = new Error('All fields required');
    err.status = 400;
    return next(err);
  }
});

module.exports = router;
