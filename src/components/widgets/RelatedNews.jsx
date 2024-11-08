import React, { useRef } from "react";
import axios from "axios"

import "src/assets/css/news.css"


import ViewMoreAnchor from "../Layouts/ViewMoreAnchor";
import HorizontalCard from "../news/HorizontalCard";


function RelatedNews({ queryParams, viewMoreLink, onClick, title }) {

  let [data, setData] = React.useState(null);

  // fetching Data From API
  React.useEffect(()=>{
    const source = axios.CancelToken.source()
      axios.get("http://127.0.0.1:8000/api/news/", {
          method: 'GET',
          params: {...{
            page_size: 10,
            ordering: "-publishedAt"
          }, ...queryParams},
          cancelToken: source.token
      }).then((response)=>{
          setData(response.data.data.results)
      })
      .catch(error=>{
        console.log(error)
      })
      return ()=>{
        source.cancel()
      }
  },[queryParams])

  if (data == null) {
    return  <></>
  }
  else if(data.length == 0){
    return <></>
  }

  return (
    <div className="iq-card iq-card-block iq-card-stretch overflow-hidden">
      <div className="iq-card-body">
        <div className="d-flex justify-content-start">
          <div className="side-news-heading card-title">{title}</div>
        </div>
        <div className="d-flex flex-column">
            {
              data.map((news, index)=>(
                <HorizontalCard newsData={news} key={news.slug} />
              ))
            }
        </div>
      </div>
      <ViewMoreAnchor onClick={onClick} text={"Read All News"} link={viewMoreLink} />
    </div>
  );
}

export default RelatedNews;
