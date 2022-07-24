import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../../config';
import { AuthenticationService } from '../../../services/AuthenticationService';
import { LedgerService } from '../../../services/LedgerService';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import DataGrid, {FilterRow, Editing, Column, ColumnFixing, Paging, SearchPanel, Summary, TotalItem } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import DiffCellName from './DiffCellName';
import DiffCellAmount from './DiffCellAmount';
import { Button } from 'devextreme-react/button';
import { DateBox } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import { SalesInvoiceService } from '../../../services/SalesInvoiceService';
import { ProformaInvoiceService } from '../../../services/ProformaInvoiceService';

import * as moment from 'moment';

class ProformaInvoice extends React.Component {
    constructor(props) {
        super(props);
        let fromDate = moment().subtract('2', 'months').format('MM/DD/YYYY');
        let toDate = moment().format('MM/DD/YYYY');

        this.state = {
            loadGrid: false,
            rowdata: [],
            startDate: fromDate,
            endDate: toDate
        };
        
        this.onValueChanged1 = this.onValueChanged1.bind(this);
        this.onValueChanged2 = this.onValueChanged2.bind(this);
        this.searchByDate = this.searchByDate.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        // this.cellRender=this.cellRender.bind(this);
        this.print = this.print.bind(this);
        // this.DownloadReport=this.DownloadReport.bind(this);
        // this.DownloadExcleReport=this.DownloadExcleReport.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }
    }
    componentDidMount() {
        ProformaInvoiceService.GetProformaInvoice(this.state.startDate, this.state.endDate).then((x) => {
            this.SalesInvoice(x);
        });
 
    }
        
    onValueChanged1(e) {
        this.setState({ startDate: e.value }); 
    }
    onValueChanged2(e) {
        this.setState({ endDate: e.value });
    }
    searchByDate() {       
        SalesInvoiceService.getSalesInvoices(this.state.startDate, this.state.endDate).then((x) => {
            this.SalesInvoice(x);
        });
    }

    SalesInvoice(invoices) {
        let arr = [];

        invoices.map((invoice) => {
            var data = {
                id: invoice.id,
                invoiceDate: moment(invoice.invoiceDate).format('DD-MM-YYYY'),
                invoiceNumber: invoice.invoiceNumber,
                companyName: invoice.companyName,
                billedTo: invoice.billedTo,
                billedToGstin: invoice.billedToGstin,
                gstin: invoice.gstin,
                billedToAddressCombined: invoice.billedToAddressCombined,
                totalCgst: invoice.totalCgst,
                totalIgst: invoice.totalIgst,
                totalSgst: invoice.totalSgst,
                totalTax: invoice.totalTax,
                totalAmountNumeric: invoice.totalAmountNumeric,
                Pname: invoice.proformaInvoiceParticularDetailsList
            };
            arr.push(data);
        });
        this.setState({ rowdata: arr, loadGrid: true });

    }
    print(value) {
        var invNumber = value.row.key.invoiceNumber;
        var id = value.row.key.id;
        ProformaInvoiceService.DownloadProformaInvoice(id, invNumber).then((response) => {
            return response;
        });
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/ProformaInvoice/CreateProformaInvoice' } };
        this.props.history.push(from);
    }

    // DownloadReport(){
    //     SalesInvoiceService.DownSalesInvoiceReports(this.state.startDate, this.state.endDate).then((report) => {
    //         return report;
    //     });
    // }
    // DownloadExcleReport(){
    //     SalesInvoiceService.DownSalesInvoiceExcleReports(this.state.startDate, this.state.endDate).then((report) => {
    //         return report;
    //     });
    // }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Proforma Invoice</Card.Title>
                                <Button
                                    className="float-right"
                                    type="success"
                                    text="Create Proforma Invoice"
                                    onClick={this.RedirectPage}
                                ></Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="row">
                                    <div className="col-md-2">
                                        <DateBox
                                            id="Datebox1"
                                            name="dataBox1"
                                            onValueChanged={this.onValueChanged1}
                                            defaultValue={this.state.startDate}
                                            placeholder="From"
                                            showClearButton={true}
                                            useMaskBehavior={true}
                                            type="date"
                                            displayFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <DateBox
                                            id="Datebox2"
                                            onValueChanged={this.onValueChanged2}
                                            defaultValue={this.state.endDate}
                                            placeholder="To"
                                            showClearButton={true}
                                            useMaskBehavior={true}
                                            type="date"
                                            displayFormat="dd/MM/yyyy"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <Button type="success" text="Go" onClick={this.searchByDate} />
                                    </div>
                                    {/* <div className="col-md-2">
                                            <Button type="success" text="Download Report" onClick={this.DownloadReport} />
                                    </div> */}
                                    {/* <div className="col-md-2">
                                            <Button type="success" text="Excle Export" onClick={this.DownloadExcleReport} />
                                    </div> */}
                                </div>
                                <DataGrid
                                  
                                    id="gridContainer"
                                    dataSource={this.state.rowdata}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    columnAutoWidth={true}
                                    showBorders={true}
                                    defaultCurrentDate={true}                                  
                                >
                                  
                                    <SearchPanel visible={true} />
                                    <Paging defaultPageSize={5} />
                                    <ColumnFixing enabled={true} />

                                    <Column dataField="invoiceDate" />
                                    <Column dataField="invoiceNumber" />
                                    <Column caption="Party Details" alignment="center">
                                        <Column dataField="billedTo" />
                                        <Column caption="GST" dataField="billedToGstin" />
                                    </Column>
                                    <Column caption="Particulars" alignment="center" >
                                        <Column caption="Name"  cellRender={DiffCellName} width={250}/>
                                        <Column caption="Amount" cellRender={DiffCellAmount} />
                                    </Column>
                                    <Column caption="TAX" dataField="totalTax" />
                                    <Column caption="Total Amount" dataField="totalAmountNumeric" />
                                    {/* <Column dataField="print"

                                        allowSorting={false}
                                        cellRender={cellRender}
                                        setCellValue={this.setCellValue}
                                        cellComponent={this.EditCell}
                                    />*/}
                                    <Column
                                        type={'buttons'}
                                        caption="Actions"
                                        buttons={[{ hint: 'Print', text: 'print', onClick: this.print }]}
                                    />
                                    <Summary>
                                        <TotalItem column="invoiceDate" summaryType="count" />
                                    </Summary>
                                </DataGrid>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}

function cellRender(data) {
    return <Button type="button" class="btn btn-info" text="print" />;
}
export default ProformaInvoice;
