import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../../config';
import { AuthenticationService } from '../../../services/AuthenticationService';
// import { LedgerService } from '../../../services/LedgerService';
import DataGrid, {
    Pager,
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
// import { VehicleService } from '../../../services/VehicleService';
import { DualTransactionService } from '../../../services/DualTransactionService';
import * as moment from 'moment';
import { DateBox } from 'devextreme-react';
import { LedgersName } from './LedgersName';

class DualTransaction extends Component {
    constructor(props) {
        super(props);
        let fromDate = moment().subtract('2', 'months').format('MM/DD/YYYY');
        let toDate = moment().format('MM/DD/YYYY');

        this.state = {
            loadGrid: true,
            rowdata: [],
            startDate: fromDate,
            endDate: toDate
        };

        this.RedirectPage = this.RedirectPage.bind(this);
        this.onValueChanged1 = this.onValueChanged1.bind(this);
        this.onValueChanged2 = this.onValueChanged2.bind(this);
        this.searchByDate = this.searchByDate.bind(this);
        var currentUser = AuthenticationService.currentUserValue;
        this.print = this.print.bind(this);
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }
    }

    componentDidMount() {
        DualTransactionService.GetDualTransactions(this.state.startDate, this.state.endDate).then((x) => {
            console.log(x);
            this.DualDetails(x);
        });
    }

    DualDetails(details) {
        let arr = [];
        details.map((group) => {
            var c = 0;
            var contraLedger = group.particularData;
            var ledgerNameDetails = [];
            var debitAmountDetails = [];
            var creditAmountDetails = [];
            var ladgerNarration = '(' + group.narration + ')';
            var count = 1;

            var PartyNameTop = '';
            var PartyNameButtom = '';
            var topAmountDebit = '';
            var topAmountCredit = '';
            var buttomAmountDebit = '';
            var buttomAmountCredit = '';

            if (group.voucherType == 'Receipt') {
                PartyNameTop = `${group.partyName} ...............Dr`;
                topAmountDebit = group.debitAmount;
                topAmountCredit = '_';
            } else if (group.voucherType == 'Payment') {
                PartyNameTop = `TO............... ${group.partyName}`;
                topAmountCredit = group.creditAmount;
                topAmountDebit = '_';
            }

            if (group.voucherType == 'Receipt') {
                PartyNameButtom = `TO................ ${group.partyName}`;
                buttomAmountCredit = group.creditAmount;
                buttomAmountDebit = '_';
            } else if (group.voucherType == 'Payment') {
                PartyNameButtom = `${group.partyName} ...............Dr`;
                buttomAmountDebit = group.debitAmount;
                buttomAmountCredit = '_';
            }

            group.particularData.map((ledger) => {
                var narration;
                if (count == group.particularData.length) {
                    narration = ladgerNarration;
                    count = 0;
                }
                count++;
                var ledgerName = '';
                if (ledger.balanceType == 'Debit') {
                    ledgerName = `${ledger.ledgerName} ........Dr`;
                } else if (ledger.balanceType == 'Credit') {
                    ledgerName = `TO.........${ledger.ledgerName}`;
                }

                var LedgersNameData = {
                    ledgersName: ledgerName,
                    narration: narration
                };
                narration = '';
                ledgerNameDetails.push(LedgersNameData);
                var creditAmount = {};
                var debitAmount = {};
                if (ledger.balanceType == 'Debit') {
                    debitAmount = {
                        balanceTypee: ledger.balanceType,
                        debitAmount: ledger.amount
                    };
                    creditAmount = {
                        balanceTypee: ledger.balanceType,
                        creditAmount: '-'
                    };
                    debitAmountDetails.push(debitAmount);
                    creditAmountDetails.push(creditAmount);
                    // ledgerName =contra.particularEntities && `${contra.particularEntities[c].ledgerName} ......DR`;
                } else if (ledger.balanceType == 'Credit') {
                    creditAmount = {
                        balanceTypee: ledger.balanceType,
                        creditAmount: ledger.amount
                    };
                    debitAmount = {
                        balanceTypee: ledger.balanceType,
                        debitAmount: '-'
                    };
                    creditAmountDetails.push(creditAmount);
                    debitAmountDetails.push(debitAmount);
                    // ledgerName = contra.particularEntities && `TO...... ${contra.particularEntities[c].ledgerName}`;
                }
            });
            c++;
            var data = {
                date: moment(group.date).format('DD-MM-YYYY'),
                creditAmount: creditAmountDetails,
                debitAmount: debitAmountDetails,
                narration: group.narration,
                netDueAmount: group.netDueAmount,
                vehicleNumber: group.vehicleNumber,
                voucherNumber: group.voucherNumber,
                voucherType: group.voucherType,
                netDueAmount: group.netDueAmount,
                ledgersData: ledgerNameDetails,

                PartyNameTop: PartyNameTop,
                PartyNameButtom: PartyNameButtom,
                ladgerNarration: ladgerNarration,
                topAmountCredit: topAmountCredit,
                topAmountDebit: topAmountDebit,
                buttomAmountCredit: buttomAmountCredit,
                buttomAmountDebit: buttomAmountDebit
            };
            arr.push(data);
        });
        // arr.reverse();
        this.setState({ rowdata: arr, loadGrid: true });
    }

    RedirectPage() {
        this.props.history.push('/app/DualTransaction/CreateDualTransaction');
    }

    onValueChanged1(e) {
        this.setState({ startDate: e.value });
    }
    onValueChanged2(e) {
        this.setState({ endDate: e.value });
    }
    searchByDate() {
        DualTransactionService.GetDualTransactions(this.state.startDate, this.state.endDate).then((x) => {
            this.DualDetails(x);
        });
    }
    print(value) {
        var invNumber = value.row.key.voucherNumber;
        // var id = value.row.key.id;
        DualTransactionService.DownlodeDualTransactionInvoice( invNumber).then((response) => {
            return response;
        });
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Dual Transaction</Card.Title>
                                <Button
                                    className="float-right"
                                    type="success"
                                    text="Create Dual Transaction"
                                    onClick={this.RedirectPage}
                                ></Button>
                            </Card.Header>
                            <Card.Body>
                                <div className="form-table">
                                    {this.state.loadGrid && (
                                        <React.Fragment>
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
                                                onOptionChanged={this.dataGridRef}
                                            >
                                                <SearchPanel visible={true} />
                                                <Paging defaultPageSize={10} />

                                                <ColumnFixing enabled={true} />
                                                {/* <Column caption="SNo"/> */}
                                                <Column dataField="date" />
                                                <Column dataField="voucherNumber" />
                                                <Column dataField="voucherType" />
                                                <Column caption="Ledgers" cellRender={LedgersName.Ledger} width={400} />
                                                <Column caption="Debit Amount" cellRender={LedgersName.DebitAmount} />
                                                <Column caption="Credit Amount" cellRender={LedgersName.CreditAmount} />
                                                <Column
                                                    type={'buttons'}
                                                    caption="Actions"
                                                    buttons={[{ hint: 'Print', text: 'print', onClick: this.print }]}
                                                />
                                                {/* <Column dataField="netDueAmount" /> */}

                                                {/* 
                                                <Summary>
                                                    <TotalItem column="name" summaryType="count" />
                                                    <TotalItem showInColumn="OpeningBalance" customizeText={this.customizeDataOpen} />
                                                    <TotalItem showInColumn="CurrentBalance" customizeText={this.customizeDataCurrent} />
                                                </Summary>
                                                <SortByGroupSummaryInfo summaryItem="count" /> */}
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
export default DualTransaction;
