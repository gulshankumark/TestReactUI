import React from 'react';
import { Row, Col, Card, } from 'react-bootstrap';
import Config from '../../../config';
import { AuthenticationService } from '../../../services/AuthenticationService';
import { PaymentReceiptService } from '../../../services/PaymentReceiptService';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import DataGrid, { Editing, Column, ColumnFixing, Paging, SearchPanel, Summary, TotalItem } from 'devextreme-react/data-grid';
import 'devextreme/dist/css/dx.light.css';
import { Button } from 'devextreme-react/button';
import { DateBox } from 'devextreme-react';
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.css';
import DiffLedgerName from './DiffLedgerName';
import DiffAmount from './DiffAmount';
import { SalesInvoiceService } from '../../../services/SalesInvoiceService';
import * as moment from 'moment';
import '../../../components/style.css'


class ViewPaymentReceipt extends React.Component {
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
        this.DownloadReport=this.DownloadReport.bind(this);
        this.DownloadReport = this.downlodeReceipts.bind(this);
        // this.print = this.print.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }
    }

    componentDidMount() {
        PaymentReceiptService.GetPaymentReceipts(this.state.startDate, this.state.endDate).then((x) => {
            this.loadPaymentReceipt(x);
        });
    }

    onValueChanged1(e) {
        this.setState({ startDate: e.value });
    }

    onValueChanged2(e) {
        this.setState({ endDate: e.value });
    }

    searchByDate() {
        PaymentReceiptService.GetPaymentReceipts(this.state.startDate, this.state.endDate).then((x) => {
            this.loadPaymentReceipt(x);
        });
    }

    loadPaymentReceipt(PaymentReceipt) {
        this.setState({ rowdata: [], loadGrid: false });

        let arr = PaymentReceipt.map((paymentReceipt) => {
            return {
                date: moment(paymentReceipt.dateIssued).format('DD-MM-YYYY'),
                voucherNumber: paymentReceipt.invoiceNumber,
                voucherType: paymentReceipt.voucherType,
                mode: paymentReceipt.transactionModeName,
                ledgerDetails: paymentReceipt.ledgerDetails,
                narration: paymentReceipt.narration,
                amount: paymentReceipt.totalAmount,
                id: paymentReceipt.id
            };
        });
        this.setState({ rowdata: arr, loadGrid: true });


    }

    print(value) {
        var voucherNumber = value.row.key.voucherNumber;
        var id = value.row.key.id;
        PaymentReceiptService.DownloadPaymentReceipts(id, voucherNumber).then((response) => {
            return response;
        });
    }
    downlodeReceipts(value) {
        let VoucherType = value.row.key.voucherType;
        var id = value.row.key.id;
        if (VoucherType == 'Receipt') {
            PaymentReceiptService.DownloadMoneyReceipts(id).then((response) => {
                if (response.isSuccess) {
                    console.log(response);
                    return response;
                } else {
                    alert('Error');
                }
            });
        }
        else{
            alert('Receipt is not valid for this voucher type.');
        }
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/paymentReceipt/CreatePaymentReceipt' } };
        this.props.history.push(from);
    }
    DownloadReport(){
        if (Date.parse(this.state.startDate, 'dd/MM/yyyy') > Date.parse(this.state.endDate, 'dd/MM/yyyy')) {
            this.setState({ hasError: true, errorMsg: 'Start Date cannot be larger than End Date' });
            return;
        }

        PaymentReceiptService.DownloadPaymentReceiptsReport(this.state.startDate, this.state.endDate).then((report) => {
            return report;
        });
    }
    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Payment Receipt</Card.Title>
                                <Button
                                    className="float-right"
                                    type="success"
                                    text="Create Payment Receipt"
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
                                    <div className="col-md-2">
                                        <Button type="success" text="Download Report" onClick={this.DownloadReport} />
                                    </div>
                                </div>
                                <DataGrid
                                    id="gridContainer"
                                    dataSource={this.state.rowdata}
                                    allowColumnReordering={true}
                                    allowColumnResizing={true}
                                    columnAutoWidth={true}
                                    showBorders={true}
                                    defaultCurrentDate={true}
                                    wordWrapEnabled={true}
                                >
                                    <SearchPanel visible={true} />
                                    <Paging defaultPageSize={5} />
                                    <ColumnFixing enabled={true} />
                                    <Column dataField="date" />
                                    <Column dataField="voucherNumber" />
                                    <Column dataField="voucherType" />
                                    <Column dataField="mode" />
                                    {/* <Column dataField="paidToOrReceivedFrom" /> */}
                                    <Column caption="Paid To/Received From" alignment="center">
                                        <Column caption="Name" cellRender={DiffLedgerName} />
                                        <Column caption="Amount" cellRender={DiffAmount} />
                                    </Column>
                                    <Column dataField="narration" width={200} cssClass="font" />
                                    <Column dataField="amount" />
                                    <Column
                                        type={'buttons'}
                                        caption="Actions"
                                        buttons={[
                                            { hint: 'Print', text: 'print', onClick: this.print },
                                            { hint: 'Print', text: 'Receipt', onClick: this.downlodeReceipts }
                                        ]}
                                    />
                                    <Summary>
                                        <TotalItem column="date" summaryType="count" />
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

// function cellRender(data) {
//     return <Button type="button" class="btn btn-info" text="print" />;
// }
export default ViewPaymentReceipt;
