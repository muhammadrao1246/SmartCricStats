import React from 'react'
import TabList from 'src/components/Layouts/TabList';
import TeamsRankingTab from './TeamsRankingTab';
import PlayersRankingTab from './PlayersRankingTab';
import { useLocation, useOutletContext } from 'react-router-dom';


import "src/assets/css/rankings.css";

// All tabs route with respect to the tab name defined
let TABS_ARRAY = [
  {route: "team", name: "ICC Team Rankings"},
  {route: "player", name: "ICC Player Rankings"},
]
// map route to the component
// let tab_to_component_map = {
//   team: <TeamsRankingTab />,
//   player: <PlayersRankingTab />,
// }

function Rankings() {
  const [progress, setProgress] = useOutletContext();
  
  const params = new URLSearchParams(useLocation().search)
  const [typeTab, setTypeTab] = React.useState(params.size > 0 ? params.get("tab", TABS_ARRAY[0].route) : TABS_ARRAY[0].route)
  
  // for just showing of that page has loaded
  React.useEffect(()=>{
    setProgress(30)
    setTimeout(() => {
      setProgress(100)
    }, 2000);
  },[])

  return (
    <>
    <div className="col-lg-12">
      <TabList
        tabArray={TABS_ARRAY}
        currentTab={typeTab}
        onClick={setTypeTab}
      />
    </div>
    <div className="col-lg-12">
      
      <div className={`${(typeTab == "team" ? "" : "d-none")}`}>
        <TeamsRankingTab />
      </div>
      <div className={`${(typeTab == "player" ? "" : "d-none")}`}>
        <PlayersRankingTab />
      </div>
      
    </div>
    </>
  )
}

export default Rankings