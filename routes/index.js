const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');
const Volunteer =  require('../models/volunteer');
const mid = require('../middleware');

// LOGIN INDEX.pug

router.get('/',  function(req, res, next){
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
router.get('/view', function(req, res, next){
  return res.render('view');
})
router.get('/addnew', function(req, res, next){
  return res.render('addnew');
})
router.get('/profile', function(req, res, next){
  return res.render('profile', {Name: staff.name,
  email: staff.email, phone: staff.phone, password: staff.password});
})

module.exports = router;
