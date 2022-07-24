import React, { Component } from 'react';
import { Row, Col, Card, Dropdown } from 'react-bootstrap';
import Config from '../../../config';
import { AuthenticationService } from '../../../services/AuthenticationService';
import { LedgerService } from '../../../services/LedgerService';
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
// import DifferenceDescribtion from './DifferenceDescribtion';
import BlockUi from 'react-block-ui';
import 'react-block-ui/style.css';
import { JournalContraService } from '../../../services/JournalContraService';
import cellLedgersName from './LedgersName';
import cellCreditAmount from './CreditAmount';
import cellDebitAmount from './DebitAmount';



class JournalView extends Component {
    constructor(props) {
        super(props);
        //this.dataSource = countries.getWeakData();
        this.state = {
            startDate: moment().subtract('2', 'months').format('MM/DD/YYYY'),
            endDate: moment().format('MM/DD/YYYY'),
            countraLedger: []
        };

        var currentUser = AuthenticationService.currentUserValue;
        this.RedirectPage = this.RedirectPage.bind(this);
        this.onValueChanged1 = this.onValueChanged1.bind(this);
        this.onValueChanged2 = this.onValueChanged2.bind(this);
        this.loadContraLedgers = this.loadContraLedgers.bind(this);
        this.searchByDate = this.searchByDate.bind(this);
        this.DownloadReport = this.DownloadReport.bind(this);
        // this.onShowing=this.onShowing.bind(this);
        // redirect to login if not logged in
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
            return;
        }

        if (
            !(
                currentUser.role == AuthenticationService.superAdmin ||
                currentUser.role == AuthenticationService.admin ||
                currentUser.role == AuthenticationService.clientAdmin
            )
        ) {
            AuthenticationService.logout();
            this.props.history.push(Config.signInPath);
        }
    }
    componentDidMount() {
        JournalContraService.GetJournalContras(this.state.startDate, this.state.endDate).then((contras) => {
            this.loadContraLedgers(contras);
        });
    }

    onValueChanged1(e) {
        this.setState({ startDate: e.value });
    }
    onValueChanged2(e) {
        this.setState({ endDate: e.value });
    }

    searchByDate() {
        JournalContraService.GetJournalContras(this.state.startDate, this.state.endDate).then((contras) => {
            this.loadContraLedgers(contras);
        });
    }
    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/Journal_Contra/CreateJournal' } };
        this.props.history.push(from);
    }
    print(value) {
        var voucherNumber = value.row.key.VoucherNumber;
        var id = value.row.key.Id;
        JournalContraService.DownloadJournalContras(id, voucherNumber).then((response) => {
            return response;

        });
    }


    loadContraLedgers(contras) {
        var arr = [];

        contras.map((contra) => {
            var c = 0;

            var contraLedger = contra.particularEntities;
            var ledgerNameDetails = [];
            var debitAmountDetails = [];
            var creditAmountDetails = [];
            var ladgerNarration = "(" + contra.narration + ")";
            var count = 1;
            contra.particularEntities.map((ledger) => {

                var narration;
                if (count == contra.particularEntities.length) {
                    narration = ladgerNarration;
                    count = 0;
                }
                count++;
                var ledgerName = '';
                if (ledger.balanceType == 'Debit') {
                    ledgerName = `${ledger.ledgerName} ......Dr`;
                } else if (ledger.balanceType == 'Credit') {
                    ledgerName = `TO......${ledger.ledgerName}`;
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

            // var ledgerName = contra.particularEntities && contra.particularEntities[c].ledgerName;
            c++;

            var data = {
                Id: contra.id,
                Date: moment(contra.date).format('DD-MM-YYYY'),
                VoucherNumber: contra.invoiceNumber,
                VoucherType: contra.voucherType,
                Ledgers: ledgerNameDetails,
                DebitAmount: debitAmountDetails,
                CreditAmount: creditAmountDetails
            };
            arr.push(data);

        });
        this.setState({ countraLedger: arr });
    }

    DownloadReport(e) {
        JournalContraService.DownJournalContraReports(this.state.startDate, this.state.endDate).then((report) => {
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
                                <Card.Title as="h5">Journal View</Card.Title>

                                <Button className="float-right" type="success" text="Create Journal" onClick={this.RedirectPage}></Button>
                            </Card.Header>
                            <Card.Body>
                                {/* <BlockUi tag="div" blocking={this.state.blocking}> */}
                                <div className="row">
                                    <div className="col-md-2">
                                        <DateBox
                                            id="Datebox1"
                                            name="dataBox1"
                                            onValueChanged={this.onValueChanged1}
                                            // onValueChanged={this.startOnValueChanged}

                                            placeholder="From"
                                            showClearButton={true}
                                            useMaskBehavior={true}
                                            type="date"
                                            displayFormat="dd/MM/yyyy"
                                            defaultValue={this.state.startDate}
                                        // placeholder="From date"
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <DateBox
                                            id="Datebox2"
                                            onValueChanged={this.onValueChanged2}
                                            // onValueChanged={this.EndOnValueChanged}

                                            placeholder="To"
                                            showClearButton={true}
                                            useMaskBehavior={true}
                                            type="date"
                                            displayFormat="dd/MM/yyyy"
                                            defaultValue={this.state.endDate}
                                        />
                                    </div>

                                    <div className="col-md-2">
                                        <Button type="success" text="Go" onClick={this.searchByDate} />
                                    </div>

                                    <div className="col-md-2">
                                        <Button type="success" text="Download JournalContra Report" onClick={this.DownloadReport} />
                                    </div>
                                </div>
                                <React.Fragment>
                                    <DataGrid
                                        id="gridContainer"
                                        dataSource={this.state.countraLedger}
                                        allowColumnReordering={true}
                                        allowColumnResizing={true}
                                        columnAutoWidth={true}
                                        showBorders={true}
                                        defaultCurrentDate={true}
                                        wordWrapEnabled={true}
                                    >
                                        <SearchPanel visible={true} />
                                        {/* <Paging defaultPageSize={5} /> */}
                                        <ColumnFixing enabled={true} />

                                        <Column dataField="Sno" visible={false} />
                                        <Column dataField="Date" />
                                        <Column dataField="VoucherNumber" width={130} />
                                        <Column dataField="VoucherType" />
                                        <Column dataField="Ledgers" cellRender={cellLedgersName} width={400} />
                                        <Column dataField="DebitAmount" alignment="left" cellRender={cellDebitAmount} />
                                        <Column dataField="CreditAmount" alignment="right" cellRender={cellCreditAmount} />
                                        {/* <Column
                                            type={'buttons'}
                                            caption="Actions"
                                            buttons={[{ hint: 'Print', text: 'print', onClick: this.print }]}
                                       />*/}

                                        <Column
                                            type={'buttons'}
                                            caption="Actions"
                                            buttons={[{ hint: 'Print', text: 'print', onClick: this.print }]}
                                        />

                                        <Summary>
                                            <TotalItem column="Sno" showInColumn="Date" summaryType="count" />
                                            {/*<TotalItem Column="cellDebitAmount" showInColumn="cellDebitAmount" summaryType="sum"  />
                                            <TotalItem Column="CreditAmount" showInColumn="CreditAmount" summaryType="sum"  /> */}
                                        </Summary>
                                    </DataGrid>
                                </React.Fragment>
                                {/* </BlockUi> */}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
export default JournalView;
