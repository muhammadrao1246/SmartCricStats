import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


import "./components.css"

TeamRecordList.propTypes = {
    teamName: PropTypes.string,
    teamImage: PropTypes.string,
    teamProfile: PropTypes.string,
    cardClass: PropTypes.string,
    colClass: PropTypes.string
}
function TeamRecordList({ teamName, shortName, teamImage, teamProfile, innings, average, points, colClass, cardClass}) {
  return (
    <div className={colClass}>
        <Link to={teamProfile} className={`d-flex justify-content-start align-items-center  w-100 h-100 stats-team-card  ${cardClass}`}>
            <img src={teamImage} className="stats-team-image avatar-70" />
            <div className="d-flex justify-content-center flex-column stats-team-base-container ml-3 pl-1">
              <div className="stats-team-name">{teamName} {!!shortName && <span className="text-muted ml-2">({shortName})</span>}</div>
              <span className="stats-points-number">
                {points}
              </span>
              <div className="d-flex justify-content-between text-muted small">
                Innings: {innings} • Average: {average}
              </div>
              
            </div>
            
        </Link>
    </div>
  )
}

export default TeamRecordList