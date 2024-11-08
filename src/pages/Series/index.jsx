import axios from "axios";
import React from "react";
import { Link, useLoaderData, useOutletContext, useParams } from "react-router-dom";

import "src/assets/css/series.css"

import SeriesListCard from "src/components/series/SeriesListCard";

import { FindSeriesLongName, FindSeriesImage, FindSeriesProfile, FindDateStringLong } from 'src/utils/utils';


let tabs = { recent: "Recently Ended", current: "Current Serieses", future: "Future Series / Tournaments"}
function Series() {


  let [state, setState] = React.useState("current");
  const data = useLoaderData().data;

  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  React.useEffect(()=>{
    setProgress(60)
    setTimeout(() => {
      setProgress(100)
    }, 1000);
  }, [])




  return (
    <>
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className=" p-3 d-flex justify-content-center w-100 ">
            <div className="title-heading">
              Series / Tournaments in Current Cricket
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="iq-card iq-card-block iq-card-stretch overflow-hidden series-tab-container">
          <ul
            className="nav nav-tabs justify-content-center w-100 m-0"
            role="tablist"
          >
            {Object.keys(tabs).map((route, index) => (
              <li className="nav-item tab-item" key={"side-" + route}>
                <Link
                  to="javascript:void(0)"
                  className={`nav-link border-none ${
                    state === route ? " active" : ""
                  }`}
                  data-toggle="tab"
                  role="tab"
                  onClick={() => {
                    setState(route);
                  }}
                >
                  {tabs[route]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {
        Object.keys(data[state]).map((groupName, index) => (
          <SeriesGroupComponent key={state+"-"+groupName} groupName={groupName} seriesData={data[state][groupName]} />
        ))
      }
    </>
  );
}

function SeriesGroupComponent({groupName, seriesData}) {
  let colClass = "col-lg-6", cardClass = "p-3 pl-0 pr-0"
  
  if (seriesData.length == 0) {
    return  <></>
  }

  return (
    <div className="col-lg-12 series-list-container">
      <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
        <div className="iq-card-body">
          <div className="group-title-heading">{groupName}</div>
          <div className="row no-gutters mt-3">
            {seriesData.map((series, index) => (
              <SeriesListCard
                key={series.slug}
                startDate={FindDateStringLong(series.startDate)}
                endDate={FindDateStringLong(series.endDate)}
                SeriesName={FindSeriesLongName(series)}
                SeriesImages={FindSeriesImage(series)}
                SeriesProfile={FindSeriesProfile(series)}
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

export default Series