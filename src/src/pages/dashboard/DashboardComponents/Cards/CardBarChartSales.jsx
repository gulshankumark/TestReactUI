
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
                // label: "Total Sales",
                label: new Date().getFullYear() - 1, 
                backgroundColor: "#4c51bf",
                borderColor: "#ed64a6",
                data: [65, 78, 66, 44, 56, 67, 75, 63, 25, 52, 41, 63],
                fill: false,
                barThickness: 14,
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
        <Bar
          data={state}
          options={{
            title:{
              display:true,
              text:'Total Sales per Month',
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



// import React from 'react'
// import styled from 'styled-components'
// import { Switch } from '@material-ui/core'
// import { Slider } from '@material-ui/lab'

// import { BarChart } from 'increaser-charts'
// import { getMockBars } from 'mock';

// const Page = styled.div`
//   min-height: 100vh;
//   width: 100%;
//   background-color: #2c3e50;
//   display: flex;
//   flex-direction: column;
//   justify-content: center;
//   align-items: center;
// `

// const Container = styled.div`
//   width: 80%;
//   padding: 20px;
//   box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);
//   border-radius: 5px;
//   display: flex;
// `

// const Wrapper = styled(Container)`
//   height: 60vh;
//   align-items: center;
//   justify-content: center;
//   @media (max-width: 640px) {
//     width: 100%;
//     box-shadow: none
//   }
// `

// const Panel = styled(Container)`
//   flex-direction: column;
// `

// const PanelRow = styled.div`
//   width: 100%;
//   display: flex;
//   flex-direction: row;
//   flex-wrap: wrap;
//   justify-content: space-around;
// `

// const ParamContainer = styled.div`
//   padding: 10px;
//   margin: 10px;
//   display: flex;
//   border-radius: 5px;
//   border: 1px solid gold;
//   height: 80px;
//   width: 280px;
// `

// const BoolParam = styled(ParamContainer)`
//   flex-direction: row;
//   align-items: center;
//   justify-content: space-between;
// `

// const RangeParam = styled(ParamContainer)`
//   flex-direction: column;
//   justify-content: space-around;
// `

// const Param = styled.h4`
//   color: white;
// `

// export default class CardBarChartSales extends React.Component {
//   constructor(props) {
//     super(props)
//     const barsNumber = 60
//     const barsWithLabels = true
//     this.state = {
//       centerBarIndex: undefined,
//       barWidth: 35,
//       barSpace: 8,
//       barsNumber,
//       barsWithLabels,
//       bars: getMockBars(barsNumber, barsWithLabels),
//       showScroller: true,
//       selectCenterBarOnScroll: true
//     }
//   }

//   render() {
//     const {
//       bars,
//       barWidth,
//       barSpace,
//       centerBarIndex,
//       selectCenterBarOnScroll,
//       showScroller,
//       barsWithLabels,
//       barsNumber
//     } = this.state
//     return (
//       <Page>
//         <Wrapper>
//           <BarChart
//             bars={bars}
//             barWidth={barWidth}
//             barSpace={barSpace}
//             centerBarIndex={centerBarIndex}
//             onBarSelect={(centerBarIndex) => this.setState({ centerBarIndex })}
//             selectCenterBarOnScroll={selectCenterBarOnScroll}
//             showScroller={showScroller}
//           />
//         </Wrapper>
//         <Panel>
//           <PanelRow>
//             <BoolParam>
//               <Param>select center bar on scroll: </Param>
//               <Switch
//                 checked={selectCenterBarOnScroll}
//                 onChange={() => this.setState({ selectCenterBarOnScroll: !selectCenterBarOnScroll })}
//               />
//             </BoolParam>
//             <BoolParam>
//               <Param>bars with labels: </Param>
//               <Switch
//                 checked={barsWithLabels}
//                 onChange={() => this.toggleBarsWithLabels()}
//               />
//             </BoolParam>
//             <BoolParam>
//               <Param>show scroll: </Param>
//               <Switch
//                 checked={showScroller}
//                 onChange={() => this.setState({ showScroller: !showScroller })}
//               />
//             </BoolParam>
//           </PanelRow>
//           <PanelRow>
//             <RangeParam>
//               <Param>bar width: {barWidth}</Param>
//               <Slider
//                 value={barWidth}
//                 min={5}
//                 max={300}
//                 step={1}
//                 onChange={(_, barWidth) => this.setState({ barWidth })}
//               />
//             </RangeParam>
//             <RangeParam>
//               <Param>bar space: {barSpace}</Param>
//               <Slider
//                 value={barSpace}
//                 min={5}
//                 max={300}
//                 step={1}
//                 onChange={(_, barSpace) => this.setState({ barSpace })}
//               />
//             </RangeParam>
//             <RangeParam>
//               <Param>bars number: {barsNumber}</Param>
//               <Slider
//                 value={barsNumber}
//                 min={0}
//                 max={300}
//                 step={1}
//                 onChange={(_, barsNumber) => this.changeBarNumber(barsNumber)}
//               />
//             </RangeParam>
//           </PanelRow>
//         </Panel>
//       </Page>
//     )
//   }

//   toggleBarsWithLabels = () => {
//     const { barsNumber, barsWithLabels } = this.state
//     const newBarsWithLabels = !barsWithLabels
//     this.setState({
//       barsWithLabels: newBarsWithLabels,
//       bars: getMockBars(barsNumber, newBarsWithLabels)
//     })
//   }

//   changeBarNumber = (barsNumber) => {
//     const { barsWithLabels } = this.state
//     const bars = getMockBars(barsNumber, barsWithLabels)
//     this.setState({ bars, barsNumber })
//   }
// }