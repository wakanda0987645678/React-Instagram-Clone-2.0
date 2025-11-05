// MIDDLEWARES FOR EXPRESS

/** FOR CREATING LOCAL VARIABLES */
const variables = (req, res, next) => {
  let loggedIn = req.session.id ? true : false
  res.locals.loggedIn = loggedIn
  res.locals.session = req.session
  next()
}

/** FOR LOGGED IN USERS ONLY */
const LoggedIn = (req, res, next) => {
  if (!req.session.id) {
    // For API routes, return 401
    if (req.path.startsWith('/api/')) {
      return res.status(401).json({ mssg: 'Please login to perform this action' })
    }
    // For regular routes that require login (post/like/etc), redirect to login
    res.redirect('/login')
  } else {
    next()
  }
}

/** FOR NOT-LOGGED IN USERS ONLY */
const NotLoggedIn = (req, res, next) => {
  req.session.id ? res.redirect('/') : next()
}

/** FOR ACTIONS THAT REQUIRE LOGIN */
const ActionAuth = (req, res, next) => {
  if (!req.session.id) {
    res.status(401).json({ mssg: 'Please login to perform this action' })
  } else {
    next()
  }
}

module.exports = {
  variables,
  LoggedIn,
  NotLoggedIn,
  ActionAuth
}
