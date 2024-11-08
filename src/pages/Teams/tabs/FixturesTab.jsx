import React from "react";
import axios from "axios";
import { Link, useOutletContext } from "react-router-dom";
import TableMaker from "src/components/Layouts/TableMaker";


import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import playerPlaceholder from "src/assets/images/player_placeholder.svg";
import { ROUTES } from "src/routes/urls";
import { FindGroundLongName, FindGroundProfile, FindMatchLink, FindSeriesLongName, FindSeriesProfile, FindTeamLongName } from "src/utils/utils";
import SmallMatchScoreCard from "src/components/livescore/SmallMatchScoreCard";
import DataNotFoundMessage from "src/components/Layouts/DataNotFoundMessage";
import LoadingSpinnerComponent from "src/components/Layouts/LoadingSpinnerComponent";


let sections = [
  "Debuts/Last Matches by Format",
  "Recent Matches in Each Format"
]

let columnsMap = {
  "TEST" : "Test Matches",
  "ODI": "ODI Matches",
  "T20": "T20 Matches"
}

function FixturesTab({ team }) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const [data, setData] = React.useState(null)


  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
    axios.get(`http://127.0.0.1:8000/api/teams/${team.slug}/fixtures`, {
      method: "GET",
      params: {
      },
    })
    .then((response) => {
      setProgress(100)
      setData(response.data.data);
    })
    .catch((error) => {
      console.log(error);
    });
      
  }, [team])


  // if data is loading
  if (data == null) {
    return <div className="col-lg-12">
      <LoadingSpinnerComponent  />
    </div>
  }
  // if no data returned against query 
  else if (Object.keys(data["groups"]).length == 0) {
    
    return <DataNotFoundMessage cardClass="p-4" message={"No Matches Found!"} />
  }
  
  
  //  if some data provided then print all
  return (
    
    <div className="row team-fixtures-container">
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-header d-flex justify-content-between">
            <div className="iq-header-title">
              <h4 className="card-title">
                {FindTeamLongName(team)} Results & Future Fixtures
              </h4>
            </div>
          </div>
        </div>
      </div>

      {
        Object.keys(data["groups"]).map((groupName, index)=>(
          <div className="col-lg-6" key={team.slug+"-"+groupName}>
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              <div className="iq-card-body">
                <div className="team-fixture-group-heading">{groupName}</div>
                <div className="row mt-3">
                  {
                    data["groups"][groupName].map((match, index)=>(
                      <div className="col-lg-12"
                            key={team.slug+"-"+match.slug}>
                          <SmallMatchScoreCard
                                team1={match["teams"][match["teamOneName"]]}
                                team2={match["teams"][match["teamTwoName"]]}
                                match={match}
                                stadium={match["ground"]}
                                series={match["series"]}
                                scores={match["scoresText"]}
                        />
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </div>
  );
}


export default FixturesTab;
