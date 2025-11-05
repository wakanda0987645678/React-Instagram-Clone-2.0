import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const LoginPrompt = ({ message }) => {
  return (
    <div className="login_prompt">
      <span>{message || 'Please'} </span>
      <Link to="/login">login</Link>
      <span> or </span>
      <Link to="/signup">signup</Link>
      <span> to continue</span>
    </div>
  )
}

LoginPrompt.propTypes = {
  message: PropTypes.string,
}

export default LoginPrompt
