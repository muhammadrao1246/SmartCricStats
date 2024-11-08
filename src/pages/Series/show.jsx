import axios from "axios";
import React from "react";
import { Link, useLoaderData, useLocation, useOutletContext } from "react-router-dom";

import TabList from "src/components/Layouts/TabList";


import "src/assets/css/series.css"

import HomeTab from "./tabs/HomeTab";
import StatisticsTab from "./tabs/StatisticsTab";
import NewsTab from "./tabs/NewsTab";
import FixturesTab from "./tabs/FixturesTab";
import TeamsTab from "./tabs/TeamsTab";


import SideFixtures from "src/components/widgets/SideFixtures";
import { FindSeriesImage, FindSeriesLongName, FindSeriesSeason } from "src/utils/utils";
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


// All tabs route with respect to the tab name defined
let TABS_ARRAY = [
  {route: "home", name: "Home"},
  {route: "fixtures", name: "Fixtures & Results"},
  {route: "teams", name: "Teams"},
  {route: "statistics", name: "Statistics"},
  {route: "news", name: "News"},
]


let TAB_MAP = {}


function SeriesDetail() {

  const [progress, setProgress] = useOutletContext();

  // for sending an api call
  const responseJSON = useLoaderData() // the player data requested will be returned
  let series = responseJSON.data 

  // getting current url with search params like ?tab=overview
  const params = new URLSearchParams(useLocation().search)
  const [tab, setTab] = React.useState(params.size == 0 ? TABS_ARRAY[0].route : params.get("tab", TABS_ARRAY[0].route))
  

  const TABBING_MAP = {
    home : <HomeTab series={series} key={series.slug} onClick={()=>setTab("news")} />, 
    fixtures : <FixturesTab series={series}  key={series.slug} />,
    teams : <TeamsTab series={series} key={series.slug} />, 
    statistics : <StatisticsTab series={series}  key={series.slug} />,
    news : <NewsTab series={series} key={series.slug} />,
  }
  
  
  const [data, setData] = React.useState(null);
  // Array.from({length:20}, (value)=> value = placeholder_data)


  // fetching news about player
  React.useEffect(()=>{
    if (tab == "fixtures") {
      return
    }
    // making a network request to server to fetch stats data
      axios.get(`http://127.0.0.1:8000/api/series/${series.slug}/fixtures?limit=short`, {
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
  }, [series])
  

  // here the page content is defined
  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-4" key={series.slug+"-container"}>
        <div className="row">
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              <div className="iq-card-body series-show-container pt-2 pb-2">
                <div className="d-flex justify-content-start align-items-center w-100">
                <span className="d-flex align-items-center justify-content-center list-series-image-container">
                  {
                      typeof FindSeriesImage(series) == "object" ? (
                        <>
                          {
                            FindSeriesImage(series).map((image, index) => (
                              <img key={image} src={image} className={`list-series-image-${(index+1)} avatar-40`} />
                            ))
                          }
                        </>
                      ):(
                        <img src={FindSeriesImage(series)} className="avatar-60" />
                      )
                        }
                </span>
                  <span className="d-flex ml-2 justify-content-center flex-column">
                    {series.season != null && <span className="text-muted series-season">{FindSeriesSeason(series)}</span>}
                    <span className="series-title">{FindSeriesLongName(series)}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            {
              tab != "fixtures" && (
                <SideFixtures onClick={()=>setTab("fixtures")} data={data} viewMoreLink={`/series/${series.slug}?tab=fixtures`}  key={series.slug} />
              )
            }
            {
              tab != "news" && tab != "home" && 
              <RelatedNews 
                key={series.slug + "-relatedNews"}
                queryParams={series.newsQuery}
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
            <TabList key={series.slug+"-tablist"} tabArray={TABS_ARRAY} currentTab={tab} onClick={setTab} />
          </div>
          <div className="col-lg-12">
              {TABBING_MAP[tab]}
          </div>
        </div>
      </div>
    </>
  );
}

export default SeriesDetail