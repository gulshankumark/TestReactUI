
import React, { Component } from 'react'
import { Row, Col, Card } from 'react-bootstrap'
import { DashboardService } from '../../../../services/DashboardService'
import DataGrid, { Column, Paging, Summary, TotalItem, SortByGroupSummaryInfo } from 'devextreme-react/data-grid'
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css'
import { Button } from 'devextreme-react/button'

class LiquidFundCard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      loadGrid: false,
      rowdata: [],
      totalSumCurrent: ''
    };

    this.customizeDataCurrent = this.customizeDataCurrent.bind(this);
    this.leadgersGroups=this.leadgersGroups.bind(this);
    this.customizeDataCurrent=this.customizeDataCurrent.bind(this);
  }

  componentDidMount () {    
    DashboardService.GetLiquidFundLedgers().then((x) => {
      this.leadgersGroups(x)
    })
  }


  leadgersGroups (leadgers) {
    let totalCurrentCradit = 0.0
    let totalCurrentDebit = 0.0
    let totalCurrentSum = 0.0

    let currentAmount = ''

    const arr = []
    leadgers.map((ledger) => {
      if (ledger.currentBalance < 0) {
        if (ledger.balanceType.name == 'Credit') {
          const cc = ledger.currentBalance.toString()
          var amount = cc.replace(/-/g, '')
          totalCurrentDebit += parseFloat(amount)
          currentAmount = cc + ' (Dr)'
        } else {
          const cc = ledger.currentBalance.toString()
          currentAmount = cc + ' (Cr)'
          var amount = cc.replace(/-/g, '')
          totalCurrentCradit += parseFloat(amount)
        }
      } else {
        if (ledger.balanceType.name == 'Credit') {
          const cc = ledger.currentBalance.toString()
          var amount = cc.replace(/-/g, '')
          totalCurrentCradit += parseFloat(amount)
          currentAmount = cc + ' (Cr)'
        } else {
          const cc = ledger.currentBalance.toString()
          var amount = cc.replace(/-/g, '')

          totalCurrentDebit += parseFloat(amount)
          currentAmount = cc + ' (Dr)'
        }
      }
      const data = {
        id: ledger.id,
        name: ledger.name,
        currentBalance: currentAmount.replace(/-/g, '')
      }
      arr.push(data)
    })
    // -------TotalCurrentBlance
    if (totalCurrentCradit > totalCurrentDebit) {
      totalCurrentSum = totalCurrentCradit - totalCurrentDebit
    } else {
      totalCurrentSum = totalCurrentDebit - totalCurrentCradit
    }
    this.setState({ rowdata: arr, loadGrid: true.valueOf, totalSumCurrent: totalCurrentSum.toFixed(2) })
  }

  customizeDataCurrent (e) {
    return 'Total: ' + this.state.totalSumCurrent
  }

  render () {
    return (
      <>
              <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5" className='text-blueGray-400 uppercase font-bold text-xs'>Liquid Fund</Card.Title>
                <Button className="float-right" type="success" text="Search" onClick={this.RedirectPage}></Button>
              </Card.Header>
              <Card.Body>
                <div className="form-table">
                  {this.state.loadGrid && (
                    <React.Fragment>
                      <DataGrid
                        id="gridContainer"
                        dataSource={this.state.rowdata}
                        allowColumnReordering={true}
                        allowColumnResizing={true}
                        columnAutoWidth={true}
                        showBorders={true}
                        defaultCurrentDate={true}
                        onOptionChanged={this.dataGridRef}
                      >
                        <Paging defaultPageSize={6} />
                        <Column dataField="id" visible={false} />
                        <Column dataField="name" />
                        <Column dataField="currentBalance" alignment="right" />
                        <Summary>

                          <TotalItem
                            column="currentBalance"
                            summaryType="sum"
                            showInColumn="TotalAmount"
                            displayFormat="Total Balance: {0}"
                            customizeText={this.customizeDataCurrent}
                          />
                          <TotalItem column="name" summaryType="count" />
                        </Summary>
                        <SortByGroupSummaryInfo summaryItem="count" />
                      </DataGrid>
                    </React.Fragment>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
            
      </>
    )
  }
}
export default LiquidFundCard
