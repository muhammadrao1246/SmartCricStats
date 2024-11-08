// import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

TabList.propTypes = {
  tabArray: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired,
  currentTab: PropTypes.string.isRequired,
};
function TabList({ tabArray, onClick, currentTab }) {
  return (
    <div className="iq-card iq-card-block iq-card-stretch overflow-hidden">
      <ul
        className="nav nav-tabs justify-content-center w-100 m-0 pl-3 pr-3"
        id="myTab-2"
        role="tablist"
      >
        {tabArray.map((tab, index) => {
          return (
            <li key={index} className="nav-item tab-item">
              <Link
                className={`nav-link ${currentTab === tab.route ? " active" : ""}`}
                id={tab.route}
                data-toggle="tab"
                to={`?tab=${tab.route}`}
                role="tab"
                aria-controls={tab.route}
                aria-selected={`${currentTab === tab.route ? "true" : "false"}`}
                onClick={() => {
                  onClick != null ? onClick(tab.route) : null 
                }}
                
              >
                {tab.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default TabList;
