import React, { useRef } from "react";
import { useOutletContext } from "react-router-dom";
import axios from "axios";

import "src/assets/css/news.css";

import BigHorizontalCard from "src/components/news/BigHorizontalCard";
import ReactPaginate from "react-paginate";


let placeholder_news = [null, null, null, null]
// will get the player prop from the parent component
function NewsTab({ ground }) {
  
  // going to use to update progress bar percentage
  const [progress, setProgress] = useOutletContext();

  // declaring data states
  // will hold the news data
  const [news, setNews] = React.useState(placeholder_news);
  // will hold the current page
  const [page, setPage] = React.useState(0)

  // will hold the total number of pages
  let total_count = useRef(0);
  let SIZE = useRef(10)

  function resetPagination() {
    total_count.current = 0;
  }


  // fetching news about player
  React.useEffect(()=>{
    // setting progress bar to 60 percentage
    setProgress(60)
    // making a network request to server to fetch stats data
      axios.get("http://127.0.0.1:8000/api/news/", {
        method: "GET",
        params: {
          description__icontains: ground.shortName,
          page_size: SIZE.current,
          page: page + 1,
          ordering: "-publishedAt",
        },
      })
      .then((response) => {
        total_count.current = response.data.data.count;
        setProgress(100)
        // current_page.current++;
        setNews(response.data.data.results);
        
      })
      .catch((error) => {
        console.log(error);
      });
      
  }, [ground])

  // if not news found
  if (news.length == 0) {
    return (
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
          <div className="iq-card-body">
            <div className="row">
              <div className="col-lg-12">
                <div className="d-flex w-100 justify-content-center">
                  <h5>No News Found</h5>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }

  //  if some data provided then print all
  return (
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
      <div className="iq-card-header d-flex justify-content-between">
        <div className="iq-header-title">
          <h4 className="card-title"> News Related to {ground.shortName} and Teams</h4>
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
          {page + 1 != 0 && (
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
                    Showing {page + 1} -{" "}
                    {Math.ceil(total_count.current / SIZE.current)} of{" "}
                    {total_count.current}
                  </small>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NewsTab;
