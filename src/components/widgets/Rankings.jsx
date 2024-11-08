import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { motion } from "framer-motion"

import Card from "src/components/rankings/card";

import "src/assets/css/rankings.css";

Rankings.propTypes = {
  title: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};
function Rankings({ title, type }) {
  // womens only play ODI and T20I
  // mens play all three formats so we have to decide early
  let options = {
    MENS: ["TEST", "ODI", "T20I"],
    WOMENS: ["ODI", "T20I"],
  };

  // initially when the component is loaded first time
  let [gender, setGender] = React.useState("MENS");
  let [format, setFormat] = React.useState("TEST");
  let [role, setRole] = React.useState(type == "TEAM" ? "team" : "BATTING");
  let [data, setData] = React.useState(0);

  React.useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/rankings/", {
        method: "GET",
        params: {
          type: type.toLowerCase(),
          format__icontains: format,
          gender: gender,
          role__icontains: role,
        },
      })
      .then((response) => {
        console.log(response.data);
        setData(response.data.data[0]);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {});
  }, [format, type, gender, role]);

  return (
    <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
      <div className="iq-card-header d-flex justify-content-between">
        <div className="iq-header-title">
          <h4 className="card-title"> {title} </h4>
        </div>
        <div className="iq-card-header-toolbar d-flex align-items-center"></div>
      </div>
      <div className="iq-card-body pb-1 pt-1">
        <div className="row ranking-filter-row">
          <div className="col-sm-12">
            <div
              className="d-flex justify-content-around"
              style={{ gap: "10px" }}
            >
              <select
                  className={`form-select form-control form-control-sm select2 ${data==0&& "disabled"}`}
                onChange={(e) => setFormat(e.target.value)}
              >
                {options[gender].map((format) => (
                  <option key={format} value={format}>
                    {format}
                  </option>
                ))}
              </select>
              <select
                  className={`form-select form-control form-control-sm select2 ${data==0&& "disabled"}`}
                onChange={(e) => {
                  setFormat(
                    options[e.target.value].includes(format)
                      ? format
                      : options[e.target.value][0]
                  );
                  setGender(e.target.value);
                }}
              >
                <option value="MENS">MEN&apos;S</option>
                <option value="WOMENS">WOMEN&apos;S</option>
              </select>
              {type === "PLAYER" && (
                <select
                  className={`form-select form-control form-control-sm select2 ${data==0&& "disabled"}`}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="BATTING">BATTING</option>
                  <option value="BOWLING">BOWLING</option>
                  <option value="ALL-ROUNDER">ALL-ROUNDER</option>
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="iq-card-body">
        <div className="row">
          <div className="col-lg-12">
            <motion.div key={format+role+gender}              
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                >
              <Card  type={type} rowData={data} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rankings;
