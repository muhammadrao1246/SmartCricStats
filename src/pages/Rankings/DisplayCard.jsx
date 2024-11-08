import axios from 'axios';
import React from 'react'
import Card from 'src/components/rankings/card';
import PropTypes from 'prop-types'

let format_map = {
    T20I : "text-danger",
    T20: "text-danger",
    ODI : "text-info",
    TEST : "text-success",
}
DisplayCard.propTypes = {
    type: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    gender: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
}
function DisplayCard({type, format, gender, role, colClass}) {

    let [data, setData] = React.useState(0)
  
    React.useEffect(() => {
        axios
          .get("http://127.0.0.1:8000/api/rankings/", {
            method: "GET",
            params: {
              type: type,
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
      }, []);

  return (
    <div className={`${colClass}`}>
        <div className="iq-card iq-card-block iq-card-stretch iq-card-height">
            <div className="iq-card-body">
                <div className="row">
                    <div className="col-lg-12">
                        <h5>
                            <span className={format_map[format]}> {format} </span>
                            | <span className="text-muted">{role.toUpperCase()} Rankings</span>
                        </h5>
                    </div>
                    <div className="col-lg-12">
                        <Card
                        type={type.toUpperCase()}
                        rowData={data}
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default DisplayCard