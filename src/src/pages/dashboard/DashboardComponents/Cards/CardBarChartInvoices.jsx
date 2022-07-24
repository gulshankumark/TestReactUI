import React from 'react';
import {Bar} from 'react-chartjs-2';

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
          // label: new Date().getFullYear(), 
          label: "Total Invoices",
          backgroundColor: "#4c435f",
          borderColor: "#381011",
          data: [65, 78, 52, 44, 58, 37, 75, 63, 77, 52, 41, 63],
          fill: false,
          barThickness: 18,
          order : 2,
        },
        {
          // label: new Date().getFullYear(), 
          label: "Total Sales",
          backgroundColor: "#4c51bf",
          borderColor: "#4680ff",
          data: [52, 89, 42, 63, 38, 87, 35, 53, 77, 22, 81, 93],
          fill: false,
          tension : 0.4,
          type : "line",
          order : 1,
        }
  ]
}



export default class CardBarChartInvoices extends React.Component {
  
  render() {
    return (
        <>
        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
        <div className="p-4 flex-auto">
        <div>
        <Bar
          data={state}
          options={
            {
            title:{
              display:true,
              text:'Total Sales & Invoices Per Month',
              fontSize:20,
              label:false,
            },
            legend:{
              display:true,
              position:'bottom',
              label:false,
            },
            plugins: {
            tooltips: {
              enabled: false,
            }
          },
          }}
        />
      </div>
        </div>
      </div>
      
      </>
    );
  }
}