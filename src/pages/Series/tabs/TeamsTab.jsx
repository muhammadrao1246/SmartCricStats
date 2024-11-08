import React from "react";
import { useOutletContext } from "react-router-dom";

import TeamListCard from "src/components/teams/TeamListCard";
import { FindTeamImage, FindTeamLongName, FindTeamProfile } from 'src/utils/utils';


function TeamsTab({ series }) {
  
  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  // fetching news about player
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    setTimeout(() => {
      setProgress(100)
    }, 1000);
  }, [series])

  
  let colClass = "col-lg-4", cardClass = "p-3 pl-2 pr-2"

  return (
  <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
      <div className="iq-card-header d-flex justify-content-between">
        <div className="iq-header-title">
          <h4 className="card-title"> Teams</h4>
        </div>
      </div>
      <div className="iq-card-body pt-0">
        <div className="row no-gutters">
          {
            series.teams.map((team, index)=>(
              <TeamListCard
                key={series.slug+"-"+team.slug}
                teamName={FindTeamLongName(team)}
                teamImage={FindTeamImage(team)}
                teamProfile={FindTeamProfile(team)}
                colClass={colClass}
                cardClass={cardClass}
              />    
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default TeamsTab;
