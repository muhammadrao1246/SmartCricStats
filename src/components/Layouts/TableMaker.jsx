// import React from "react";
import PropTypes from 'prop-types'

TableMaker.propTypes = {
    columnNameMapObject: PropTypes.object,
    rowsData: PropTypes.array,
    columnsToShow: PropTypes.array,
    columnProps: PropTypes.object,
    cellsProps: PropTypes.object
}
function TableMaker({ columnNameMapObject, rowsData, columnsToShow, columnProps, cellsProps}) {
  // console.log(rowsData)
  return (
    <div className="table-responsive">
      <table className="table mb-0 main-table">
        <thead className='main-thead '>
          <tr className="main-row-bg">
            {
                columnsToShow.map((value, index)=>(
                    <th key={value} {...columnProps[value]}>{columnNameMapObject[value]}</th>    
                ))
            }
          </tr>
        </thead>
        <tbody>
          {
            rowsData.map((value, index)=>(
              <tr key={value["_id"]}>
                {
                    columnsToShow.map((columnName, colIndex)=>(
                      <td key={colIndex+"_"+columnName} {...cellsProps[columnName]}>
                        {
                          typeof(value[columnName]) == "number" ? (
                            <>
                            {
                              (value[columnName] - parseInt(value[columnName])) > 0 ? (
                                <>
                                {
                                  value[columnName].toLocaleString( 'en-US', {
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                      roundingMode: "trunc"
                                  })
                                }
                                </>
                              ):
                              <>{value[columnName]}</>
                            }
                            </>
                          )
                          :
                          (
                            <>{value[columnName]}</>
                          )
                        }
                      </td>
                    ))
                }
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
}

export default TableMaker;
