import React from 'react'
import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import FontAwesomeIcon from '../icons/font-awesome-icon'

const SidebarLink = ({ label, link, showNumbers, numbers, icon }) => {
  return (
    <li className="m_n_li">
      <NavLink
        to={link}
        exact
        activeClassName="sidebar_active"
        className="m_n_a"
      >
        {icon && (
          <span className="m_n_icon">
            <FontAwesomeIcon icon={icon} />
          </span>
        )}
        <span className="m_n_text">{label}</span>
        {showNumbers && numbers ? (
          <span className="m_n_new">{numbers > 9 ? '+' : numbers}</span>
        ) : null}
      </NavLink>
    </li>
  )
}

SidebarLink.defaultProps = {
  showNumbers: false,
  numbers: 0,
  icon: '',
}

SidebarLink.propTypes = {
  label: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  showNumbers: PropTypes.bool,
  numbers: PropTypes.number,
  icon: PropTypes.string,
}

export default SidebarLink
