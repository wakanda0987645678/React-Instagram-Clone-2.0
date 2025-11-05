import { post } from 'axios'
import Notify from 'handy-notification'
import d from './API/DOM'
import { ObjectMssg } from './utils'
import Action from './API/Action'

/**
 * For username checker
 * @param {String} el
 */
export const username_checker = el => {
  let element = new d(el)
  let uc = new d('.username_checker')

  element.on('keyup', async e => {
    let value = e.target.value
    uc.show()

    if (value) {
      let { data: count } = await post('/user/username-checker', { value })
      let html

      if (count == 0) {
        html =
          '<span class="checker_text">username is available</span><span class="checker_icon"><i class="far fa-smile"></i></span>'

        uc.mutipleCSS({
          width: '160px',
          right: '-188px',
        })
      } else {
        html =
          '<span class="checker_text">username already taken</span><span class="checker_icon"><i class="far fa-frown"></i></span>'

        uc.mutipleCSS({
          width: '167px',
          right: '-194px',
        })
      }

      uc.html(html)
    } else {
      uc.hide()
    }
  })

  element.on('blur', () => uc.hide())
}

/**
 * Common function for login & signup
 *
 * @param {Object} options Options
 * @param {Object} options.data
 * @param {String} options.btn
 * @param {String} options.url
 * @param {String} options.redirect
 * @param {String} options.defBtnValue
 */
export const commonLogin = options => {
  let { data, btn, url, redirect, defBtnValue } = options,
    overlay2 = new d('.overlay-2'),
    button = new d(btn),
    action = new Action(btn)

  action.start('Please wait..')

  post(url, data)
    .then(s => {
      let {
        data: { mssg, success },
      } = s

      if (success) {
        Notify({
          value: mssg,
          done: () => (location.href = redirect),
        })

        button.setValue('Redirecting..')
        overlay2.show()
      } else {
        Notify({
          value: ObjectMssg(mssg),
        })

        action.end(defBtnValue)
      }

      button.blur()
    })
    .catch(async e => {
      // Log the error to console for dev
      console.error('Login/Signup error:', e)

      // Notify the user generically
      try {
        Notify({ value: 'An error occured. Please try again later.' })
      } catch (nErr) {
        console.error('Failed to show notify:', nErr)
      }

      // Attempt to send the error to server for persistent logging
      try {
        // send minimal info to the server log endpoint
        await post('/api/log-client-error', {
          when: options.when || url,
          url: window.location.href,
          userAgent: navigator.userAgent,
          error: (e && e.message) || String(e),
          stack: (e && e.stack) || null,
        })
      } catch (logErr) {
        // swallow logging errors but print them in console
        console.error('Failed to POST client error to /api/log-client-error:', logErr)
      }

      action.end(defBtnValue)
    })
}
