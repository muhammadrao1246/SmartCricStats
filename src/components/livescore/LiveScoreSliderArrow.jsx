// import React from 'react'
import PropTypes from 'prop-types'

LiveScoreSliderArrow.propTypes = {
  className : PropTypes.string,
  onClick : PropTypes.func,
  style : PropTypes.object,
}
function LiveScoreSliderArrow(props) {
  const {className, style, onClick} = props;
  let arrow_direction = className.search("slick-prev") != -1 ? "left" : "right";
  let class_by_direction = {
    left: className.replace("slick-prev", ""),
    right: className.replace("slick-next", "")
  }

  let hide_flag_class = className.search("slick-disabled") != -1 ? " d-none" : "" 
  return (
    <button style={{...style, top: "unset", lineHeight: "normal"}} className={class_by_direction[arrow_direction] + hide_flag_class + ` p-1 shadow border text-black rounded ri-arrow-${arrow_direction}-s-line ${arrow_direction}`} onClick={onClick}></button>
  )
}

export default LiveScoreSliderArrow