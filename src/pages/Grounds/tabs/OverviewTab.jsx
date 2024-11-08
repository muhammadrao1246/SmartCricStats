import React from "react";

import TeamListCard from "src/components/teams/TeamListCard";


import { useOutletContext } from "react-router-dom";
import { FindTeamImage, FindTeamLongName, FindTeamProfile } from "src/utils/utils";


function OverviewTab({ ground }) {
  
  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  React.useEffect(()=>{
    setProgress(100)
  }, [ground])

  return (
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
      <div className="iq-card-body">
        <div className="row">
          {
            ground.teams.length > 0 && (
              <>
                <div className="col-lg-12">
                  <h4 className="detail-ground-heading text-muted">Home Teams</h4>
                </div>
                <div className="col-lg-12 mt-2">
                  <div className="row no-gutters">
                    {
                      ground.teams.map((value, index)=>(
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
            ground.about.length > 0 && (
              <div className="col-lg-12 mt-3">
                {
                  ground.about.map((value, index)=>(
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
