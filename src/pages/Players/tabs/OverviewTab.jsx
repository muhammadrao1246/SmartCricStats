import React from "react";

import TeamListCard from "src/components/teams/TeamListCard";

import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import playerPlaceholder from "src/assets/images/player_placeholder.svg";
import { ROUTES } from "src/routes/urls";
import { useOutletContext } from "react-router-dom";
import { FindTeamImage, FindTeamLongName, FindTeamProfile } from "src/utils/utils";


function OverviewTab({ player }) {
  
  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  React.useEffect(()=>{
    setProgress(100)
  }, [player])

  return (
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
      <div className="iq-card-body">
        <div className="row">
          {
            player.teams.length > 0 && (
              <>
                <div className="col-lg-12">
                  <h4 className="detail_player_heading text-muted">Teams</h4>
                </div>
                <div className="col-lg-12 mt-2">
                  <div className="row no-gutters">
                    {
                      player.teams.map((value, index)=>(
                        <TeamListCard
                          key={index}
                          teamName={FindTeamLongName(value)}
                          teamImage={FindTeamImage(value)}
                          teamProfile={FindTeamProfile(value)}
                          colClass={"col-lg-4"}
                          cardClass={"p-2"}
                        />
                      ))
                    }
                  </div>
                </div>
              </>
            )
          }
          {
            player.bio.length > 0 && (
              <div className="col-lg-12 mt-3">
                {
                  player.bio.map((value, index)=>(
                    <p className="card-text detail-content" key={index} dangerouslySetInnerHTML={{__html: value}}>
                    </p>
                  ))
                }
              </div>
            )
          }
            
        </div>
      </div>
    </div>
  );
}

export default OverviewTab;
