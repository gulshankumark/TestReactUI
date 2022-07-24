import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
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
import BlockUi from 'react-block-ui';
import { Button } from 'devextreme-react/button';
import { GstReportService } from '../../services/GstReportService';
import { GstGridCell } from './GstGridCell';

class Gstr1Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gstr1Data: [],
            loadGrid: false,
            B2BEnable: false,
            B2CEnable: false,
            title: '',
            ExportsInvoiceEnable: false,
            B2COthersEnable: false,
            NillRatedSuppliesEnable: false,
            CreditDebitRegisteredEnable: false,
            CreditDebitUnRegisteredEnable: false,
            TAXLiabilityEnable: false,
            Adjustment11BEnable: false,
            HSNEnable: false,
            DocumentIssuedEnable: false,
            fromDate: null,
            toDate: null
        };
        // redirect to login if not logged in
        this.RedirectPage = this.RedirectPage.bind(this);
        this.loadData = this.loadData.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
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
        var FromDate = this.props.location && this.props.location.state.startDate;
        var ToDate = this.props.location && this.props.location.state.endDate;
        var status = this.props.location && this.props.location.state.status;
        this.setState({
            fromDate: FromDate,
            toDate: ToDate
        });
        
        
        // if (status == 'B2B') {
        //     this.setState({ B2BEnable: true });
        // } else {
        //     this.setState({ B2BEnable: false });
        // }
        // if (status == 'B2C') {
        //     this.setState({ B2CEnable: true });
        // } else {
        //     this.setState({ B2CEnable: false });
        // }

        if (status == 'B2B') {
            this.setState({ B2BEnable: true, title: '4A,4B,6B,6C-B2B,SEZ,DE,Invoices' });
            GstReportService.GridFillData(FromDate, ToDate).then(response => {
                this.loadData(response.data, status);
            });
        } else if (status == 'B2C') {
            this.setState({ B2CEnable: true, title: '5A-B2C(Large) Invoices' });
            
            GstReportService.GridFillData(FromDate, ToDate).then(response => {
                this.loadData(response.data, status);
            });
        } else if (status == 'ExportsInvoice') {
            this.setState({ ExportsInvoiceEnable: true, title: '6A-Exports Invoice' });
        } else if (status == 'B2COthers') {
            this.setState({ B2COthersEnable: true, title: '7-B2C(Others)' });
        } else if (status == 'NillRatedSupplies') {
            this.setState({ NillRatedSuppliesEnable: true, title: '8A,8B,8C,8D- Nill Rated Supplies' });
            GstReportService.GridFillData(FromDate, ToDate).then(response => {
                this.loadData(response.data, status);
            });
        } else if (status == 'CreditDebitRegistered') {
            this.setState({ CreditDebitRegisteredEnable: true, title: '9B - Credit/Debit Notes(Registered)' });
        } else if (status == 'CreditDebitUnRegistered') {
            this.setState({ CreditDebitUnRegisteredEnable: true, title: '9B - Credit/Debit Notes(UnRegistered)' });
        } else if (status == 'TAXLiability') {
            this.setState({ TAXLiabilityEnable: true, title: '11A(1),11A(2)-TAX Liability(Advances Received)' });
        } else if (status == 'Adjustment11B') {
            this.setState({ Adjustment11BEnable: true, title: '11B(1),11B(2) Adjustment of Advances' });
        } else if (status == 'HSN') {
            this.setState({ HSNEnable: true, title: '12-HSN-Wise Summary of outward supplies' });            
            GstReportService.GridFillData(FromDate, ToDate).then(response => {
                this.loadData(response.data, status);
            });
        } else if (status == 'DocumentIssued') {
            this.setState({ DocumentIssuedEnable: true, title: 'Document Issued' });
            GstReportService.GridFillData(FromDate, ToDate).then(response => {
                this.loadData(response.data, status);
            });
        } else {
            this.setState({
                B2BEnable: false,
                B2CEnable: false,
                ExportsInvoiceEnable: false,
                B2COthersEnable: false,
                NillRatedSuppliesEnable: false,
                CreditDebitRegisteredEnable: false,
                CreditDebitUnRegisteredEnable: false,
                TAXLiabilityEnable: false,
                Adjustment11BEnable: false,
                HSNEnable: false,
                DocumentIssuedEnable: false
            });
        }

        
    }
    loadData(gstr1, status) {
        var arr = [];
        if (status == "B2B") {

        }
        else if (status == "B2C") {
            gstr1.b2Cs.map((gstrdata) => {
                var data = {
                    suplyType: gstrdata.splyTy,
                    type: gstrdata.typ,
                    txval: gstrdata.txval,
                    pos: gstrdata.posStateName,
                    rt: gstrdata.rt,
                    camt: gstrdata.camt,
                    csamt: gstrdata.csamt,
                    iamt: gstrdata.iamt,
                    samt: gstrdata.samt,
                }
                arr.push(data);
            });
            this.setState({ gstr1Data: arr, loadGrid: true });
        }
        else if (status == "NillRatedSupplies") {
            gstr1.nil.inv.map((gstrData) => {
                var data = {
                    splyTy: gstrData.splyTy,
                    exptAmt: gstrData.exptAmt,
                    nilAmt: gstrData.nilAmt,
                    ngsupAmt: gstrData.ngsupAmt,
                }
                arr.push(data);
            });

            this.setState({ gstr1Data: arr, loadGrid: true });
        }
        else if (status == "DocumentIssued") {
            var data;
            
            var c=0;
            gstr1.docIssue.docDet.map((docIssue) => {
                var numarr = [];
                docIssue.docs.map((docIssueData) => {
                    var arrData = {
                        num: docIssueData.num,
                        from: docIssueData.from,
                        to: docIssueData.to,
                        totnum: docIssueData.totnum,
                        cancel: docIssueData.cancel,
                        netIssue: docIssueData.netIssue
                    };
                    numarr.push(arrData);
                    c++;
                });
                data = {
                    docNum: docIssue.docNum,
                    docTyp: docIssue.docTyp,
                    num: numarr,
                    from: numarr,
                    to: numarr,
                    totnum: numarr,
                    cancel: numarr,
                    netIssue: numarr
                };

                arr.push(data);

            });
            this.setState({ gstr1Data: arr, loadGrid: true });
        }
        else if(status=="HSN"){
            gstr1.hsn.data.map((hsn) => {
                var data = {
                    csamt: hsn.csamt,
                    iamt: hsn.iamt,
                    samt: hsn.samt,
                    camt: hsn.camt,
                    hsnSc: hsn.hsnSc,
                    rt: hsn.rt,
                    uqc: hsn.uqc,
                    txval: hsn.txval,
                    qty: hsn.qty,
                    num: hsn.num
                }
                arr.push(data);
            });
            this.setState({ gstr1Data: arr, loadGrid: true });
        }
    }
    RedirectPage() {
        // const { from } = this.props.location.state || { from: { pathname: '/app/gst/Gstr1Details' } };
        var data = {
            startDate: this.state.fromDate,
            endDate: this.state.toDate,
        };

        this.props.history.push({ pathname: '/app/gst/ViewGstr1', state: data });
    }
    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <div className="row">
                                    <div className='col-md-4'><Card.Title as="h5">{this.state.title}</Card.Title></div>
                                    <div className='col-md-6'><p style={{text:"bold"}}>Date:- From -- {this.state.startDate}  /  To -- {this.state.endDate}</p> </div>
                                    <div className='col-md-2'><Button className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Button></div>
                                </div>                                 
                            </Card.Header>
                            <Card.Body>
                                <BlockUi tag="div" blocking={this.state.blocking}>
                                    <React.Fragment>
                                        <DataGrid
                                            id="gridContainer"
                                            dataSource={this.state.gstr1Data}
                                            allowColumnReordering={true}
                                            allowColumnResizing={true}
                                            columnAutoWidth={true}
                                            showBorders={true}
                                            defaultCurrentDate={true}
                                            wordWrapEnabled={true}
                                        >
                                            <SearchPanel visible={true} />
                                            <Paging defaultPageSize={15} />
                                            <ColumnFixing enabled={true} />
                                            
                                            {/* B2B */}
                                            <Column dataField="suplyType" visible={this.state.B2BEnable} />
                                            <Column dataField="Date" visible={this.state.B2BEnable} />
                                            <Column dataField="VoucherNumber" visible={this.state.B2BEnable} />
                                            <Column dataField="VoucherType" visible={this.state.B2BEnable} />
                                            <Column dataField="Ledgers" visible={this.state.B2BEnable} />
                                            <Column dataField="DebitAmount" visible={this.state.B2BEnable} />
                                            <Column dataField="CreditAmount" visible={this.state.B2BEnable} />
                                            <Column dataField="VehicleDetails" visible={this.state.B2BEnable} />

                                            {/* B2C  Large*/}
                                            <Column dataField="suplyType" caption="Supply Type" visible={this.state.B2CEnable} />
                                            <Column dataField="type" caption="Type" visible={this.state.B2CEnable} />
                                            <Column dataField="txval" caption="Taxable Value" visible={this.state.B2CEnable} />
                                            <Column dataField="pos" caption="Place Of Supply" visible={this.state.B2CEnable} />
                                            <Column dataField="rt" caption="Rate" visible={this.state.B2CEnable} />
                                            <Column dataField="camt" caption="Central Tax Amount" visible={this.state.B2CEnable} />
                                            <Column dataField="csamt" caption="Cess Amount" visible={this.state.B2CEnable} />
                                            <Column dataField="iamt" caption="Integrated Tax Amount" visible={this.state.B2CEnable} />
                                            <Column dataField="samt" caption="State Tax Amount" visible={this.state.B2CEnable} />

                                            {/* ExportsInvoic */}
                                            <Column dataField="Sno" visible={this.state.ExportsInvoiceEnable} />
                                            <Column dataField="Date" visible={this.state.ExportsInvoiceEnable} />
                                            <Column dataField="nilAmt" caption="Nill Amount" visible={this.state.ExportsInvoiceEnable} />
                                            <Column dataField="VoucherType" visible={this.state.ExportsInvoiceEnable} />
                                            <Column dataField="Ledgers" visible={this.state.ExportsInvoiceEnable} />
                                            <Column dataField="DebitAmount" visible={this.state.ExportsInvoiceEnable} />
                                            <Column dataField="CreditAmount" visible={this.state.ExportsInvoiceEnable} />
                                            <Column dataField="VehicleDetails" visible={this.state.ExportsInvoiceEnable} />

                                            {/* B2COthersEnable */}
                                            <Column dataField="Sno" visible={this.state.B2COthersEnable} />
                                            <Column dataField="Date" visible={this.state.B2COthersEnable} />
                                            <Column dataField="VoucherNumber" visible={this.state.B2COthersEnable} />
                                            <Column dataField="VoucherType" visible={this.state.B2COthersEnable} />
                                            <Column dataField="Ledgers" visible={this.state.B2COthersEnable} />
                                            <Column dataField="DebitAmount" visible={this.state.B2COthersEnable} />
                                            <Column dataField="CreditAmount" visible={this.state.B2COthersEnable} />
                                            <Column dataField="VehicleDetails" visible={this.state.B2COthersEnable} />

                                            {/* NillRatedSupplies */}
                                            <Column dataField="splyTy" caption="Supply Type" visible={this.state.NillRatedSuppliesEnable} />
                                            <Column dataField="exptAmt" caption="Exempted Amount" visible={this.state.NillRatedSuppliesEnable} />
                                            <Column dataField="nilAmt" caption="Nill Amount" visible={this.state.NillRatedSuppliesEnable} />
                                            <Column dataField="ngsupAmt" caption="ng Supply Amount" visible={this.state.NillRatedSuppliesEnable} />

                                            {/* CreditDebitRegistered */}

                                            <Column dataField="Sno" visible={this.state.CreditDebitRegisteredEnable} />
                                            <Column dataField="Date" visible={this.state.CreditDebitRegisteredEnable} />
                                            <Column dataField="VoucherNumber" visible={this.state.CreditDebitRegisteredEnable} />
                                            <Column dataField="VoucherType" visible={this.state.CreditDebitRegisteredEnable} />
                                            <Column dataField="Ledgers" visible={this.state.CreditDebitRegisteredEnable} />
                                            <Column dataField="DebitAmount" visible={this.state.CreditDebitRegisteredEnable} />
                                            <Column dataField="CreditAmount" visible={this.state.CreditDebitRegisteredEnable} />
                                            <Column dataField="VehicleDetails" visible={this.state.CreditDebitRegisteredEnable} />

                                            {/* CreditDebitUnRegistered */}
                                            <Column dataField="Sno" visible={this.state.CreditDebitUnRegisteredEnable} />
                                            <Column dataField="Date" visible={this.state.CreditDebitUnRegisteredEnable} />
                                            <Column dataField="VoucherNumber" visible={this.state.CreditDebitUnRegisteredEnable} />
                                            <Column dataField="VoucherType" visible={this.state.CreditDebitUnRegisteredEnable} />
                                            <Column dataField="Ledgers" visible={this.state.CreditDebitUnRegisteredEnable} />
                                            <Column dataField="DebitAmount" visible={this.state.CreditDebitUnRegisteredEnable} />
                                            <Column dataField="CreditAmount" visible={this.state.CreditDebitUnRegisteredEnable} />
                                            <Column dataField="VehicleDetails" visible={this.state.CreditDebitUnRegisteredEnable} />

                                            {/* TAXLiability */}
                                            <Column dataField="Sno" visible={this.state.TAXLiabilityEnable} />
                                            <Column dataField="Date" visible={this.state.TAXLiabilityEnable} />
                                            <Column dataField="VoucherNumber" visible={this.state.TAXLiabilityEnable} />
                                            <Column dataField="VoucherType" visible={this.state.TAXLiabilityEnable} />
                                            <Column dataField="Ledgers" visible={this.state.TAXLiabilityEnable} />
                                            <Column dataField="DebitAmount" visible={this.state.TAXLiabilityEnable} />
                                            <Column dataField="CreditAmount" visible={this.state.TAXLiabilityEnable} />
                                            <Column dataField="VehicleDetails" visible={this.state.TAXLiabilityEnable} />

                                            {/*11B Adjustment */}

                                            <Column dataField="Sno" visible={this.state.Adjustment11BEnable} />
                                            <Column dataField="Date" visible={this.state.Adjustment11BEnable} />
                                            <Column dataField="VoucherNumber" visible={this.state.Adjustment11BEnable} />
                                            <Column dataField="VoucherType" visible={this.state.Adjustment11BEnable} />
                                            <Column dataField="Ledgers" visible={this.state.Adjustment11BEnable} />
                                            <Column dataField="DebitAmount" visible={this.state.Adjustment11BEnable} />
                                            <Column dataField="CreditAmount" visible={this.state.Adjustment11BEnable} />
                                            <Column dataField="VehicleDetails" visible={this.state.Adjustment11BEnable} />

                                            {/* //HSN */}
                                            <Column dataField="num" caption="Number" visible={this.state.HSNEnable} />
                                            <Column dataField="csamt" caption="Cess Amount" visible={this.state.HSNEnable} />
                                            <Column dataField="iamt" caption="Integrated Tax Anmount" visible={this.state.HSNEnable} />
                                            <Column dataField="samt" caption="State Amount" visible={this.state.HSNEnable} />
                                            <Column dataField="camt" Caption="Central Amount" visible={this.state.HSNEnable} />
                                            <Column dataField="hsnSc" Caption="HsnSc" visible={this.state.HSNEnable} />
                                            <Column dataField="rt" caption="Rate" visible={this.state.HSNEnable} />
                                            <Column dataField="uqc" Caption="UQC" visible={this.state.HSNEnable} />
                                            <Column dataField="txval" caption="Taxable Amount" visible={this.state.HSNEnable} />
                                            <Column dataField="qty" caption="Quantity" visible={this.state.HSNEnable} />
                                            

                                            {/* DocumentIssued */}
                                            <Column dataField="docNum" caption="Doc Number" visible={this.state.DocumentIssuedEnable} />
                                            <Column dataField="docTyp" caption="Doc Type" visible={this.state.DocumentIssuedEnable} />
                                            <Column dataField="num" caption="Number" visible={this.state.DocumentIssuedEnable} cellRender={GstGridCell.NumberCellRender} />
                                            <Column dataField="from" caption="From" visible={this.state.DocumentIssuedEnable} cellRender={GstGridCell.FromCellRender}/>
                                            <Column dataField="to" Caption="to" visible={this.state.DocumentIssuedEnable} cellRender={GstGridCell.ToCellRender}/>
                                            <Column dataField="totnum" caption="Totall Number" visible={this.state.DocumentIssuedEnable} cellRender={GstGridCell.TotallNumberCellRender}/>
                                            <Column dataField="cancel" Caption="Cancle" visible={this.state.DocumentIssuedEnable} cellRender={GstGridCell.CancleRender}/>
                                            <Column dataField="netIssue" caption="Net Issue" visible={this.state.DocumentIssuedEnable} cellRender={GstGridCell.NetIssueRender}/>
                                        </DataGrid> 
                                     </React.Fragment>
                                </BlockUi> 
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
export default Gstr1Details;
