
import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { DashboardService } from '../../../../services/DashboardService';
import DataGrid, { Column, Paging, Summary, TotalItem } from 'devextreme-react/data-grid';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import { Button } from 'devextreme-react/button';
import Form from 'react-bootstrap/Form';
// import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

class DayBookCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadGrid: false,
      rowdata: [],
      isModalVisible: false,
      totalSumOpen: '',
      totalSumCurrent: '',
    };

    
    this.customizeDataCurrent = this.customizeDataCurrent.bind(this);
    this.customizeDataOpen=this.customizeDataOpen.bind(this);
    this.RedirectPage=this.RedirectPage.bind(this);
    this.Edit=this.Edit.bind(this);
    this.leadgersGroups=this.leadgersGroups.bind(this);
  }

  componentDidMount() {
    DashboardService.GetDayBook().then((x) => {
      this.leadgersGroups(x);
    });
  }


  leadgersGroups(daybooks) {
    let arr = [];
    daybooks.map((sales) => {
      var data = {
        item1: sales.item1,
        item2: sales.item2,
      };
      arr.push(data);
    });

    this.setState({ rowdata: arr, loadGrid: true });
  }
  Edit(e) {
    var arrId = [];
    var id = {
      item1: e.row.data.item1,
      item2: e.row.data.item2

    };
    arrId.push(id);
    const { from } = this.props.location.state || { from: { pathname: '/app/ledger/UpdateLedger' } };
    this.props.history.push(from, arrId);
  }

  RedirectPage() {
    const { from } = this.props.location.state || { from: { pathname: '/app/ledger/CreateLedger' } };
    this.props.history.push(from);
  }
  customizeDataOpen() {
    if (this.state.totalSumOpen < 0) {
      return `Total : ` + this.state.totalSumOpen.toString().split(/-(.+)/)[1] + ` Dr`;
    }
    else {
      return `Total : ` + this.state.totalSumOpen + ` Cr`;
    }

  }

  customizeDataCurrent() {
    if (this.state.totalSumCurrent < 0) {
      return `Total : ` + this.state.totalSumCurrent.toString().split(/-(.+)/)[1] + ` Dr`;
    }
    else {
      return `Total : ` + this.state.totalSumCurrent + ` Cr`;
    }
  }

  render() {
    return (
      <>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <Card.Title as="h5" className='text-blueGray-400 uppercase font-bold text-xs'>Day Book</Card.Title>
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
                            <Paging defaultPageSize={7} />
                            {/* <Column dataField="id" visible={false} /> */}
                            <Column dataField="item1" caption="Name"/>
                            <Column dataField="item2" caption="Transactions" alignment="right" />
                            <Summary>
                              <TotalItem
                              column="item2"
                              summaryType="sum"
                              displayFormat="Total: {0}"
                              />
                            </Summary>
                          </DataGrid>
                        </React.Fragment>
                      )}
                    </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
export default DayBookCard;

