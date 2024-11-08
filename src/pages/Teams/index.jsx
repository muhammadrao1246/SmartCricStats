import axios from "axios";
import React from "react";
import { useLoaderData, useOutletContext, useParams } from "react-router-dom";

import "src/assets/css/teams.css"

import TeamListCard from 'src/components/teams/TeamListCard';
import { FindTeamImage, FindTeamLongName, FindTeamProfile } from 'src/utils/utils';


function Teams() {


  const data = useLoaderData().data;

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  React.useEffect(()=>{
    setProgress(100)
  }, [])




  return (
    <>
    <div className="col-lg-12">
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
        <div className=" p-3 d-flex justify-content-center w-100 ">
        <div className="title-heading">Popular Cricket Teams</div>
        </div>
      </div>
    </div>
    {
      Object.keys(data).map((groupName, index) => (
        <TeamGroupComponent key={groupName} groupName={groupName} teamsData={data[groupName]} />
      ))
    }
    </>
  );
}

function TeamGroupComponent({groupName, teamsData}) {
  let colClass = "col-lg-4", cardClass = "p-3 pl-2 pr-2"
  return (
    <div className="col-lg-12 team-list-container">
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
        <div className="iq-card-body">
          <div className="group-title-heading">{groupName}</div>
          <div className="row no-gutters mt-3">
            {teamsData.map((team, index) => (
              <TeamListCard
                key={team.slug}
                teamName={FindTeamLongName(team)}
                teamImage={FindTeamImage(team)}
                teamProfile={FindTeamProfile(team)}
                colClass={colClass}
                cardClass={cardClass}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default Teams