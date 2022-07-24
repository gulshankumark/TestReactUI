import React, { Component } from 'react';
import { Row, Col, Card, Dropdown } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { LedgerService } from '../../services/LedgerService';
import DataGrid, {
    Editing,
    Column,
    ColumnFixing,
    Paging,
    SearchPanel,
    Summary,
    TotalItem,
    GroupItem,
    SortByGroupSummaryInfo
} from 'devextreme-react/data-grid';
import '@devexpress/dx-react-grid-bootstrap4/dist/dx-react-grid-bootstrap4.css';
import { Button } from 'devextreme-react/button';
import { DateBox } from 'devextreme-react';
import Select from 'react-select';
import * as moment from 'moment';
import DifferenceDescribtion from '../ledger/DifferenceDescribtion';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';



class LedgerReport extends Component {
    constructor(props) {
        super(props);
        let fromDate = moment().subtract('2', 'months').format('MM/DD/YYYY');
        let toDate = moment().format('MM/DD/YYYY');

        this.state = {
            hasError: false,
            errorMsg: '',
            blocking: true,
            loadGrid: false,
            rowdata: [],
            startDate: fromDate,
            endDate: toDate,
            //startDateOne: moment().subtract('2', 'months').format('MM/DD/YYYY'),
            ledgerReportEntities: [],
            debitTotal: 0,
            creditTotal: 0,
            closingBalanceDebit: 0,
            closingBalanceCredit: 0,
            grandTotalDebit: 0,
            grandTotalCredit: 0,
            ledgerId: 0,
            selectedLedgerName: ''
        };

        var currentUser = AuthenticationService.currentUserValue;
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }
        this.totalDebitAmount = this.totalDebitAmount.bind(this);
        this.totalCreditAmount = this.totalCreditAmount.bind(this);
        this.closingDebit = this.closingDebit.bind(this);
        this.closingCredit = this.closingCredit.bind(this);
        this.grandDebit = this.grandDebit.bind(this);
        this.grandCredit = this.grandCredit.bind(this);
        this.startOnValueChanged = this.startOnValueChanged.bind(this);
        this.EndOnValueChanged = this.EndOnValueChanged.bind(this);
        this.LedgerIdOnValueChanged = this.LedgerIdOnValueChanged.bind(this);
        this.loadLedger = this.loadLedger.bind(this);
        this.searchByDate = this.searchByDate.bind(this);
        this.DownloadReport=this.DownloadReport.bind(this);
    }

    componentDidMount() {
        LedgerService.getLedgers().then((x) => {
            this.setState({ blocking: false });
            this.leadgersGroups(x);
        });
    }
    searchByDate(e) {
        if (Date.parse(this.state.startDate, 'dd/MM/yyyy') > Date.parse(this.state.endDate, 'dd/MM/yyyy')) {
            this.setState({ hasError: true, errorMsg: 'Start Date cannot be larger than End Date' });
            return;
        }

        if (this.state.ledgerId == 0) {
            this.setState({ hasError: true, errorMsg: 'Please select a ledger' });
            return;
        }
        this.setState({ blocking: true });
        LedgerService.getLedgerReport(this.state.startDate, this.state.endDate, this.state.ledgerId).then((report) => {
            if (report.isSuccess) {
                this.loadLedger(report);
                this.setState({ hasError: false, blocking: false });
            }
            else {
                this.setState({ blocking: false });
                this.setState({ hasError: true, errorMsg: report.message });
            }
        });
    }

    loadLedger(report) {
        var type;
        var arr = [];
        var c = 0;

        this.setState({ debitTotal: report.debitTotal });
        this.setState({ creditTotal: report.creditTotal });
        this.setState({ closingBalanceDebit: report.closingBalanceDebit });
        this.setState({ closingBalanceCredit: report.closingBalanceCredit });
        this.setState({ grandTotalDebit: report.grandTotalDebit });
        this.setState({ grandTotalCredit: report.grandTotalCredit });
        report.ledgerReportEntities.map((LedgerReport) => {
            c++;
            var partcular = [];
            var detail = '';
            var count=1;
            for (var data = 0; data < LedgerReport.particulars.length; data++) {
                if (LedgerReport.particulars[data].balanceType == 'Credit') {
                    type = 'Cr';
                    detail = `${LedgerReport.particulars[data].particularName} : \u20B9${LedgerReport.particulars[data].amount} (${type})`
                } else if (LedgerReport.particulars[data].balanceType == 'Debit') {
                    type = 'Dr';
                    detail = `${LedgerReport.particulars[data].particularName} : \u20B9${LedgerReport.particulars[data].amount} (${type})`
                }
                else {
                    detail = LedgerReport.particulars[data].particularName
                }
                var descriptionAll = {
                    particularDetails: detail,
                    count: count
                };

                partcular.push(descriptionAll);
                count++;
            }
            var data = {
                Sno: c,
                Date: moment(LedgerReport.date).format('DD-MM-YYYY'),
                VoucherNumber: LedgerReport.voucherNumber,
                VoucherType: LedgerReport.voucherType.name,
                Description: partcular,
                narration: LedgerReport.narration,
                DebitAmount: `\u20B9${LedgerReport.debitAmount}`,
                CreditAmount: `\u20B9${LedgerReport.creditAmount}`
            };
            arr.push(data);
        });
        this.setState({ ledgerReportEntities: arr });
    }
    leadgersGroups(leadgers) {
        let ret = [];
        leadgers.map((group) => {
            ret.push({ label: group.name, value: { label: group.name, value: group.id } });

            // arr.push(data);
        });

        this.setState({ rowdata: ret, loadGrid: true });
    }
    startOnValueChanged(e) {
        this.setState({ startDate: e.value });
    }
    EndOnValueChanged(e) {
        this.setState({ endDate: e.value });
    }
    LedgerIdOnValueChanged(e) {
        this.setState({ ledgerId: e.value.value, selectedLedgerName: e.label });
    }
    totalDebitAmount() {
        return this.state.debitTotal;
    }
    totalCreditAmount() {
        return this.state.creditTotal;
    }
    closingDebit() {
        return this.state.closingBalanceDebit;
    }
    closingCredit() {
        return this.state.closingBalanceCredit;
    }
    grandDebit() {
        return this.state.grandTotalDebit;
    }
    grandCredit() {
        return this.state.grandTotalCredit;
    }
    textTotal() {
        return 'Total :';
    }
    textClose() {
        return 'Closing Balance :';
    }
    textGrand() {
        return 'Grand Total :';
    }
    DownloadReport(){
        if (Date.parse(this.state.startDate, 'dd/MM/yyyy') > Date.parse(this.state.endDate, 'dd/MM/yyyy')) {
            this.setState({ hasError: true, errorMsg: 'Start Date cannot be larger than End Date' });
            return;
        }

        if (this.state.ledgerId == 0) {
            this.setState({ hasError: true, errorMsg: 'Please select a ledger' });
            return;
        }
        LedgerService.DownloadLedgerReport(this.state.startDate, this.state.endDate, this.state.ledgerId, this.state.selectedLedgerName).then((report) => {
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
                                <Card.Title as="h5">Ledgers Report</Card.Title>
                                {/* <Button className="float-right" type="success" text="Create Ledger" onClick={this.RedirectPage}></Button> */}
                            </Card.Header>
                            <Card.Body>
                                <BlockUi tag="div" blocking={this.state.blocking}>
                                    <div className="row">
                                        <div className="col-md-2">
                                            <DateBox
                                                id="Datebox1"
                                                name="dataBox1"
                                                onValueChanged={this.startOnValueChanged}
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
                                                onValueChanged={this.EndOnValueChanged}
                                                defaultValue={this.state.endDate}
                                                placeholder="To"
                                                showClearButton={true}
                                                useMaskBehavior={true}
                                                type="date"
                                                displayFormat="dd/MM/yyyy"
                                            />
                                        </div>
                                        <div className="col-md-2">
                                            <Select options={this.state.rowdata} onChange={this.LedgerIdOnValueChanged} />
                                        </div>

                                        <div className="col-md-2">
                                            <Button type="success" text="Go" onClick={this.searchByDate} />
                                        </div>
                                        <div className="col-md-2">
                                            <Button type="success" text="Download Report" onClick={this.DownloadReport} />
                                        </div>
                                        {this.state.hasError &&
                                            <div className={'alert alert-danger'}>{this.state.errorMsg}</div>
                                        }
                                    </div>
                                    <DataGrid
                                        id="gridContainer"
                                        dataSource={this.state.ledgerReportEntities}
                                        allowColumnReordering={true}
                                        allowColumnResizing={true}
                                        columnAutoWidth={true}
                                        showBorders={true}
                                        defaultCurrentDate={true}
                                        wordWrapEnabled={true}
                                    >
                                        <SearchPanel visible={true} width="250" />
                                        {/* <Paging defaultPageSize={5} /> */}
                                        <ColumnFixing enabled={true} />

                                        <Column dataField="Sno" visible={false} />
                                        <Column dataField="Date" />
                                        <Column dataField="VoucherNumber" />
                                        <Column dataField="VoucherType" />
                                        <Column dataField="Description" cellRender={DifferenceDescribtion}/>
                                        <Column dataField="DebitAmount" />
                                        <Column dataField="CreditAmount" />

                                        <Summary>
                                            <TotalItem column="Sno" showInColumn="Date" summaryType="count" />

                                            <TotalItem showInColumn="DebitAmount" customizeText={this.totalDebitAmount} />
                                            <TotalItem showInColumn="CreditAmount" customizeText={this.totalCreditAmount} />
                                            <TotalItem showInColumn="DebitAmount" customizeText={this.closingDebit} />
                                            <TotalItem showInColumn="CreditAmount" customizeText={this.closingCredit} />
                                            <TotalItem showInColumn="DebitAmount" customizeText={this.grandDebit} />
                                            <TotalItem showInColumn="CreditAmount" customizeText={this.grandCredit} />

                                            <TotalItem showInColumn="Description" alignment="right" customizeText={this.textTotal} />
                                            <TotalItem showInColumn="Description" alignment="right" customizeText={this.textClose} />
                                            <TotalItem showInColumn="Description" alignment="right" customizeText={this.textGrand} />
                                        </Summary>
                                    </DataGrid>
                                </BlockUi>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
export default LedgerReport;
