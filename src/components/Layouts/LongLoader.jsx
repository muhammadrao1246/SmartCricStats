import React from 'react'

import "src/assets/css/report-loader.css"

function LongLoader() {
  return (
    // <div className="report-loader"></div>
    <div className="report-loader mt-4">
      <div className="loader_cogs">
        <div className="loader_cogs__top">
          <div className="top_part"></div>
          <div className="top_part"></div>
          <div className="top_part"></div>
          <div className="top_hole"></div>
        </div>
        <div className="loader_cogs__left">
          <div className="left_part"></div>
          <div className="left_part"></div>
          <div className="left_part"></div>
          <div className="left_hole"></div>
        </div>
        <div className="loader_cogs__bottom">
          <div className="bottom_part"></div>
          <div className="bottom_part"></div>
          <div className="bottom_part"></div>
          <div className="bottom_hole"></div>
        </div>
      </div>
    </div>
  );
}

export default LongLoader