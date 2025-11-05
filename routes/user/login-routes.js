// ALL THE USER LOGIN-RELATED ROUTES ARE HANDLED BY THIS FILE

const app = require('express').Router(),
  db = require('../../config/db'),
  User = require('../../config/User'),
  mw = require('../../config/Middlewares'),
  { uniqBy } = require('lodash')

// USER LOGIN GET ROUTE
app.get('/login', mw.NotLoggedIn, (req, res) => {
  let options = {
    title: 'Login To Continue',
    users: req.cookies.users ? JSON.parse(req.cookies.users).slice(0, 15) : [],
  }
  res.render('login', { options })
})

// LOGS THE USER IN
app.post('/user/login', async (req, res) => {
  try {
    let {
      body: { username: rusername, password: rpassword },
      session,
    } = req

    req.checkBody('username', 'Username is empty!!').notEmpty()
    req.checkBody('password', 'Password field is empty!!').notEmpty()

    let errors = await req.getValidationResult()
    if (!errors.isEmpty()) {
      let array = []
      errors.array().forEach(e => array.push(e.msg))
      res.json({ mssg: array })
    } else {
      let [{ userCount, id, password, email_verified }] = await db.query(
        'SELECT COUNT(id) as userCount, id, password, email_verified from users WHERE username=? LIMIT 1',
        [rusername]
      )

      if (userCount == 0) {
        res.json({ mssg: 'User not found!!' })
      } else {
        let same = User.comparePassword(rpassword, password)
        if (!same) {
          res.json({ mssg: 'Wrong password!!' })
        } else {
          session.id = id
          session.username = rusername
          session.email_verified = email_verified
          session.isadmin = false

          await db.query('UPDATE users SET isOnline=? WHERE id=?', ['yes', id])

          res.json({
            mssg: `Welcome ${rusername}!!`,
            success: true,
          })
        }
      }
    }
  } catch (error) {
    // Log the error to a file for later inspection (do not log raw passwords)
    try {
      const fs = require('fs')
      const path = require('path')
      const logsDir = path.join(process.cwd(), 'logs')
      if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir)

      const file = path.join(logsDir, 'auth-errors.log')
      const body = Object.assign({}, req.body)
      if (body.password) body.password = '[MASKED]'

      const payload = {
        time: new Date().toISOString(),
        route: '/user/login',
        ip: req.ip || null,
        body,
        stack: (error && error.stack) || null,
      }

      fs.appendFileSync(file, JSON.stringify(payload) + '\n')
    } catch (e) {
      console.error('Failed to write auth error log:', e)
    }

    db.catchError(error, res)
  }
})

// LOGS USER OUT
app.get('/logout', mw.LoggedIn, async (req, res) => {
  try {
    let { id, username } = req.session,
      user = { id, username },
      oldUsers = req.cookies.users ? JSON.parse(req.cookies.users) : [],
      users = []

    oldUsers.map(o => users.push(o))
    let final = uniqBy([user, ...users], 'id')
    res.cookie('users', `${JSON.stringify(final)}`)

    let u = {
      isOnline: 'no',
      lastOnline: new Date().getTime(),
    }
    await db.query('UPDATE users SET ? WHERE id=?', [u, id])

    let url = req.session.reset() ? '/login' : '/'
    res.redirect(url)
  } catch (error) {
    console.log(error)
  }
})

module.exports = app
