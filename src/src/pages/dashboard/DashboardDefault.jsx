import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import DebtorsCreditors from "./DashboardComponents/Cards/DebtorsCreditors";
import CardStats from "./DashboardComponents/Cards/CardStats";
import DayBookCard from './DashboardComponents/Cards/DayBookCard';
import LiquidFundCard from './DashboardComponents/Cards/LiquidFundCard';
import CardBarChartInvoices from './DashboardComponents/Cards/CardBarChartInvoices';

class DashboardDefault extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    if (!AuthenticationService.currentUserValue) {
      this.props.history.push(Config.signInPath);
      return;
    }
  }

  componentDidMount() {

  }

  render() {
    return <>

      <div className=" md:pt-2 pb-20 pt-1">
        <div className="px-4 md:px-10 mx-auto w-full">
          <div>
            {/* Card stats */}
            <div className="flex flex-wrap">
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats />
                {/* <CardStats
                  statSubtitle="PROFIT & LOSS"
                  statTitle="350,897"
                  statArrow="up"
                  statPercent="3.48"
                  statPercentColor="text-emerald-500"
                  statDescripiron="Since last Day"
                  statIconName="far fa-chart-bar"
                  statIconColor="bg-red-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="BALANCE SHEET"
                  statTitle="458"
                  statArrow="down"
                  statPercent="3.48"
                  statPercentColor="text-red-500"
                  statDescripiron="Since last week"
                  statIconName="fas fa-chart-pie"
                  statIconColor="bg-orange-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="TOTAL FUNDS"
                  statTitle="924"
                  statArrow="down"
                  statPercent="1.10"
                  statPercentColor="text-orange-500"
                  statDescripiron="Since yesterday"
                  statIconName="fas fa-users"
                  statIconColor="bg-pink-500"
                />
              </div>
              <div className="w-full lg:w-6/12 xl:w-3/12 px-4">
                <CardStats
                  statSubtitle="MONTHLY SALE"
                  statTitle="924"
                  statArrow="down"
                  statPercent="1.10"
                  statPercentColor="text-orange-500"
                  statDescripiron="Since last month"
                  statIconName="fas fa-percent"
                  statIconColor="bg-pink-500"
                /> */}

              </div>
              
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-4">
          <LiquidFundCard />
          <DayBookCard />

        </div>
        <div className="w-full xl:w-6/12 mb-12 xl:mb-0 px-8">
          {/* <CardBarChartSales /> */}
          <CardBarChartInvoices />
          <DebtorsCreditors />
        </div>
      </div>
    </>
  }
}

export default DashboardDefault;