// import React from 'react'
import PropTypes from "prop-types";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

import playerPlaceholder from "src/assets/images/player_placeholder.svg";
import teamPlaceholder from "src/assets/images/team_placeholder.svg";
import { ROUTES } from "src/routes/urls";
import { FindPlayerFaceImage, FindPlayerImage, FindPlayerName, FindPlayerProfile, FindTeamImage, FindTeamLongName, FindTeamProfile } from "src/utils/utils";

let columns = {
  PLAYER: ["Name", "Rating"],
  TEAM: ["Team", "Matches", "Points", "Rating"],
};

CardRows.propTypes = {
  type: PropTypes.string.isRequired,
  rowData: PropTypes.array.isRequired,
};
function CardRows({ type, rowData }) {
  return (
    <>
      {rowData.map((row, rowIndex) => (
        <tr
          key={rowIndex}
          className={
            type == "PLAYER" && rowIndex == 0 ? row.player.name != undefined ? "first-rank-player" : "first-rank-player-not-found" : ""
          }
        >
          <td>{row.rank}</td>
          {columns[type].map((item, colIndex) => (
            <td key={colIndex}>
              {colIndex != 0 ? (
                row[item.toLowerCase()]
              ) : type == "PLAYER" ? (
                <>
                
                  <Link to={FindPlayerProfile(row.player)} className={row.player.name == undefined ? rowIndex == 0 ? "text-light" : "text-dark" : rowIndex == 0 ? "text-anchor text-light" : "text-anchor"}>
                    <img
                      src={
                          row.country != null
                          ? row.country.image != null
                            ? row.country.image
                            : teamPlaceholder
                          : teamPlaceholder
                      }
                      className="iq-card-icon avatar-40 mr-2"
                    />

                    {FindPlayerName(row.player)}
                  </Link>
                  {(rowIndex == 0 && typeof(row.player) != "string" ) && (
                    <LazyLoadImage 
                      onError={(e)=>e.target.src = playerPlaceholder}
                      src={FindPlayerImage(row.player)}
                      className="iq-card-icon float-right ranking-player"
                    />
                  )}
                </>
              ) : (
                <>
                  <LazyLoadImage 
                    onError={(e)=>e.target.src = teamPlaceholder}
                    src={FindTeamImage(row.team)}
                    className="iq-card-icon avatar-40 mr-2"
                  />
                  <Link
                    to={FindTeamProfile(row.team)}
                    className={typeof(row.team) == "string" ? "text-dark" : "text-anchor"}
                  >
                  {FindTeamLongName(row.team)}
                  </Link>
                </>
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

Card.propTypes = {
  type: PropTypes.string.isRequired,
  rowData: PropTypes.object.isRequired,
};
function Card({ type, rowData }) {
  // console.log(rowData);

  return (
    <div className="table-responsive ranking-table">
      <table className="table mb-0 table-borderless">
        <thead>
          <tr>
            <th scope="col" />
            {columns[type].map((item) => (
              <th key={item} scope="col">
                {item}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {
            rowData != 0 ? (
              <CardRows type={type} rowData={rowData.rankings.slice(0,5)} />
            )
            :
            (
              <tr>
                <td colSpan={"8"}>
                  <div className="d-flex justify-content-center">
                  <div className="spinner-border text-secondary font-weight-bold" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                  </div>
                </td>
              </tr>
            )
          }
          
        </tbody>
      </table>
    </div>
  );
}

export default Card;
