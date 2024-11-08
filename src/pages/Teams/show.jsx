import axios from "axios";
import React from "react";
import { Link, useLoaderData, useLocation, useOutletContext } from "react-router-dom";

import TabList from "src/components/Layouts/TabList";


import "src/assets/css/teams.css"

import HomeTab from "./tabs/HomeTab";
import StatisticsTab from "./tabs/StatisticsTab";
import NewsTab from "./tabs/NewsTab";
import FixturesTab from "./tabs/FixturesTab";
import PlayersTab from "./tabs/PlayersTab";
import { FindTeamImage, FindTeamLongName } from "src/utils/utils";
import SideFixtures from "src/components/widgets/SideFixtures";
import RelatedNews from "src/components/widgets/RelatedNews";


let placeholder_data = {
  teams: [
    {
      "abbreviation": "TEAM A",
      "shortName": "TEAM A",
      "image": null,
      "score": "195-3",
      "scoreInfo": "19.5/20 Ov"
    },
    {
      "abbreviation": "TEAM B",
      "shortName": "TEAM B",
      "image": null,
      "score": "195-3",
      "scoreInfo": "19.5/20 Ov"
    }
  ],
  scores: {
      "TEAM A": {
          score: "124/2",
          overs: "15.6"
      },
      "TEAM B": {
          score: "124/2",
          overs: "15.6"
      }
  },
    "lastBatting": "TEAM A",
    "format": "TEST",
    "title": "1st Test",
    "status": "RESULT",
    teamOneName: "TEAM A",
    teamTwoName: "TEAM A",
    slug: "match-1",
    
    "statusText": "Live Matches Are Being Loaded..",
    "startDate": "2024-02-23T00:00:00.000Z",
    "startTime": "2024-02-23T04:00:00.000Z",
    "endDate": "2024-02-27T00:00:00.000Z"
  ,
  ground:{
    "shortName": "Stadium"
  },
  series:{
    "shortName": "Series",
    "isTrophy": false
  }
}


let TAB_MAP = {}

function TeamDetail() {

  const [progress, setProgress] = useOutletContext();

  // for sending an api call
  const responseJSON = useLoaderData() // the player data requested will be returned
  let team = responseJSON.data 

  // getting current url with search params like ?tab=overview
  const params = new URLSearchParams(useLocation().search)
  
  let TABBING_MAP = TAB_MAP
  
  // All tabs route with respect to the tab name defined
  let TABS_ARRAY = [
    {route: "home", name: "Home"},
    {route: "fixtures", name: "Fixtures & Results"},
  ]

  TABBING_MAP = {
    home : <HomeTab team={team} key={team.slug} onClick={()=>setTab("news")} />, 
    fixtures : <FixturesTab team={team}  key={team.slug} />,
  }
  
  if (team.isCountryTeam) {
    TABBING_MAP = {...TABBING_MAP,
      ...{players: <PlayersTab  team={team} key={team.slug} />}}
    TABS_ARRAY.push({route: "players", name: "Players"})
  }
  const otherTabs = {
    statistics : <StatisticsTab team={team}  key={team.slug} />,
    news : <NewsTab  team={team} key={team.slug} />,
  }
  TABBING_MAP = {...TABBING_MAP,  ...otherTabs}

  TABS_ARRAY = [...TABS_ARRAY, ...[
      {route: "statistics", name: "Statistics"},
      {route: "news", name: "News"},
    ]]
  

  
  const [tab, setTab] = React.useState(params.size == 0 ? TABS_ARRAY[0].route : params.get("tab", TABS_ARRAY[0].route))
  
  const [data, setData] = React.useState(null);
  // Array.from({length:20}, (value)=> value = placeholder_data)


  // fetching news about player
  React.useEffect(()=>{
    if (tab == "fixtures") {
      return
    }
    // making a network request to server to fetch stats data
      axios.get(`http://127.0.0.1:8000/api/teams/${team.slug}/fixtures?limit=short`, {
        method: "GET",
        params: {
        },
      })
      .then((response) => {
        // setProgress(100)
        setData(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [team])
  

  // here the page content is defined
  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-4" key={team.slug+"-container"}>
        <div className="row">
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              <div className="iq-card-body pt-2 pb-2">
                <div className="d-flex justify-content-start align-items-center w-100">
                    <img src={FindTeamImage(team)} alt="" 
                    className="avatar-60" />
                    <span className="team-title ml-3">{FindTeamLongName(team)} Cricket Team</span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            {
              tab != "fixtures" && (
                <SideFixtures onClick={()=>setTab("fixtures")}  data={data} viewMoreLink={`/teams/${team.slug}?tab=fixtures`}  key={team.slug} />
              )
            }
            
            {
              tab != "news" && tab != "home" && 
              <RelatedNews 
                key={team.slug + "-relatedNews"}
                queryParams={team.newsQuery}
                title={"Related News"}
                viewMoreLink={"?tab=news"}
                onClick={()=>setTab("news")}
              />
            }
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="row">
          <div className="col-lg-12">
            <TabList key={team.slug+"-tablist"} tabArray={TABS_ARRAY} currentTab={tab} onClick={setTab} />
          </div>
          <div className="col-lg-12">
              {TABBING_MAP[tab]}
          </div>
        </div>
      </div>
    </>
  );
}

export default TeamDetail