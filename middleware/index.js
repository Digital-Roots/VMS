function loggedOut(req, res, next){
  if(req.session && req.session.userId){
    return res.redirect('/profile');
  }
  return next();
}

function loggedIn(req, res, next){
  if(req.session && req.session.userId){
    return next();
  }
  const err = new Error('must be logged in to view this page');
  err.status = 401;
  return res.redirect('/');
}
module.exports.loggedIn = loggedIn;
module.exports.loggedOut = loggedOut;
