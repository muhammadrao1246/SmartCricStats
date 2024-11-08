import React, { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";
import ReactPaginate from 'react-paginate'

import BigHorizontalCard from "src/components/news/BigHorizontalCard";
import "src/assets/css/news.css";

let regions = [
  "Global",
  "Australia",
  "Bangladesh",
  "England",
  "India",
  "New Zealand",
  "Pakistan",
  "South Africa",
  "Sri Lanka",
  "West Indies",
  "Zimbabwe",
];
let placeholder_news = [null, null, null, null, null, null, null, null, null, null]
export default function News() {
  const [progress, setProgress] = useOutletContext()
    
  // let params = new URLSearchParams(window.location.search)

  const [news, setNews] = React.useState(placeholder_news);
  const [region, setRegion] = React.useState(regions[0])
  const [page, setPage] = React.useState(0)

  let total_count = useRef(0);
  let SIZE = useRef(10)

  function resetPagination() {
    total_count.current = 0;
  }

  React.useEffect(() => {
    setProgress(50)
    setNews(placeholder_news)
    axios.get("http://127.0.0.1:8000/api/news/", {
        method: "GET",
        params: {
          region__iexact: region == "Global" ? "global" : region,
          page_size: SIZE.current,
          page: page + 1,
          ordering: "-publishedAt",
        },
      })
      .then((response) => {
        console.log(response);

        total_count.current = response.data.data.count;
        
        if (window.scrollY > (document.body.scrollHeight - 1000) ) {
          window.scrollTo(0,0)
        }
        
        setProgress(100)
        // current_page.current++;
        setNews(response.data.data.results);
        
      })
      .catch((error) => {
        console.log(error);
      });
  },[region, page]);


  return (
    <>
      {/* Page Content  */}
      <div className="col-lg-8">
        <div className="row">
          <div className="col-lg-12">
            <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
              <div className="iq-card-header d-flex justify-content-between">
                <div className="iq-header-title">
                  <h4 className="card-title"> News </h4>
                </div>
                <div className="iq-card-header-toolbar d-flex align-items-center">
                    <select
                    className="form-select form-control form-control-sm"
                    onChange={(e) => {resetPagination();setPage(0);setRegion(e.target.value)}}
                  >
                    {regions.map((current_region, index) => (
                      <option key={index} value={current_region}>
                        {current_region}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="iq-card-body pt-0">
                <div className="row align-items-center">
                  {
                    news.map((value, index)=>{
                      return (
                        <div className="col-lg-12" key={index}>
                          <BigHorizontalCard newsData={value} />
                        </div>
                      )
                    })
                  }
                  {
                    page+1 != 0 && (
                      <div className="col-lg-12 mt-5">

                    <ReactPaginate
                      forcePage={page}
                      containerClassName={"pagination mb-0 justify-content-center"}
                      pageClassName={"page-item"}
                      pageLinkClassName="page-link"
                      activeClassName={"active"}
                      nextLinkClassName="page-link"
                      nextClassName="page-item"
                      previousClassName="page-item"
                      previousLinkClassName="page-link"
                      breakClassName="page-item"
                      breakLinkClassName="page-link"
                      disabledLinkClassName="disabled"
                      initialPage={page}
                      renderOnZeroPageCount={null}
                      onPageChange={(event) => setPage(event.selected)}
                      pageCount={Math.ceil(total_count.current / SIZE.current)}
                      breakLabel="..."
                    />
                    <div className="d-flex justify-content-center mb-1">
                      <span className="card-text">
                        <small className="text-muted">
                          Showing {page + 1} - {Math.ceil(total_count.current / SIZE.current)} of {total_count.current}
                        </small>
                      </span>
                    </div>
                  </div>
                    )
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-lg-4">
        <div className="row">
          <div className="col-lg-12"></div>
        </div>
      </div>
    </>
  );
}
