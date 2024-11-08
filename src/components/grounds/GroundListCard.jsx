import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


import teamPlaceholder from "src/assets/images/team_placeholder.svg";

import "./components.css"

// GroundListCard.propTypes = {
//     groundLongName: PropTypes.string,
//     groundImage: PropTypes.string,
//     groundProfile: PropTypes.string,
//     cardClass: PropTypes.string,
//     colClass: PropTypes.string
// }
const GroundListCard = React.memo(function GroundListCard({ groundLongName, shortName, capacity, groundImage, groundProfile, colClass, cardClass}) {
  return (
    <div className={colClass}>
        <Link to={groundProfile} className={`row no-gutters w-100 h-100 list-ground-card  ${cardClass}`}>
            <img src={groundImage} className="list-ground-image img-fluid col-sm-4" />
            <div className="d-flex justify-content-start flex-column pl-3 col-sm-8">
              <div className="list-ground-name">
                {groundLongName} 
              </div>
              {!!shortName && <span className="text-muted list-ground-8rem">{shortName}</span>}
              {!!capacity && <span className="text-muted list-ground-8rem">Capacity: {capacity}</span>}
            </div>
        </Link>
    </div>
  )
})

export default GroundListCard