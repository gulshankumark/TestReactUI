// import React from "react";
// import Chart from "chart.js";
 
// export default function CardLineChart() {
//   React.useEffect(() => {
//     var config = {
//       type: "line",
//       data: {
//         labels: [
//           "January",
//           "February",
//           "March",
//           "April",
//           "May",
//           "June",
//           "July",
//           "August",
//           "September",
//           "October",
//           "November",
//           "December",
//         ],
//         datasets: [
//           {
//             label: new Date().getFullYear(),
//             backgroundColor: "#4c51bf",
//             borderColor: "#4c51bf",
//             data: [65, 78, 66, 44, 56, 67, 75, 63, 25, 52, 41, 63],
//             fill: false,
//           },
//           {
//             label: new Date().getFullYear() - 1,
//             fill: false,
//             backgroundColor: "#fff",
//             borderColor: "#fff",
//             data: [40, 68, 86, 74, 56, 60, 87, 59, 67, 37, 88],
//           },
//         ],
//       },
//       options: {
//         maintainAspectRatio: false,
//         responsive: true,
//         title: {
//           display: false,
//           text: "Sales Charts",
//           fontColor: "white",
//         },
//         legend: {
//           labels: {
//             fontColor: "white",
//           },
//           align: "end",
//           position: "bottom",
//         },
//         tooltips: {
//           mode: "index",
//           intersect: false,
//         },
//         hover: {
//           mode: "nearest",
//           intersect: true,
//         },
//         scales: {
//           xAxes: [
//             {
//               ticks: {
//                 fontColor: "rgba(255,255,255,.7)",
//               },
//               display: true,
//               scaleLabel: {
//                 display: false,
//                 labelString: "Month",
//                 fontColor: "white",
//               },
//               gridLines: {
//                 display: false,
//                 borderDash: [2],
//                 borderDashOffset: [2],
//                 color: "rgba(33, 37, 41, 0.3)",
//                 zeroLineColor: "rgba(0, 0, 0, 0)",
//                 zeroLineBorderDash: [2],
//                 zeroLineBorderDashOffset: [2],
//               },
//             },
//           ],
//           yAxes: [
//             {
//               ticks: {
//                 fontColor: "rgba(255,255,255,.7)",
//               },
//               display: true,
//               scaleLabel: {
//                 display: false,
//                 labelString: "Value",
//                 fontColor: "white",
//               },
//               gridLines: {
//                 borderDash: [3],
//                 borderDashOffset: [3],
//                 drawBorder: false,
//                 color: "rgba(255, 255, 255, 0.15)",
//                 zeroLineColor: "rgba(33, 37, 41, 0)",
//                 zeroLineBorderDash: [2],
//                 zeroLineBorderDashOffset: [2],
//               },
//             },
//           ],
//         },
//       },
//     };
//     var ctx = document.getElementById("line-chart").getContext("2d");
//     window.myLine = new Chart(ctx, config);
//   }, []);
//   return (
//     <>
//       <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded bg-blueGray-700">
//         <div className="rounded-t mb-0 px-4 py-3 bg-transparent">
//           <div className="flex flex-wrap items-center">
//             <div className="relative w-full max-w-full flex-grow flex-1">
//               <h6 className="uppercase text-blueGray-100 mb-1 text-xs font-semibold">
//                 MONTH WISE SALE
//               </h6>
//               <h2 className="text-white text-xl font-semibold">Sales Revenew</h2>
//             </div>
//           </div>
//         </div>
//         <div className="p-4 flex-auto">
//           {/* Chart */}
//           <div className="relative h-350-px">
//             <canvas id="line-chart"></canvas>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }


import React from 'react';
import {Line} from 'react-chartjs-2';

const state = {
    labels: [
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ],
                datasets: [
                  {
                    label: new Date().getFullYear(),
                    backgroundColor: "#4c51bf",
                    borderColor: "#4c51bf",
                    data: [65, 78, 66, 44, 56, 67, 75, 63, 25, 52, 41, 63],
                    fill: false,
                  },
                  {
                    label: new Date().getFullYear() - 1,
                    fill: false,
                    backgroundColor: "#4c435f",
                    borderColor: "#381011",
                    data: [40, 68, 86, 74, 56, 60, 87, 59, 67, 37, 88],
                  },
  ]
}

export default class CardBarChartSales extends React.Component {
  render() {
    return (
        <>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="p-4 flex-auto">
        <div>
        <Line
          data={state}
          options={{
            title:{
              display:true,
              text:'Month Wise Sale',
              fontSize:20
            },
            legend:{
              display:true,
              position:'bottom'
            }
          }}
        />
      </div>
        </div>
      </div>
      
      </>
    );
  }
}