const authenticate = (req, res, next) => {
    if (req.session.User) {
      return res.redirect("/");
    }
    return res.redirect("/users/login");
  };
  
  const authenticated = (req, res, next) => {
    if (req.session.User) {
      return res.redirect("/");
    }
    return next();
  };
  
module.exports = { authenticate, authenticated };