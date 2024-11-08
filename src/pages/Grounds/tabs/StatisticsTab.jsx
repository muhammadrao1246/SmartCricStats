import React from "react";

import { useOutletContext } from "react-router-dom";

import LoadingSpinnerComponent from "src/components/Layouts/LoadingSpinnerComponent";
import PlayerRecordList from "src/components/records/PlayerRecordList";
import { FindPlayerFaceImage, FindPlayerName, FindPlayerProfile, FindTeamImage, FindTeamLongName, FindTeamProfile } from "src/utils/utils";
import DataNotFoundMessage from "src/components/Layouts/DataNotFoundMessage";
import TeamRecordList from "src/components/records/TeamRecordList";


// player object will be passed from parent component
function StatisticsTab({ ground }) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const [data, setData] = React.useState(null)
  const [gender, setGender] = React.useState("M")


  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/grounds/${ground.slug}/statistics`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(response=>response.json())
      .then(response=>{
        setData(response.data)
        setProgress(100)
      })
      .catch(error=>{
        console.log(error)
      })
      
  }, [ground])

  
  // if data is loading
  if (data == null) {
    return <LoadingSpinnerComponent />
  }else if(data.total == 0){
    return <DataNotFoundMessage
        message={"No Statistics Found"} 
        cardClass="p-4"
      />
  }

  //  if some data provided then print all
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
          <div className="iq-card-header d-flex justify-content-between">
            <div className="iq-header-title">
              <h4 className="card-title"> Ground Stats and Records </h4>
            </div>
            <div className="iq-card-header-toolbar d-flex align-items-center">
                <select
                    className="form-select form-control form-control-sm select2"
                    style={{width: "200px"}}
                    onChange={(e) => {setGender(e.target.value)}}
                  >
                        <option value={"M"}>
                          {"Mens Statistics"}
                        </option>
                        <option value={"F"}>
                          {"Womens Statistics"}
                        </option>
                  </select>
            </div>
          </div>
        </div>
      </div>
      {
        data[gender].total > 0 && (
          <>
          {
            Object.keys(data[gender]["stats"]).map((typeName, index)=>(
              <StatsTypeComponent 
              key={ground.id+typeName}
                typeName={typeName}
                stats={data[gender]["stats"][typeName]}
              />
            ))
          }
          </>
        )
      }
    </div>
  );
}


function StatsTypeComponent({typeName, stats}) {
  if (stats.total == 0) {
    return <></>
  }
  console.log(stats)
  return (
    <>
    <div className="col-lg-12">
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
        <div className="iq-card-header d-flex justify-content-between">
          <div className="iq-header-title">
            <h4 className="card-title"> {typeName}</h4>
          </div>
        </div>
      </div>
    </div>
    {
      Object.keys(stats["stats"]).map((recordName, index)=>(
        <StatsRecordTypeGroupComponent
          key={typeName+"-"+recordName}
          typeName = {typeName}
          recordName={recordName}
          stats={stats["stats"][recordName]}
          attribute={stats["stats"][recordName]["attribute"]} 
        />
      ))
    }
    </>
  );
}



function StatsRecordTypeGroupComponent({recordName, typeName, stats, attribute, colClass}) {

  if (stats.total == 0) {
    return <></>
  }
  console.log(recordName, stats)
  let pColClass = "col-lg-12", pCardClass="pt-2 pb-3"
  let bigColClass = typeName == "Teams Statistics" ?  "col-lg-6" : "col-lg-4"

  return (
    
    <div className={bigColClass}>
    <div className="iq-card iq-card-block iq-card-stretch p-0">
      <div className="iq-card-body">
        <div className="ground-statistics-group-format-heading">              
          {recordName}
        </div>
        <div className="row no-gutters mt-3">
          {
            stats["stats"].map((stat, index) => (
              <>
              {
                typeName == "Teams Statistics" ? (
                  <TeamRecordList
                    key={recordName+"-"+FindTeamLongName(stat.team)}
                    colClass={pColClass}
                    cardClass={pCardClass}
                    shortName={stat.team.shortName}
                    teamName={FindTeamLongName(stat.team)}
                    teamImage={FindTeamImage(stat.team)}
                    teamProfile={FindTeamProfile(stat.team)}
                    innings={stat.innings}
                    average={stat.average}
                    points={stat[attribute]} 
                  />
                ):(
                  <PlayerRecordList
                    key={recordName+"-"+FindPlayerName(stat.player)}
                    colClass={pColClass}
                    cardClass={pCardClass}
                    teamShortName={stat.team.shortName}
                    playerName={FindPlayerName(stat.player)}
                    playerImage={FindPlayerFaceImage(stat.player)}
                    playerProfile={FindPlayerProfile(stat.player)}
                    innings={stat.innings}
                    average={stat.average}
                    points={stat[attribute]} 
                  />
                )
              }
              </>
            ))
          }
          
        </div>
      </div>
    </div>
  </div>
  )
}


export default StatisticsTab;
