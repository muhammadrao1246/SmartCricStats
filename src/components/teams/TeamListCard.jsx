// import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


import teamPlaceholder from "src/assets/images/team_placeholder.svg";

import "./component.css"

TeamListCard.propTypes = {
    teamName: PropTypes.string,
    teamImage: PropTypes.string,
    teamProfile: PropTypes.string,
    cardClass: PropTypes.string,
    colClass: PropTypes.string
}
function TeamListCard({ teamName, teamImage, teamProfile, colClass, cardClass}) {
  return (
    <div className={colClass}>
        <Link to={teamProfile} className={`d-flex justify-content-start align-items-center  w-100 h-100 list-team-card  ${cardClass}`}>
            <img src={teamImage} className="list-team-image avatar-40" />
            <div className="ml-3 list-team-name">{teamName}</div>
        </Link>
    </div>
  )
}

export default TeamListCard