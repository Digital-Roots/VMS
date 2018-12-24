const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');
const Volunteer =  require('../models/volunteer');
const mid = require('../middleware');

// LOGIN INDEX.pug
// TODO: redirct to first user when there are zero documents in staffs collection

router.get('/', mid.loggedOut, function(req, res, next){
  return res.render('index', {title: 'Login'});
})

router.post('/login', function(req, res, next) {
  if (req.body.email && req.body.password) {
    Staff.authenticate(req.body.email, req.body.password, function (error, staff) {
      if (error || !staff) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      }  else {
        req.session.userId = staff._id;
        return res.redirect('/view');
      }
    });
  } else {
    var err = new Error('Email and password are required.');
    err.status = 401;
    return next(err);
  }
});


// VIEW members and volunteers
//TODO: add update, delete, sort, different admin levels
router.get('/view', mid.loggedIn, function(req, res, next){
  return res.render('view', {title: 'Member List'});
})

// ADD NEW documents
// todo finish with events
router.get('/addnew', mid.loggedIn, function(req, res, next){
  const id = req.session.userId;
  Staff.findById(id).exec(function(error, staff){
    if(error){
      return next(error);
    }else{
      return res.render('addnew', {title: 'Add New Person', admin: staff.admin, parent: id});
    }
  });
})
router.post('/addstaff', function(req,res,next){
  if(req.body.name &&
     req.body.phone &&
     req.body.email &&
     req.body.password &&
     req.body.confirmPassword){

      if( req.body.password !== req.body.confirmPassword){

        const err = new Error('Passwords do not match');
        err.status = 400;
        return next(err);

      }

      let staffData = {

        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
        password: req.body.password,
        admin: req.body.admin

      };

      Staff.create(staffData, function(error, user){
        if(error){
          return next(error);
        } else{
          return res.redirect('/view');
        }
      });

    } else {
      const err = new Error('All fields required.');
      err.status = 400;
      return next(err);
    }
});












// INIT page todo:
// auto redirct from index when there isn't any documents in staffs collection

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
    admin: true
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

router.get('/logout', function(req, res, next){
  if(req.session){
    req.session.destroy(function(err){
      if(err){
        return next(err);
      } else{
        return res.redirect('/');
      }
    });
  }
});

router.get('/firstuser', function(req, res, next){
  return res.render('firstuser');
})




// Profile GET and POST
// TODO: css layout ADD password change

router.get('/profile', mid.loggedIn, function(req, res, next){
  Staff.findById(req.session.userId)
      .exec(function(error, staff){
        if(error){
          return next(error);
        } else{
          return res.render('profile', {name: staff.name, email: staff.email, phone: staff.phone, title: 'profile'});
        }
      });
});
router.post('/edit-profile', function(req, res, next){
  let newData = {};
  if(req.body.name) newData.name = req.body.name;
  if(req.body.email) newData.email = req.body.email;
  if(req.body.phone) newData.phone = req.body.phone;
  let id = req.session.userId;
  Staff.findOneAndUpdate(id, newData, { new: true }, function (err, staff) {
    if (err) return next(err);
    res.redirect('/profile');
  });
});

module.exports = router;
