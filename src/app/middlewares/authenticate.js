const authenticate = (req, res, next) => {
    if (req.session.user) {
      return next();
    }
    return res.redirect("/users/login");
  };
  
  const authenticated = (req, res, next) => {
    if (req.session.user) {
      return res.redirect("/");
    }
    return next();
  };
  
module.exports = { authenticate, authenticated };