import React from "react";
import PropTypes from "prop-types";

import { Chart } from "chart.js";

import { FindTeamLongName } from "src/utils/utils";

// import {ChartConfiguration, ChartConfigurationCustomTypesPerDataset, ChartType} from "chart.js/dist/types/index"





function ChartComponent({ id, settings }) {
//   let id = "runRateChart";


  //   checking if created previously then destroy it first
  React.useEffect(() => {
    // Cleanup function to destroy the chart instance
    const canvas = document.getElementById(id);
    let chartInstance = null;

    // if canvas tag exists
    if (canvas) {

      // check whether a chart is already displayed or not
      chartInstance = Chart.getChart(id);
      
      if (chartInstance) {
        // then destroy it to recreate another
        chartInstance.destroy();
      }
      
      // recreating or intializing the chart
      chartInstance = new Chart(canvas.getContext("2d"), settings);
    }
    
    // this function will be returned that will help when the component is 
    // rendered for the first time so there will be not Canvas with the specified id in the DOM
    // so it will just check the chart instance and destroy it if any previously

    return () => {
      // Check if the chart instance exists
      const chartInstance = Chart.getChart(id);
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [settings, id]);

  return <canvas id={id} />;
}

ChartComponent.propTypes = {
    id: PropTypes.string.isRequired,
    settings: PropTypes.object.isRequired
};

export default ChartComponent;
