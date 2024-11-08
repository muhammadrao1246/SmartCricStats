import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


import teamPlaceholder from "src/assets/images/team_placeholder.svg";

import "./components.css"

// PlayerListCard.propTypes = {
//     playerName: PropTypes.string,
//     playerImage: PropTypes.string,
//     playerProfile: PropTypes.string,
//     cardClass: PropTypes.string,
//     colClass: PropTypes.string
// }
const PlayerListCard = React.memo(function PlayerListCard({ playerName, nickName, age, playerImage, playerProfile, colClass, cardClass}) {
  return (
    <div className={colClass}>
        <Link to={playerProfile} className={`d-flex justify-content-start align-items-center  w-100 h-100 list-player-card  ${cardClass}`}>
            <img src={playerImage} className="list-player-image avatar-60" />
            <div className="d-flex justify-content-center flex-column ml-3">
              <div className="list-player-name">
                {playerName} {!!nickName && <small className="text-muted ml-2 list-player-8rem">({nickName})</small>}
              </div>
              {!!age && <span className="text-muted list-player-8rem">{age}</span>}
            </div>
        </Link>
    </div>
  )
})

export default PlayerListCard