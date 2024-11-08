import { Link } from 'react-router-dom'

import {ROUTES} from 'src/routes/urls'

export default function Footer() {
  

  return (
    <>
        <footer className="bg-white iq-footer">
            <div className="container-fluid">
            <div className="row">
                <div className="col-lg-6">
                <ul className="list-inline mb-0">
                    <li className="list-inline-item">
                    <a href="#">Privacy Policy</a>
                    </li>
                    <li className="list-inline-item">
                    <a href="#">Terms of Use</a>
                    </li>
                </ul>
                </div>
                <div className="col-lg-6 text-right">
                Copyright 2020 <Link to={ROUTES.HOME}>SmartCricStats</Link> All Rights Reserved.
                </div>
            </div>
            </div>
        </footer>
    </>
  )
}
