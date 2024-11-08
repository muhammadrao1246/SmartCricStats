// /* eslint-disable react-refresh/only-export-components */
import pointBall from "src/assets/images/point-ball-png.png";

import { Chart } from "chart.js";

let root = getComputedStyle(document.body)

// fonts
export let GLOBAL_FONT = "'Muli', sans-serif"

// colors
export let tooltipBackgroundColor = root.getPropertyValue("--iq-light")
tooltipBackgroundColor = "#ffffff"
export let tooltipTitleColor = root.getPropertyValue("--iq-dark")
export let tooltipBodyColor = root.getPropertyValue("--gray-dark")
export let tooltipFooterColor = root.getPropertyValue("--iq-secondary")

// attaching chart settings
Chart.defaults.font.family = GLOBAL_FONT;
Chart.defaults.plugins.tooltip.backgroundColor = tooltipBackgroundColor
Chart.defaults.plugins.tooltip.titleColor = tooltipTitleColor
Chart.defaults.plugins.tooltip.titleSpacing = 5
Chart.defaults.plugins.tooltip.titleFont = {
    size: "14px",
    weight: 700,
    family: "'Muli', sans-serif",
}
Chart.defaults.plugins.tooltip.bodyColor = tooltipBodyColor
Chart.defaults.plugins.tooltip.bodyFont = {
    size: "14px",
    weight: 500,
    family: "'Muli', sans-serif",
}
Chart.defaults.plugins.tooltip.footerColor = tooltipFooterColor
Chart.defaults.plugins.tooltip.footerFont = {
    size: "13px",
    weight: 400,
    family: "'Muli', sans-serif",
}
Chart.defaults.plugins.tooltip.boxPadding = 1
Chart.defaults.plugins.tooltip.borderColor = tooltipTitleColor
Chart.defaults.plugins.tooltip.borderWidth = .5
Chart.defaults.plugins.tooltip.titleMarginBottom = 10
Chart.defaults.plugins.tooltip.footerMarginTop = 10
Chart.defaults.plugins.tooltip.usePointStyle = true
Chart.defaults.plugins.tooltip.cornerRadius = 15
Chart.defaults.plugins.tooltip.padding = 10


// basic chart changeable settings
export let BasicSettingsFunction = ()=>({
    elements: {
        point: {
          pointStyle: "circle",
          hoverRadius: 10,
          borderWidth: 2,
          radius: 5,
        },
      },
      font: {
        weight: 600,
      },
      responsive: true,
      maintainAspectRatio: false,
    
      // animation: {
      //   delay: 5,
      //   duration: 5,
      // },
})
// Scale Function labels changed just
export let ScaleFunction = (yLabel, xLabel)=>({
    x: {
      beginAtZero: true,
      display: true,
      title: {
        text: xLabel,
        display: true,
        font: {
          size: "15px",
          weight: 500,
          family: GLOBAL_FONT,
        },
        color: tooltipFooterColor,
      },
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      display: true,
      title: {
        text: yLabel,
        display: true,
        font: {
          size: "15px",
          weight: 500,
          family: GLOBAL_FONT,
        },
        color: tooltipFooterColor,
      },
      grid: {
        display: true,
      },
    },
})

// new Chart("", {
//     type: "bar",
    
//     data: {
//         datasets: [
//             {
//                 data: [],
                
//             }
//         ]
//     },
//     options: {
        
//         plugins: {

//             tooltip: {
//                 displayColors: false,
//                 display: true,
//                 backgroundColor: tooltipBackgroundColor,
//                 titleColor: tooltipTitleColor,
//                 titleFont: {
//                     size: "15px",
//                     weight: 700,
//                     family: "'Muli', sans-serif",
//                 },
//                 titleSpacing: "10px",
//                 bodyColor: tooltipBodyColor,
//                 bodyFont: {
//                     size: "14px",
//                     weight: 500,
//                     family: "'Muli', sans-serif",
//                 },
//                 boxPadding: 2,
//                 borderColor: tooltipTitleColor,

//                 footerColor: tooltipFooterColor,
//                 footerFont: {
//                     size: "13px",
//                     weight: 400,
//                     family: "'Muli', sans-serif",
//                 },
//                 position: "nearest",
                
//                 callbacks: {
//                     title: function (item, Everything) {
//                         console.log(item)
//                         let str = `Over ${item.label}`
//                         return str
//                     },
//                     label: function (item, Everything) {
//                         console.log(item)
//                         let str = `Run Rate: ${item.label}`
//                         return str
//                     },
//                     footer: function (item, Everything) {
//                         console.log(item)
//                         let str = `Footer Content`
//                         return str
//                     },
//                 }
//             }
//         },
//     }
// })

let point = new Image(15, 15);
point.src = pointBall;

export const RunsPerOverGraphOptions = {
    ...BasicSettingsFunction(),
    scales: ScaleFunction("Runs Per Over", "Overs")
  };

export const RunRateGraphOptions = {
    ...BasicSettingsFunction(),
  scales: ScaleFunction("Run Rate", "Overs")
};

// runs till the over
export const WormGraphOptions = {
    ...BasicSettingsFunction(),
  scales: ScaleFunction("Runs", "Overs")
};
