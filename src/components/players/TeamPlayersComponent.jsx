import axios from "axios";
import React, { useRef, useState, useEffect } from "react";
import { Link, useLocation, useOutletContext } from "react-router-dom";
import _ from "lodash";


import { FindPlayerFaceImage, FindPlayerName, FindPlayerProfile, FindTeamImage } from "src/utils/utils";
import LoadingSpinnerComponent from "../Layouts/LoadingSpinnerComponent";
import DataNotFoundMessage from "../Layouts/DataNotFoundMessage";

import "./components.css";
import InfiniteScroll from "react-infinite-scroll-component";
import PlayerListCard from "./PlayerListCard";

function TeamPlayersComponent({ country, filters }) {
  const [progress, setProgress] = useOutletContext();

  const ROOT_URL = `http://127.0.0.1:8000/api/players/country/${country.id}`;

  const [data, setData] = useState([]);
  const url = useRef(ROOT_URL);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const playingRoles = filters.playingRoles;
  const battingStyles = filters.longBattingStyles;
  const bowlingStyles = filters.longBowlingStyles;

  const [international, setInternational] = useState(true);
  const [gender, setGender] = useState("1");
  const [role, setRole] = useState("1");
  const [battingStyle, setBattingStyle] = useState("1");
  const [bowlingStyle, setBowlingStyle] = useState("1");
  const [search, setSearch] = useState("");

  const debouncedSearch = useRef(_.debounce((query) => {
    setSearch(query);
  }, 300)).current;

  const BuildURL = (webURL) => {
    let urlObject = new URL(webURL);
    let params = urlObject.searchParams;
    if (params.has("cursor")) {
      return `${ROOT_URL}?cursor=${params.get("cursor")}`;
    }
    return ROOT_URL;
  };

  async function fetchPlayers(source) {
    if (isLoading || !hasMore) return;

    // setIsLoading(true);
    setProgress(60);

    try {
      const response = await axios.get(BuildURL(url.current), {
        params: {
          page_size: 30,
          ordering: "name",
          international: international,
          gender: gender,
          playingRole: role,
          longBattingStyle: battingStyle,
          longBowlingStyle: bowlingStyle,
          search: search,
        },
        cancelToken: source.token,
      });

      setProgress(100);
      const dataObject = response.data.data;
      url.current = dataObject.next;
      setData((prevData) => [...prevData, ...dataObject.results]);
      setHasMore(!!dataObject.next);
    } catch (error) {
      console.log(error);
      setHasMore(false);
    } finally {
      // setIsLoading(false);
      setProgress(100);
    }
  }

  useEffect(() => {
    $(".select2").select2();
    $("#playerRole").on('select2:select select2:change', function (e) {
      setRole(e.target.value);
    });
    $("#battingStyle").on('select2:select select2:change', function (e) {
      setBattingStyle(e.target.value);
    });
    $("#bowlingStyle").on('select2:select select2:change', function (e) {
      setBowlingStyle(e.target.value);
    });
  }, [country]);

  useEffect(() => {
    const source = axios.CancelToken.source();
    
    url.current = ROOT_URL;
    setData([]);
    setIsLoading(false);
    setHasMore(true);
    fetchPlayers(source);

    return () => {
      source.cancel();
    };
  }, [role, battingStyle, bowlingStyle, international, gender, search, country]);

  const handleFilterButtonClick = (filterType, value) => {
    switch (filterType) {
      case 'international':
        setInternational(value);
        break;
      case 'gender':
        setGender(prev => (prev === value ? "1" : value));
        break;
      default:
        break;
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    debouncedSearch(query);
  };

  let selectBoxColClass = "col-lg-3";
  let playerColClass = "col-lg-4", playerCardClass = "p-2 pl-2 pr-2";

  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div className="iq-card-body">
              <div className="d-flex justify-content-start align-items-center w-100">
                <img
                  src={FindTeamImage(country)}
                  alt=""
                  className="avatar-60"
                />
                <span className="player-team-title ml-3">
                  {country.name} Players
                </span>
              </div>
              <div className="d-flex player-filter-container align-items-center w-100 mt-4">
                <PillFilterButtonComponent
                  key={country.id + "-International"}
                  buttonName={"International"}
                  state={international === true ? "active" : ""}
                  onClick={() => handleFilterButtonClick('international', true)}
                />
                <PillFilterButtonComponent
                  key={country.id + "-All"}
                  buttonName={"All"}
                  state={international === false ? "active" : ""}
                  onClick={() => handleFilterButtonClick('international', false)}
                />
                <PillFilterButtonComponent
                  key={country.id + "-Mens"}
                  buttonName={"Mens"}
                  disable={false}
                  state={gender === "M" ? "active" : ""}
                  onClick={() => handleFilterButtonClick('gender', "M")}
                />
                <PillFilterButtonComponent
                  key={country.id + "-Womens"}
                  buttonName={"Womens"}
                  disable={false}
                  state={gender === "F" ? "active" : ""}
                  onClick={() => handleFilterButtonClick('gender', "F")}
                />
              </div>
              <div className="row mt-3">
                <SelectLabelFilterComponent
                  key={country.id + "-playerRole"}
                  id={"playerRole"}
                  labelName={"Select Player Role"}
                  options={playingRoles}
                  colClass={selectBoxColClass}
                />
                <SelectLabelFilterComponent
                  key={country.id + "-battingStyle"}
                  id={"battingStyle"}
                  labelName={"Select Batting Style"}
                  options={battingStyles}
                  colClass={selectBoxColClass}
                />
                <SelectLabelFilterComponent
                  key={country.id + "-bowlingStyle"}
                  id={"bowlingStyle"}
                  labelName={"Select Bowling Style"}
                  options={bowlingStyles}
                  colClass={selectBoxColClass}
                />
                <div className="col-lg-3">
                  <div className="d-flex flex-column">
                    <span className="player-select-filter-label">
                      Search Player by Name
                    </span>
                    <input
                      key={country.id + "-search"}
                      type="text"
                      className="form-control form-control-sm player-search-box"
                      onChange={handleSearchChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-12">
          <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div className="iq-card-body">
              <InfiniteScroll
                key={url.current}
                className="row no-gutters"
                dataLength={data.length}
                next={() => fetchPlayers(axios.CancelToken.source())}
                hasMore={hasMore}
                loader={<LoadingSpinnerComponent cardClass={"m-0"} />}
              >
                {data.length > 0 &&
                  data.map((playerObject, index) => (
                    <PlayerListCard
                      key={country.id + "-" + playerObject.slug + index}
                      playerName={FindPlayerName(playerObject)}
                      age={playerObject.age}
                      nickName={playerObject.nickName}
                      playerImage={FindPlayerFaceImage(playerObject)}
                      playerProfile={FindPlayerProfile(playerObject)}
                      colClass={playerColClass}
                      cardClass={playerCardClass}
                    />
                  ))}
              </InfiniteScroll>
              {data.length == 0 && !hasMore && (
                <DataNotFoundMessage
                  message={"No Players Found. Try Different Filters!"}
                  colClass={"col-lg-12"}
                  cardClass={"m-0"}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function SelectLabelFilterComponent({ id, labelName, options, onChange, colClass }) {
  return (
    <div className={colClass}>
      <div className="d-flex flex-column">
        <span className="player-select-filter-label">{labelName}</span>
        <select
          id={id}
          className={`form-select form-control form-control-sm select2 mt-1`}
          onChange={onChange}
        >
          <option key={labelName + "all"} value={"1"}>
            All
          </option>
          {Object.keys(options).map((filterKey) => (
            <option key={"player-" + filterKey} value={filterKey}>
              {options[filterKey]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function PillFilterButtonComponent({ buttonName, onClick, state, disable = true }) {
  return (
    <button
      onClick={onClick}
      className={`pt-0 pb-0 btn btn-sm rounded-pill iq-waves-effect ${
        state === "active" ? `btn-success ${disable ? "disabled" : ""}` : "btn-outline-success"
      }`}
    >
      {buttonName}
    </button>
  );
}

export default TeamPlayersComponent;
