import React from 'react'
import { isAdmin } from '../../../utils/admin-utils'
import { NavLink } from 'react-router-dom'
import { post } from 'axios'
import Notify from 'handy-notification'
import PropTypes from 'prop-types'
import SidebarBottom from './bottom'
import SidebarLink from './link'
import { uData } from '../../../utils/utils'
import FontAwesomeIcon from '../icons/font-awesome-icon'

const SideBar = ({ uc, un }) => {
  let username = uData('username')
  let profile = `/profile/${username}`

  let adminLogout = async e => {
    e.preventDefault()
    await post('/api/admin-logout')
    Notify({
      value: 'Logged out as admin',
      done: () => location.reload(),
    })
  }

  return (
    <div className="m_n_wrapper">
      <div className="m_n">
        <ul className="m_n_ul">
          <SidebarLink link={profile} label={`@${username}`} icon="user" />
          <SidebarLink link="/" label="Home" icon="home" />
          <SidebarLink link="/explore" label="Explore" icon="compass" />
          <SidebarLink
            link="/notifications"
            label="Notifications"
            showNumbers
            numbers={un}
            icon="bell"
          />
          <SidebarLink
            link="/messages"
            label="Messages"
            showNumbers
            numbers={uc}
            icon="envelope"
          />
          <SidebarLink
            link={`${profile}/bookmarks`}
            label="Bookmarks"
            icon="bookmark"
          />
          <SidebarLink
            link={`${profile}/gallery`}
            label="Gallery"
            icon="images"
          />
          <SidebarLink
            link={`${profile}/favourites`}
            label="Favourites"
            icon="heart"
          />
          <SidebarLink link={`${profile}/groups`} label="Groups" icon="users" />
          <SidebarLink
            link={`${profile}/recommendations`}
            label="Recommendations"
            icon="star"
          />
          <SidebarLink
            link="/edit-profile"
            label="Edit profile"
            icon="user-edit"
          />
          <SidebarLink link="/settings" label="Settings" icon="cog" />
          <li>
            {isAdmin() ? (
              <a href="#" className="admin-logout" onClick={adminLogout}>
                <span className="m_n_icon">
                  <FontAwesomeIcon icon="sign-out-alt" />
                </span>
                <span className="m_n_text">Log out as admin</span>
              </a>
            ) : (
              <NavLink
                to={`/admin-login?to=${location.pathname}`}
                className="m_n_a_admin"
              >
                <span className="m_n_icon">
                  <FontAwesomeIcon icon="shield-alt" />
                </span>
                <span className="m_n_text">Are you admin?</span>
              </NavLink>
            )}
          </li>
        </ul>
      </div>

      <SidebarBottom />
    </div>
  )
}

SideBar.propTypes = {
  un: PropTypes.number.isRequired,
  uc: PropTypes.number.isRequired,
}

export default SideBar
