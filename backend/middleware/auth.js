const passport = require('../config/passport')

// const authenticated = passport.authenticate('jwt', { session: false })
const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (!user) {
      console.log(err)
      return res.status(401).json({
        status: 401,
        message: 'JWT token verification failed!'
      })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) {
      return next()
    }
    return res.json({ status: 400, message: 'you don\'t have authority to login!' })
  } else {
    return res.json({ status: 400, message: 'you don\'t have authority to login!' })
  }
}

module.exports = {
  authenticated,
  authenticatedAdmin
}
