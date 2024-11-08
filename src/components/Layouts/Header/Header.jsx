import axios from 'axios';
import {useEffect, useState} from 'react'
import { Link, useLocation } from 'react-router-dom';


import {ROUTES} from 'src/routes/urls'


export default function Header() {
  
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light")
  // window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => setTheme(e.matches ? 'dark' : 'light'));
  const location = useLocation();
  const currentRoute = location.pathname; 

  // console.log(location)
  
  function toggleSideBarMenu(element){
    if (element.target.classList.contains("open")) {
      element.target.classList.remove("open")
      document.body.classList.remove("sidebar-main")
    }else{
      element.target.classList.add("open")
      document.body.classList.add("sidebar-main")
    }
  }

  const [topTeams, setTopTeams] = useState([])
  const [latestSeries, setLatestSeries] = useState([])
  

  
  useEffect(()=>{
      axios.get("http://127.0.0.1:8000/api/header/data/", {
        method: 'GET',
      })
      .then(response=>{
        setTopTeams(response.data.data.teams)
        setLatestSeries(response.data.data.series)
      })
      .catch(error=>{
        console.log(error)
      })
      .finally(()=>{
        
      })
  }, [])
  

  return (
    <>
      {/* TOP Nav Bar */}
      <div className="iq-top-navbar">
        <div className="iq-navbar-custom d-flex align-items-center justify-content-between">
          <div className="iq-sidebar-logo" >
            <div className="top-logo">
              <Link to={ROUTES.HOME} className="logo">
                <img
                  src="/custom/images/throw.png"
                  className="img-fluid"
                  alt=""
                />
                <span>SmartCricStats</span>
              </Link>
            </div>
          </div>
          <div className="iq-menu-horizontal">
            <nav className="iq-sidebar-menu">
              <ul id="iq-sidebar-toggle" className="iq-menu d-flex">
                <li className={ROUTES.LIVESCORES == currentRoute ? "active" : ""}>
                  <Link to={ROUTES.LIVESCORES} className="iq-waves-effect">
                    <span>Live Scores</span>
                  </Link>
                </li>
                <li className={ROUTES.NEWS == currentRoute ? "active" : ""}>
                  <Link to={ROUTES.NEWS} className="iq-waves-effect">
                    <span>News</span>
                  </Link>
                </li>
                <li className={ROUTES.RANKINGS == currentRoute ? "active" : ""}>
                  <Link to={ROUTES.RANKINGS} className="iq-waves-effect">
                    <span>Rankings</span>
                  </Link>
                </li>
                <li className={ROUTES.PLAYERS == currentRoute ? "active" : ""}>
                  <Link to={ROUTES.PLAYERS}>
                    {/* <i className="ri-menu-3-line" /> */}
                    <span>Players</span>
                  </Link>
                </li>
                <li className={currentRoute.includes(ROUTES.TEAMS) ? "active" : ""}>
                  <Link
                    to={ROUTES.TEAMS}
                    className="iq-waves-effect collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                  >
                    {/* <i className="ri-record-circle-line" /> */}
                    <span>Teams</span>
                    <i className="ri-arrow-right-s-line iq-arrow-right" />
                  </Link>
                  {
                    topTeams.length > 0 && (
                      <ul
                        id="teams"
                        className="iq-submenu collapse"
                        data-parent="#iq-sidebar-toggle"
                        style={{ height: 300, overflowY: "scroll" }}
                      >
                        {
                          topTeams.map((team, index) => {
                            return (
                              <li key={index} className={(ROUTES.TEAMS + "/" + team.slug) == currentRoute ? "active" : ""}>
                                <Link to={ROUTES.TEAMS + "/" + team.slug}>{team.name}</Link>
                              </li>
                            )
                          })
                        }
                      </ul>
                    )
                  }
                </li>
                <li className={currentRoute.includes(ROUTES.SERIES) ? "active" : ""}>
                  <Link
                    to={ROUTES.SERIES}
                    className="iq-waves-effect collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                  >
                    {/* <i className="ri-pencil-ruler-line" /> */}
                    <span>Series</span>
                    <i className="ri-arrow-right-s-line iq-arrow-right" />
                  </Link>
                  {
                    latestSeries.length > 0 && (
                      <ul
                        id="series"
                        className="iq-submenu collapse"
                        data-parent="#iq-sidebar-toggle"
                        style={{ height: 300, overflowY: "scroll" }}
                      >
                        {
                          latestSeries.map((series, index) => {
                            return (
                              <li key={index} className={(ROUTES.SERIES + "/" + series.slug) == currentRoute ? "active" : ""}>
                                <Link to={ROUTES.SERIES + "/" + series.slug}>{series.name}</Link>
                              </li>
                            )
                          })
                        }
                      </ul>
                    )
                  }
                </li>
                <li className={currentRoute.includes("/other") ? "active" : ""}>
                  <Link
                    to="#other"
                    className="iq-waves-effect collapsed"
                    data-toggle="collapse"
                    aria-expanded="false"
                  >
                    {/* <i className="ri-record-circle-line" /> */}
                    <span>Other</span>
                    <i className="ri-arrow-right-s-line iq-arrow-right" />
                  </Link>
                  <ul
                    id="other"
                    className="iq-submenu collapse"
                    data-parent="#iq-sidebar-toggle"
                  >
                    <li className={ROUTES.GROUNDS == currentRoute ? "active" : ""}>
                      <Link to={ROUTES.GROUNDS} > Grounds </Link>
                    </li>
                    <li className={ROUTES.TNC == currentRoute ? "active" : ""}>
                      <Link to={ROUTES.TNC} > Terms & Conditions </Link>
                    </li>
                    <li className={ROUTES.ABOUT == currentRoute ? "active" : ""}>
                      <Link to={ROUTES.ABOUT} > About Us </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </nav>
          </div>
          <nav className="navbar navbar-expand-lg navbar-light p-0" style={{height:"75px"}}>
            
            <div className="iq-menu-bt align-self-center" style={{right: "0", position: "relative"}}>
              <div onClick={toggleSideBarMenu} className="wrapper-menu">
                <div className="main-circle">
                  <i className="ri-arrow-left-s-line" />
                </div>
                <div className="hover-circle">
                  <i className="ri-arrow-right-s-line" />
                </div>
              </div>
            </div>
            <button
              className="navbar-toggler iq-waves-effect"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
              style={{marginRight: "15px"}}
            >
              <i className="ri-menu-3-line" />
            </button>
            <div
              className="collapse navbar-collapse"
              id="navbarSupportedContent"
            >
              <ul className="navbar-nav ml-auto navbar-list">
                {/* <li className="nav-item">
                  <Link onClick={()=>setTheme(theme == "light" ? "dark" : "light")} className="dark-mode-toggle iq-waves-effect" href="#">
                    <i className={`ri-${(theme == "light" ? "moon" : "sun")}-fill`}></i>
                  </Link>
                </li> */}
                {/* <li className="nav-item">
                  <Link
                    className="search-toggle iq-waves-effect language-title"
                    href="#"
                  >
                    <img
                      src="/images/small/flag-01.png"
                      alt="img-flaf"
                      className="img-fluid mr-1"
                      style={{ height: 16, width: 16 }}
                    />{" "}
                    <i className="ri-arrow-down-s-line" />
                  </Link>
                  <div className="iq-sub-dropdown">
                    <a className="iq-sub-card" href="#">
                      <img
                        src="/images/small/flag-02.png"
                        alt="img-flaf"
                        className="img-fluid mr-2"
                      />
                      French
                    </a>
                    <a className="iq-sub-card" href="#">
                      <img
                        src="/images/small/flag-03.png"
                        alt="img-flaf"
                        className="img-fluid mr-2"
                      />
                      Spanish
                    </a>
                    <a className="iq-sub-card" href="#">
                      <img
                        src="/images/small/flag-04.png"
                        alt="img-flaf"
                        className="img-fluid mr-2"
                      />
                      Italian
                    </a>
                    <a className="iq-sub-card" href="#">
                      <img
                        src="/images/small/flag-05.png"
                        alt="img-flaf"
                        className="img-fluid mr-2"
                      />
                      German
                    </a>
                    <a className="iq-sub-card" href="#">
                      <img
                        src="/images/small/flag-06.png"
                        alt="img-flaf"
                        className="img-fluid mr-2"
                      />
                      Japanese
                    </a>
                  </div>
                </li> */}
                {/* <li className="nav-item">
                  <a className="search-toggle iq-waves-effect" href="#">
                    <i className="ri-search-line" />
                  </a>
                  <form action="#" className="search-box">
                    <input
                      type="text"
                      className="text search-input"
                      placeholder="Type here to search..."
                    />
                  </form>
                </li> */}
                {/* <li className="nav-item">
                  <Link to="#" className="search-toggle iq-waves-effect">
                    <div id="lottie-beil" />
                    <span className="bg-danger dots" />
                  </a>
                  <div className="iq-sub-dropdown">
                    <div className="iq-card shadow-none m-0">
                      <div className="iq-card-body p-0 ">
                        <div className="bg-primary p-3">
                          <h5 className="mb-0 text-white">
                            All Notifications
                            <small className="badge  badge-light float-right pt-1">
                              4
                            </small>
                          </h5>
                        </div>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/01.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Emma Watson Nik</h6>
                              <small className="float-right font-size-12">
                                Just Now
                              </small>
                              <p className="mb-0">95 MB</p>
                            </div>
                          </div>
                        </a>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/02.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">New customer is join</h6>
                              <small className="float-right font-size-12">
                                5 days ago
                              </small>
                              <p className="mb-0">Jond Nik</p>
                            </div>
                          </div>
                        </a>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/03.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Two customer is left</h6>
                              <small className="float-right font-size-12">
                                2 days ago
                              </small>
                              <p className="mb-0">Jond Nik</p>
                            </div>
                          </div>
                        </a>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/04.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">New Mail from Fenny</h6>
                              <small className="float-right font-size-12">
                                3 days ago
                              </small>
                              <p className="mb-0">Jond Nik</p>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </li> */}
                {/* <li className="nav-item dropdown">
                  <Link to="#" className="search-toggle iq-waves-effect">
                    <div id="lottie-mail" />
                    <span className="bg-primary count-mail" />
                  </a>
                  <div className="iq-sub-dropdown">
                    <div className="iq-card shadow-none m-0">
                      <div className="iq-card-body p-0 ">
                        <div className="bg-primary p-3">
                          <h5 className="mb-0 text-white">
                            All Messages
                            <small className="badge  badge-light float-right pt-1">
                              5
                            </small>
                          </h5>
                        </div>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/01.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Nik Emma Watson</h6>
                              <small className="float-left font-size-12">
                                13 Jun
                              </small>
                            </div>
                          </div>
                        </a>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/02.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Lorem Ipsum Watson</h6>
                              <small className="float-left font-size-12">
                                20 Apr
                              </small>
                            </div>
                          </div>
                        </a>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/03.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Why do we use it?</h6>
                              <small className="float-left font-size-12">
                                30 Jun
                              </small>
                            </div>
                          </div>
                        </a>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/04.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Variations Passages</h6>
                              <small className="float-left font-size-12">
                                12 Sep
                              </small>
                            </div>
                          </div>
                        </a>
                        <Link to="#" className="iq-sub-card">
                          <div className="media align-items-center">
                            <div className="">
                              <img
                                className="avatar-40 rounded"
                                src="/images/user/05.jpg"
                                alt=""
                              />
                            </div>
                            <div className="media-body ml-3">
                              <h6 className="mb-0 ">Lorem Ipsum generators</h6>
                              <small className="float-left font-size-12">
                                5 Dec
                              </small>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>
                </li> */}
              </ul>
            </div>
            {/* FOR SHOWING USER SETTING AND PROFILE AND LOGIN LOGUT INFO */}
            {/* <ul className="navbar-list">
              <li>
                <a
                  href="#"
                  className="search-toggle iq-waves-effect d-flex align-items-center"
                >
                  <img
                    src="/images/user/1.jpg"
                    className="img-fluid rounded mr-3"
                    alt="user"
                  />
                </a>
                <div className="iq-sub-dropdown iq-user-dropdown">
                  <div className="iq-card shadow-none m-0">
                    <div className="iq-card-body p-0 ">
                      <div className="bg-primary p-3">
                        <h5 className="mb-0 text-white line-height">
                          Hello Nik jone
                        </h5>
                        <span className="text-white font-size-12">
                          Available
                        </span>
                      </div>
                      <a
                        href="profile.html"
                        className="iq-sub-card iq-bg-primary-hover"
                      >
                        <div className="media align-items-center">
                          <div className="rounded iq-card-icon iq-bg-primary">
                            <i className="ri-file-user-line" />
                          </div>
                          <div className="media-body ml-3">
                            <h6 className="mb-0 ">My Profile</h6>
                            <p className="mb-0 font-size-12">
                              View personal profile details.
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="profile-edit.html"
                        className="iq-sub-card iq-bg-primary-hover"
                      >
                        <div className="media align-items-center">
                          <div className="rounded iq-card-icon iq-bg-primary">
                            <i className="ri-profile-line" />
                          </div>
                          <div className="media-body ml-3">
                            <h6 className="mb-0 ">Edit Profile</h6>
                            <p className="mb-0 font-size-12">
                              Modify your personal details.
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="account-setting.html"
                        className="iq-sub-card iq-bg-primary-hover"
                      >
                        <div className="media align-items-center">
                          <div className="rounded iq-card-icon iq-bg-primary">
                            <i className="ri-account-box-line" />
                          </div>
                          <div className="media-body ml-3">
                            <h6 className="mb-0 ">Account settings</h6>
                            <p className="mb-0 font-size-12">
                              Manage your account parameters.
                            </p>
                          </div>
                        </div>
                      </a>
                      <a
                        href="privacy-setting.html"
                        className="iq-sub-card iq-bg-primary-hover"
                      >
                        <div className="media align-items-center">
                          <div className="rounded iq-card-icon iq-bg-primary">
                            <i className="ri-lock-line" />
                          </div>
                          <div className="media-body ml-3">
                            <h6 className="mb-0 ">Privacy Settings</h6>
                            <p className="mb-0 font-size-12">
                              Control your privacy parameters.
                            </p>
                          </div>
                        </div>
                      </a>
                      <div className="d-inline-block w-100 text-center p-3">
                        <a
                          className="bg-primary iq-sign-btn"
                          href="sign-in.html"
                          role="button"
                        >
                          Sign out
                          <i className="ri-login-box-line ml-2" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul> */}
          </nav>
        </div>
      </div>
      {/* TOP Nav Bar END */}
    </>
  );
}


