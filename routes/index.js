const express = require('express');
const router = express.Router();
const Staff = require('../models/staff');
const Volunteer =  require('../models/volunteer');
const mid = require('../middleware');

// LOGIN INDEX.pug
// TODO: none

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
        req.session.admin = staff.admin;
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
//TODO: update, front-end sort

router.get('/view', mid.loggedIn, function(req, res, next){
  const id = req.session.userId;
  const admin = req.session.admin;
  if(admin){
    Volunteer.find({})
    .exec((err, vol) => {
      res.render('view', {vols: vol});
    });
  }else{
    Volunteer.find({parent: id})
    .exec((err, vol) => {
      res.render('view', {vols: vol});
    });
    }
  })


  router.post('/delete', function(req, res, next) {
    let userId = req.body.userId || req.query.userId;
    Volunteer.deleteOne({_id: userId}, function(err, res) {
      if (err) { res.json({"err": err});
    }
  });
  res.redirect('view');
});


// ADD NEW documents
// todo none
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

      Staff.create(staffData, function(error, staff){
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

  router.post('/addvol', function(req, res, next){
    if(
      req.body.name &&
      req.body.email &&
      req.body.phone &&
      req.body.region
    ){

      let voulunteerData = {
        email: req.body.email,
        phone: req.body.phone,
        name: req.body.name,
        region: req.body.region,
        parent: req.body.parent
      };


      Volunteer.create(voulunteerData, function(error, vol){
        if(error){
          return next(error);
        }else{
          return res.redirect('/view');
        }
      });

    }else{
      const err = new Error('All fields needed');
      err.status = 400;
      return next(err);
    }

  });

  // INIT page
  // todo: none

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

    router.get('/firstuser',  function(req, res, next){
      Staff.countDocuments(function(err, count){
        if(count > 0){
          return res.redirect('/');
        }else{
          return res.render('firstuser');
        }
      })
    })




    // Profile GET and POST
    // TODO: password change

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


    //LogOut
    // TODO: none
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

    module.exports = router;
