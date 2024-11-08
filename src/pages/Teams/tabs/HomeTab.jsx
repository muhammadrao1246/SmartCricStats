import axios from "axios";
import React from "react";
import { Link, useOutletContext } from "react-router-dom";
import DataNotFoundMessage from "src/components/Layouts/DataNotFoundMessage";
import ViewMoreAnchor from "src/components/Layouts/ViewMoreAnchor";

import BigHorizontalCard from "src/components/news/BigHorizontalCard";
import { FindTeamLongName } from "src/utils/utils";


let placeholder_news = [null, null, null, null]
function HomeTab({team, onClick}) {
  
  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  // declaring data states
  // will hold the news data
  const [news, setNews] = React.useState(placeholder_news);
  

  // total news to show on home page
  let SIZE = React.useRef(10)


  // fetching news about player
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      axios.get("http://127.0.0.1:8000/api/news/", {
        method: "GET",
        params: {...{
          page_size: 10,
          ordering: "-publishedAt"
        }, ...team.newsQuery},
      })
      .then((response) => {
        setProgress(100)
        setNews(response.data.data.results);
        
      })
      .catch((error) => {
        console.log(error);
      });
      
  }, [team])


  // if not news found
  
  if (news.length == 0) {
    return <DataNotFoundMessage cardClass="p-4" message={"No News Found!"} />
  }
  

  //  if some data provided then print all
  return (
    <div className="row">
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-header d-flex justify-content-between">
            <div className="iq-header-title">
              <h4 className="card-title">
                Latest News
              </h4>
            </div>
          </div>
          <div className="iq-card-body pt-0">
            <div className="row align-items-center">
              {news.map((value, index) => {
                return (
                  <div className="col-lg-12" key={index}>
                    <BigHorizontalCard newsData={value} />
                  </div>
                );
              })}
            </div>
          </div>
          <ViewMoreAnchor onClick={onClick} text={"Read All News"} link={`?tab=news`}  />
        </div>
      </div>
    </div>
  );
}

export default HomeTab;
