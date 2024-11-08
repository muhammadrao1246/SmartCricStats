import React, { useState } from "react";

import { useOutletContext } from "react-router-dom";

import LoadingSpinnerComponent from "src/components/Layouts/LoadingSpinnerComponent";
import PlayerRecordList from "src/components/records/PlayerRecordList";
import { FindPlayerFaceImage, FindPlayerName, FindPlayerProfile } from "src/utils/utils";
import DataNotFoundMessage from "src/components/Layouts/DataNotFoundMessage";



// player object will be passed from parent component
function StatisticsTab({ series }) {

  
  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  const [data, setData] = useState({total: 0, loading: true})

  // fetching player stats
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      fetch(`http://127.0.0.1:8000/api/series/${series.slug}/statistics`, {
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
      
  }, [series])


  // if data is loading
  if (!!data.loading) {
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
      {
        Object.keys(data.stats).map((recordName, index)=>(
          <>
          {
            data.stats[recordName].total > 0 && (    
              <StatsRecordTypeGroupComponent
                key={recordName+"-"+series.id}
                recordName={recordName}
                stats={data.stats[recordName].stats}
                attribute={data.stats[recordName].attribute} 
              />
            )
          }
          </>
        ))
      }
    </div>
  );
}


function StatsRecordTypeGroupComponent({recordName, stats, attribute, colClass}) {

  let pColClass = "col-lg-12", pCardClass="pt-2 pb-3"
  return (
    
    <div className="col-lg-4">
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height p-0">
      <div className="iq-card-body">
        <div className="series-statistics-group-format-heading">              
          {recordName}
        </div>
        <div className="row no-gutters mt-3">
          {
            stats.map((stat, index) => (
              <PlayerRecordList
                key={recordName+"-"+FindPlayerName(stat.player)}
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
