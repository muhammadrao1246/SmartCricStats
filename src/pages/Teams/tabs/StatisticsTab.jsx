import React, { useState } from "react";

import { useOutletContext } from "react-router-dom";

import LoadingSpinnerComponent from "src/components/Layouts/LoadingSpinnerComponent";
import PlayerRecordList from "src/components/records/PlayerRecordList";
import { FindPlayerFaceImage, FindPlayerName, FindPlayerProfile } from "src/utils/utils";
import DataNotFoundMessage from "src/components/Layouts/DataNotFoundMessage";



// player object will be passed from parent component
function StatisticsTab({ team }) {

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const [data, setData] = useState(null)

  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/teams/${team.slug}/statistics`, {
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
      
  }, [team])


  // if data is loading
  if (data == null) {
    return <LoadingSpinnerComponent />
  }else if(data.total == 0){
    return <div className="row">
      <DataNotFoundMessage
        cardClass="p-4"
        message={"No Statistics Found"} 
      />
    </div>
  }
  
  //  if some data provided then print all
  return (
    <div className="row">
      {
        Object.keys(data.stats).map((typeName, index)=>(
          <>
          {
            data.stats[typeName].total > 0 && (    
              <StatsTypeComponent
                key={team.id+"-"+typeName}
                typeName={typeName}
                stats={data.stats[typeName].stats}
                attribute={data.stats[typeName].attribute}
              />
            )
          }
          </>
        ))
      }
    </div>
  );
}

function StatsTypeComponent({typeName, stats, attribute}) {

  return (
    <>
    <div className="col-lg-12">
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
        <div className="iq-card-header d-flex justify-content-between">
          <div className="iq-header-title">
            <h4 className="card-title"> {typeName} <span className="text-muted ml-2 small">(in last year)</span></h4>
          </div>
        </div>
      </div>
    </div>
    {
      Object.keys(stats).map((formatName, index)=>(
        <StatsFormatGroupComponent
          key={typeName+"-"+formatName}
          formatName={formatName}
          stats={stats[formatName]}
          attribute={attribute} 
        />
      ))
    }
    </>
  );
}

let format_map = {
  T20I : "text-danger",
  T20: "text-danger",
  ODI : "text-info",
  TEST : "text-success",
}

function StatsFormatGroupComponent({formatName, stats, attribute, colClass}) {

  let pColClass = "col-lg-12", pCardClass="pt-2 pb-3"
  return (
    
    <div className="col-lg-4">
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
      <div className="iq-card-body">
        <div className="team-statistics-group-format-heading">              
          <span className={`${format_map[formatName]}`}>{formatName}</span> | <span className="text-dark"> FORMAT</span>
        </div>
        <div className="row no-gutters mt-3">
          {
            stats.map((stat, index) => (
              <PlayerRecordList
                key={formatName+"-"+FindPlayerName(stat.player)}
                colClass={pColClass}
                cardClass={pCardClass}
                playerName={FindPlayerName(stat.player)}
                playerImage={FindPlayerFaceImage(stat.player)}
                playerProfile={FindPlayerProfile(stat.player)}
                innings={stat.innings}
                average={stat.average}
                points={stat[attribute]} 
              />
            ))
          }
          
        </div>
      </div>
    </div>
  </div>
  )
}

export default StatisticsTab;
