import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom';


import "./component.css"

// SeriesListCard.propTypes = {
//     SeriesName: PropTypes.string,
//     SeriesImages: PropTypes.any,
//     SeriesProfile: PropTypes.string,
//     startDate: PropTypes.string,    
//     endDate: PropTypes.string,
//     cardClass: PropTypes.string,
//     colClass: PropTypes.string
// }
const SeriesListCard = React.memo(function SeriesListCard({ SeriesName, SeriesImages, SeriesProfile, startDate, endDate, colClass, cardClass}) {
  return (
    <div className={colClass}>
        <Link to={SeriesProfile} className={`d-flex justify-content-between align-items-center  w-100 h-100 list-series-card  ${cardClass}`}>
            
          <div className="d-flex justify-content-start align-items-center  w-100 h-100">
            <span className="d-flex align-items-center justify-content-center list-series-image-container">
            {
                typeof SeriesImages == "string" ? (
                  <img src={SeriesImages} className="list-series-image avatar-40" />
                ):(
                  <>
                    {
                      SeriesImages.map((image, index) => (
                        <img key={image} src={image} className={`list-series-image-${(index+1)} avatar-40`} />
                      ))
                    }
                  </>
                )
              }
            </span>
            <div className="ml-3 d-flex justify-content-center flex-column">
              <span className="text-muted">{startDate} • {endDate}</span>
              <div className="list-series-name">{SeriesName}</div>
            </div>
          </div>
          
          <i className="ri-link series-rc-redirect-arrow "></i>
        </Link>
    </div>
  )
})

export default SeriesListCard