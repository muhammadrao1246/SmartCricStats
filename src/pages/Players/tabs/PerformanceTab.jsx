import React from "react";

import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import playerPlaceholder from "src/assets/images/player_placeholder.svg";

function PerformanceTab({ player }) {
  return (
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
      <div className="iq-card-body">
        <div className="row">
          <div className="col-lg-12">
            <h4 className="detail_player_heading text-muted">Teams</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PerformanceTab;
