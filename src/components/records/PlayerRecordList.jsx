import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


import "./components.css"

PlayerRecordList.propTypes = {
    playerName: PropTypes.string,
    teamShortName: PropTypes.string,
    playerImage: PropTypes.string,
    playerProfile: PropTypes.string,
    stats: PropTypes.object,
    cardClass: PropTypes.string,
    colClass: PropTypes.string
}
function PlayerRecordList({ playerName, teamShortName, playerImage, playerProfile, innings, average, points, colClass, cardClass}) {
  return (
    <div className={colClass}>
        <Link to={playerProfile} className={`d-flex justify-content-start align-items-center  w-100 h-100 stats-player-card  ${cardClass}`}>
            <img src={playerImage} className="stats-player-image avatar-60" />
            <div className="d-flex justify-content-center flex-column stats-player-base-container ml-2 pl-1">
              <div className="stats-player-name">{playerName} {!!teamShortName && <span className="text-muted ml-2">({teamShortName})</span>}</div>
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

export default PlayerRecordList