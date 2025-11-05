import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import {
  FaUser,
  FaHome,
  FaCompass,
  FaBell,
  FaEnvelope,
  FaBookmark,
  FaImages,
  FaHeart,
  FaUsers,
  FaStar,
  FaUserEdit,
  FaCog,
  FaSignOutAlt,
  FaShieldAlt,
  FaQuestionCircle,
} from 'react-icons/fa'

// Map the icon name strings used across the app to react-icons components
const ICONS = {
  user: FaUser,
  home: FaHome,
  compass: FaCompass,
  bell: FaBell,
  envelope: FaEnvelope,
  bookmark: FaBookmark,
  images: FaImages,
  heart: FaHeart,
  users: FaUsers,
  star: FaStar,
  'user-edit': FaUserEdit,
  cog: FaCog,
  'sign-out-alt': FaSignOutAlt,
  'shield-alt': FaShieldAlt,
}

const FAIcon = ({ icon, className, size = 18, style = {}, ...props }) => {
  const Icon = ICONS[icon] || FaQuestionCircle
  return (
    <Icon
      className={classNames('fa-icon', className)}
      size={size}
      style={style}
      {...props}
    />
  )
}

FAIcon.propTypes = {
  icon: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
}

export default FAIcon
