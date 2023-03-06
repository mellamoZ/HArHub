const localStrategy = require("passport-local").Strategy;

function initialize(passport, getUserByEmail) {
  const authenticateUser = (email, password, done) => {
    const user = getUserByEmail(email);

    if (user == null) {
      return done(null, false, { message: "Admin login failed" });
    }
    try {
      if (foundOne.password == password) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password incorrect" });
      }
    } catch (e) {
      return done(e);
    }
  };

  passport.use(new localStrategy({ userNameField: "email" }, authenticateUser));

  passport.serializeUser((user, done) => {});
  passport.deserializeUser((id, done) => {});
}

module.exports = initialize;
