import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card, Modal, ModalBody } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../../config';
import { FcPlus } from 'react-icons/fc';
import { AuthenticationService } from '../../../services/AuthenticationService';
// import { LocationService } from '../../../services/LocationService';
// import { VehicleService } from '../../../services/VehicleService';
import { LedgerService } from '../../../services/LedgerService';
import { PaymentReceiptService } from '../../../services/PaymentReceiptService';
import { Button } from 'devextreme-react/button';
import { BsXSquareFill } from 'react-icons/bs';
import { DualTransactionService } from '../../../services/DualTransactionService';
import { VoucherSettingService } from '../../../services/VoucherSettingService';
import DataGrid, {
    TotalItem,
    Item,
    Summary,
    RequiredRule,
    Column,
    Editing,
    Popup,
    Paging,
    Lookup,
    Form as FormDG
} from 'devextreme-react/data-grid';

class CreateDualTransaction extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vehicleType: [],
            Ledgers: [],
            GridLedgers: [],
            ReceiptLedgers: [],
            Vehicls: [],
            commision: 0,
            showhidebackButton: 0,
            ledgerHead: [],
            adjustementDeductuon: [],
            paymentReceiptMode: [],
            Type: [
                { label: 'Receipt', value: 1 },
                { label: 'Payment', value: 2 }
            ],
            IsDisable: true,
            labelVaehicleType: '',
            TotalAmount: 0,
            TotalDeduction: 0,
            TotalPayment: 0,
            RemainBlance: 0,
            Date: '',
            VoucharType: '',
            VehicleId: 0,
            PaidToReReceivedBy: 0,
            Narration: '',
            invoiceNumber: '',
            showInvoiceNumber: '',

            newAmount: 0,
            oldAmount: 0
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.savePopupLedgerHeadUpdate = this.savePopupLedgerHeadUpdate.bind(this);
        this.savePopupLedgerHead = this.savePopupLedgerHead.bind(this);
        this.savePopupAdjDeduction = this.savePopupAdjDeduction.bind(this);
        this.savePopupAdjDeductionUpdate = this.savePopupAdjDeductionUpdate.bind(this);
        this.savePopupPayment = this.savePopupPayment.bind(this);
        this.savePopupPaymentUpdate = this.savePopupPaymentUpdate.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
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
        this.setState({ showhidebackButton: this.props.id });

        LedgerService.getLedgers().then((ledgers) => {
            var ret = [];
            ledgers.map((ledger) => {
                ret.push({ label: ledger.name, value: ledger.id });
            });

            this.setState({ Ledgers: ret, GridLedgers: ret });
        });
        PaymentReceiptService.GetModeOfPayment().then((ledgers) => {
            var ledger = [];
            ledgers.map((details) => {
                ledger.push({ label: details.name, value: details.id });
            });
            this.setState({ ReceiptLedgers: ledger });
        });
        // VehicleService.GetVehicles().then((vehicles) => {
        //     var vehicle = [];
        //     vehicles.map((vehicleId) => {
        //         vehicle.push({ label: vehicleId.vehicleNumber, value: vehicleId.id });
        //     });
        //     this.setState({ Vehicls: vehicle });
        // });
    }

    savePopupLedgerHead(e) {
        if (e.changes[0].type == 'insert') {
            var amount = parseFloat(this.state.TotalAmount);
            var newAmount = amount + e.changes[0].data.Amount;
            this.setState({ TotalAmount: newAmount });

            var remain = this.state.TotalDeduction + this.state.TotalPayment;
            this.setState({ RemainBlance: this.state.TotalAmount - remain });
        } else if (e.changes[0].type == 'remove') {
            var deduct = e.changes[0].key.Amount;
            var amount = parseFloat(this.state.TotalAmount);
            var netAmount = amount - deduct;
            this.setState({ TotalAmount: netAmount });

            var remain = this.state.TotalDeduction + this.state.TotalPayment;
            this.setState({ RemainBlance: this.state.TotalAmount - remain });
        }
        if (this.state.TotalDeduction == '0' && this.state.TotalPayment == '0') {
            this.setState({ RemainBlance: 0 });
        }
    }

    savePopupLedgerHeadUpdate(e) {
        var oldData = e.oldData.Amount;
        var newData = e.newData.Amount;
        var amount = parseFloat(this.state.TotalAmount);
        var netAmount = amount - oldData + newData;
        this.setState({ TotalAmount: netAmount });

        var remain = this.state.TotalDeduction + this.state.TotalPayment;
        this.setState({ RemainBlance: this.state.TotalAmount - remain });

        if (this.state.TotalDeduction == 0 && this.state.TotalPayment == 0) {
            this.setState({ RemainBlance: 0 });
        }
    }

    savePopupAdjDeduction(e) {
        if (e.changes[0].type == 'insert') {
            var amount = parseFloat(this.state.TotalDeduction);
            var newAmount = amount + e.changes[0].data.Amount;
            this.setState({ TotalDeduction: newAmount });

            var remain = this.state.TotalDeduction + this.state.TotalPayment;
            this.setState({ RemainBlance: this.state.TotalAmount - remain });
        } else if (e.changes[0].type == 'remove') {
            var deduct = e.changes[0].key.Amount;
            var amount = parseFloat(this.state.TotalDeduction);
            var netAmount = amount - deduct;
            this.setState({ TotalDeduction: netAmount });

            var remain = this.state.TotalDeduction + this.state.TotalPayment;
            this.setState({ RemainBlance: this.state.TotalAmount - remain });
        }
    }

    savePopupAdjDeductionUpdate(e) {
        var oldData = e.oldData.Amount;
        var newData = e.newData.Amount;
        var amount = parseFloat(this.state.TotalDeduction);
        var netAmount = amount - oldData + newData;
        this.setState({ TotalDeduction: netAmount });

        var remain = this.state.TotalDeduction + this.state.TotalPayment;
        this.setState({ RemainBlance: this.state.TotalAmount - remain });
    }

    savePopupPayment(e) {
        if (e.changes[0].type == 'insert') {
            var amount = parseFloat(this.state.TotalPayment);
            var newAmount = amount + e.changes[0].data.Amount;
            this.setState({ TotalPayment: newAmount });

            var remain = this.state.TotalDeduction + this.state.TotalPayment;
            this.setState({ RemainBlance: this.state.TotalAmount - remain });
        } else if (e.changes[0].type == 'remove') {
            var deduct = e.changes[0].key.Amount;
            var amount = parseFloat(this.state.TotalPayment);
            var netAmount = amount - deduct;
            this.setState({ TotalPayment: netAmount });

            var remain = this.state.TotalDeduction + this.state.TotalPayment;
            this.setState({ RemainBlance: this.state.TotalAmount - remain });
        }
    }

    savePopupPaymentUpdate(e) {
        var oldData = e.oldData.Amount;
        var newData = e.newData.Amount;
        var amount = parseFloat(this.state.TotalPayment);
        var netAmount = amount - oldData + newData;
        this.setState({ TotalPayment: netAmount });

        var remain = this.state.TotalDeduction + this.state.TotalPayment;
        this.setState({ RemainBlance: this.state.TotalAmount - remain });
    }

    onTextChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/dualTansaction/DualTransaction' } };
        this.props.history.push(from);
    }

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'VoucharType') {
            this.setState({ [action.name]: value.label });
        }
        if (value.label == 'Receipt') {
            this.setState({ labelVaehicleType: 'Received By' });
        } else if (value.label == 'Payment') {
            this.setState({ labelVaehicleType: 'Paid To' });
        }

        if (action.name == 'VoucharType') {
            if (value.label == 'Payment') {
                VoucherSettingService.dualTransactionPaymentSettingType().then((res) => {
                    this.setState({ showInvoiceNumber: !res.isAutomatic });
                });
            }
            if (value.label == 'Receipt') {
                VoucherSettingService.dualTransactionReceiptSettingType().then((res) => {
                    this.setState({ showInvoiceNumber: !res.isAutomatic });
                });
            }
        }
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Create Dual Transaction</Card.Title>
                                {this.state.showhidebackButton == undefined && (
                                    <Button className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Button>
                                )}
                            </Card.Header>
                        </Card>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                Date: this.state.Date,
                                VoucharType: this.state.VoucharType,
                                PaidToReReceivedBy: this.state.PaidToReReceivedBy,
                                Narration: this.state.Narration,
                                invoiceNumber: this.state.invoiceNumber,
                                adjustementDeductuon: this.state.adjustementDeductuon,
                                ledgerHead: this.state.ledgerHead,
                                paymentReceiptMode: this.state.paymentReceiptMode
                            }}
                            validationSchema={Yup.object().shape({
                                Date: Yup.string().required('This field is required'),
                                VoucharType: Yup.string().required('This field is required'),
                                VehicleId: Yup.number().min(1, 'This field is required'),
                                PaidToReReceivedBy: Yup.number().min(1, 'This field is required'),
                                Narration: Yup.string().required('This field is required'),
                                invoiceNumber: Yup.string().when('showInvoiceNumber', {
                                    is: true,
                                    then: Yup.string().test('len', 'Voucher Number is required', (val) => val && val.length > 0)
                                })
                            })}
                            onSubmit={(
                                {
                                    Date,
                                    VoucharType,
                                    invoiceNumber,
                                    Narration,
                                    PaidToReReceivedBy,
                                    ledgerHead,
                                    adjustementDeductuon,
                                    paymentReceiptMode
                                },

                                { setStatus, setSubmitting }
                            ) => {
                                setStatus();

                                var ledgers = [];
                                ledgerHead.map((x) => {
                                    var Data = {
                                        ledgerId: x.Ledger,
                                        amount: x.Amount
                                    };
                                    ledgers.push(Data);
                                });
                                var deduction = [];
                                adjustementDeductuon.map((x) => {
                                    var Data = {
                                        ledgerId: x.Ledger,
                                        amount: x.Amount
                                    };
                                    deduction.push(Data);
                                });
                                var receipt = [];
                                paymentReceiptMode.map((x) => {
                                    var Data = {
                                        ledgerId: x.Ledger,
                                        amount: x.Amount
                                    };
                                    receipt.push(Data);
                                });
                                DualTransactionService.AddDualTransaction(
                                    Date,
                                    VoucharType,
                                    invoiceNumber,
                                    Narration,
                                    PaidToReReceivedBy,
                                    ledgers,
                                    deduction,
                                    receipt
                                ).then(
                                    (response) => {
                                        if (this.state.showhidebackButton == 1) {
                                            setSubmitting(false);
                                            this.setState({ alert: true, show: false });
                                            return;
                                        }
                                        const { from } = this.props.location.state || {
                                            from: { pathname: '/app/dualTransaction/DualTransaction' }
                                        };
                                        this.props.history.push(from);
                                    },
                                    (error) => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                            }}
                            render={({ values, errors, status, touched, isSubmitting }) => (
                                <Form>
                                    <Card className="col-sm-12">
                                        <Card.Header>
                                            <h5>Vechical Information</h5>
                                        </Card.Header>

                                        <Card.Body>
                                            {/* LEFT--------- */}
                                            <div className="form-group col-sm-6 float-sm-left">
                                                <div className="row form-group col-sm-12">
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="Date">Date</label>
                                                        <input
                                                            name="Date"
                                                            type="date"
                                                            onChange={this.onTextChange}
                                                            value={this.state.Date}
                                                            disabled={this.state.DateDisabled}
                                                            className={'form-control' + (errors.Date && touched.Date ? ' is-invalid' : '')}
                                                        />
                                                    </div>
                                                    <div className="form-group col-sm-6">
                                                        <label htmlFor="VoucharType">Vouchar Type</label>
                                                        <Select
                                                            name="VoucharType"
                                                            onChange={this.onDropDownChange}
                                                            options={this.state.Type}
                                                            // value={this.state.partyName}
                                                            classNamePrefix="select"
                                                            placeholder="Select Payment Receipt"
                                                            className={
                                                                'form-control' +
                                                                (errors.VoucharType && touched.VoucharType ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="VoucharType" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>

                                                <div className="form-group col-sm-12">
                                                    <b>
                                                        <label htmlFor="PaidToReReceivedBy">{this.state.labelVaehicleType}</label>
                                                    </b>

                                                    {/* <FcPlus
                                                        style={{ marginLeft: '10px' }}
                                                        size={20}
                                                        onClick={() => this.onClickChange('PartyNameId')}
                                                    /> */}
                                                    <Select
                                                        name="PaidToReReceivedBy"
                                                        onChange={this.onDropDownChange}
                                                        options={this.state.Ledgers}
                                                        value={this.state.partyName}
                                                        classNamePrefix="select"
                                                        placeholder="Ledgers"
                                                        className={
                                                            'form-control' +
                                                            (errors.PaidToReReceivedBy && touched.PaidToReReceivedBy ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="PaidToReReceivedBy" component="div" className="invalid-feedback" />
                                                </div>

                                                <div className="form-group col-md-12">
                                                    <h5>LEDGER HEAD</h5>
                                                    <DataGrid
                                                        dataSource={this.state.ledgerHead}
                                                        remoteOperations={true}
                                                        showBorders={true}
                                                        onSaved={this.savePopupLedgerHead}
                                                        onRowUpdating={this.savePopupLedgerHeadUpdate}
                                                    >
                                                        <Paging enabled={false} />
                                                        <Editing
                                                            mode="popup"
                                                            allowUpdating={!this.state.isDisable}
                                                            allowAdding={!this.state.isDisable}
                                                            allowDeleting={!this.state.isDisable}
                                                        >
                                                            <Popup title="LedgerHead" showTitle={true} width={600} height={300} />
                                                            <FormDG>
                                                                <Item itemType="group" colCount={2} colSpan={2}>
                                                                    <Item dataField="Ledger" colSpan={2} />
                                                                    <Item dataField="Amount" colSpan={2} />
                                                                </Item>
                                                            </FormDG>
                                                        </Editing>
                                                        <Column dataField="ID" visible={false}></Column>
                                                        <Column dataField="Ledger">
                                                            <Lookup
                                                                dataSource={this.state.GridLedgers}
                                                                valueExpr="value"
                                                                displayExpr="label"
                                                            ></Lookup>
                                                            <RequiredRule />
                                                        </Column>
                                                        <Column dataField="Amount" dataType="number" />

                                                        {/* setCellValue={this.calculateAmount} */}
                                                        {/* <Summary >
                                                            <TotalItem showInColumn="Ledger" alignment="left" customizeText={this.Total} />
                                                            <TotalItem
                                                                showInColumn="Amount"
                                                                alignment="right"
                                                                customizeText={this.tAmount}
                                                            />
                                                        </Summary> */}
                                                    </DataGrid>
                                                </div>
                                            </div>

                                            {/* RIGHT----------- */}
                                            <div className="form-group col-sm-6 float-sm-right">
                                                <div className="row">
                                                    {/* <div className=" form-group col-sm-12">
                                                        <label htmlFor="VehicleId">Vehicle Number</label>
                                                        <Select
                                                            name="VehicleId"
                                                            onChange={this.onDropDownChange}
                                                            options={this.state.Vehicls}
                                                            // value={this.state.partyName}
                                                            classNamePrefix="select"
                                                            placeholder="Vehicle No"
                                                            className={
                                                                'form-control' +
                                                                (errors.VehicleId && touched.VehicleId ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="VehicleId" component="div" className="invalid-feedback" />
                                                    </div> */}
                                                    {this.state.showInvoiceNumber && (
                                                        <div className=" form-group col-sm-12">
                                                            <label htmlFor="invoiceNumber">Voucher Number</label>

                                                            <Field
                                                                name="invoiceNumber"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                value={this.state.ItemName}
                                                                placeholder="Voucher Number"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.invoiceNumber && touched.invoiceNumber ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="invoiceNumber"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className=" form-group col-sm-12">
                                                    <label htmlFor="ItemName">Amount</label>

                                                    <Field
                                                        name="vehicleNo"
                                                        type="text"
                                                        // onChange={this.onTextChange}
                                                        value={this.state.TotalAmount}
                                                        disabled={this.state.IsDisable}
                                                        className={
                                                            'form-control' + (errors.ItemName && touched.ItemName ? ' is-invalid' : '')
                                                        }
                                                    />
                                                </div>

                                                <div className="form-group col-md-12">
                                                    <h5>ADJUSTMENTS / DEDUCTIONS</h5>
                                                    <DataGrid
                                                        dataSource={this.state.adjustementDeductuon}
                                                        // remoteOperations={true}
                                                        showBorders={true}
                                                        onSaved={this.savePopupAdjDeduction}
                                                        onRowUpdating={this.savePopupAdjDeductionUpdate}
                                                    >
                                                        <Paging enabled={false} />
                                                        <Editing
                                                            mode="popup"
                                                            allowUpdating={!this.state.isDisable}
                                                            allowAdding={!this.state.isDisable}
                                                            allowDeleting={!this.state.isDisable}
                                                        >
                                                            <Popup
                                                                title="ADJUSTMENTS/DEDUCTIONS"
                                                                showTitle={true}
                                                                width={600}
                                                                height={300}
                                                            />
                                                            <FormDG>
                                                                <Item itemType="group" colCount={2} colSpan={2}>
                                                                    <Item dataField="Ledger" colSpan={2} />
                                                                    <Item dataField="Amount" colSpan={2} />
                                                                </Item>
                                                            </FormDG>
                                                        </Editing>
                                                        <Column dataField="ID" visible={false}></Column>
                                                        <Column dataField="Ledger">
                                                            <Lookup
                                                                dataSource={this.state.GridLedgers}
                                                                valueExpr="value"
                                                                displayExpr="label"
                                                            ></Lookup>
                                                            <RequiredRule />
                                                        </Column>
                                                        <Column dataField="Amount" dataType="number" />
                                                        {/* setCellValue={this.deductionAmount} */}
                                                        {/* <Summary>
                                                            <TotalItem
                                                                showInColumn="Ledger"
                                                                alignment="left"
                                                                customizeText={this.TotalAdjustments}
                                                            />
                                                            <TotalItem
                                                                showInColumn="Amount"
                                                                alignment="right"
                                                                customizeText={this.TotalAdjustmentsAmount}
                                                            />
                                                        </Summary> */}
                                                    </DataGrid>
                                                </div>

                                                <div className="form-group col-md-12">
                                                    <h5>PAYMENT / RECEIPT MODE</h5>
                                                    <DataGrid
                                                        dataSource={this.state.paymentReceiptMode}
                                                        remoteOperations={true}
                                                        showBorders={true}
                                                        onSaved={this.savePopupPayment}
                                                        onRowUpdating={this.savePopupPaymentUpdate}
                                                    >
                                                        <Paging enabled={false} />
                                                        <Editing
                                                            mode="popup"
                                                            allowUpdating={!this.state.isDisable}
                                                            allowAdding={!this.state.isDisable}
                                                            allowDeleting={!this.state.isDisable}
                                                        >
                                                            <Popup title="PAYMENT/RECEIPT MODE" showTitle={true} width={600} height={300} />
                                                            <FormDG>
                                                                <Item itemType="group" colCount={2} colSpan={2}>
                                                                    <Item dataField="Ledger" colSpan={2} />
                                                                    <Item dataField="Amount" colSpan={2} />
                                                                </Item>
                                                            </FormDG>
                                                        </Editing>
                                                        <Column dataField="Ledger">
                                                            <Lookup
                                                                dataSource={this.state.ReceiptLedgers}
                                                                valueExpr="value"
                                                                displayExpr="label"
                                                            ></Lookup>
                                                            <RequiredRule />
                                                        </Column>

                                                        <Column dataField="Amount" dataType="number" />
                                                        {/* setCellValue={this.paymentReceiptAmount} */}
                                                        {/* <Summary>
                                                            <TotalItem
                                                                showInColumn="Ledger"
                                                                alignment="left"
                                                                customizeText={this.TotalPaymentMade}
                                                            />
                                                            <TotalItem showInColumn="Ledger" alignment="left" customizeText={this.NetDue} />

                                                            <TotalItem
                                                                showInColumn="Amount"
                                                                alignment="right"
                                                                customizeText={this.TotalPaymentMadeAmount}
                                                            />
                                                            <TotalItem
                                                                showInColumn="Amount"
                                                                alignment="right"
                                                                customizeText={this.NetDueAmount}
                                                            />
                                                        </Summary> */}
                                                    </DataGrid>
                                                </div>
                                                <div className=" form-group col-sm-12">
                                                    <label htmlFor="ItemName">Net Due on this transactions</label>

                                                    <Field
                                                        name="vehicleNo"
                                                        type="text"
                                                        // onChange={this.onTextChange}
                                                        value={this.state.RemainBlance}
                                                        disabled={this.state.IsDisable}
                                                        className={
                                                            'form-control' + (errors.ItemName && touched.ItemName ? ' is-invalid' : '')
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group col-sm-12 float-sm-left">
                                                <div className=" form-group col-sm-12">
                                                    <label htmlFor="Narration">Narration</label>

                                                    <Field
                                                        name="Narration"
                                                        type="text"
                                                        onChange={this.onTextChange}
                                                        value={this.state.ItemName}
                                                        disabled={this.state.IsDisable && this.state.IfEdit}
                                                        className={
                                                            'form-control' + (errors.Narration && touched.Narration ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="Narration" component="div" className="invalid-feedback" />
                                                </div>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    <div className="form-group  text-center">
                                        <button type="submit" className="btn btn-primary center" disabled={isSubmitting}>
                                            Create Dual Tansaction
                                        </button>
                                        {isSubmitting && (
                                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                        )}
                                    </div>
                                    {status && <div className={'alert alert-danger'}>{status}</div>}
                                    {/* <p>
                                    <pre>{JSON.stringify(values, null, 2)}</pre>
                                </p> */}
                                </Form>
                            )}
                        />
                        {this.state.alert == true && (
                            <div class="card">
                                <div class="card-header">Vechical Type</div>
                                <div class="card-body">
                                    <div className="alert alert-success">
                                        <div style={{ color: 'green' }}>
                                            <strong>Success!</strong> Vehicle Type Added Successfully.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {this.state.isModalVisible && (
                            <Modal
                                isOpen={this.state.isModalVisible}
                                size="lg"
                                // style={{  width: '100%' }}
                                backdrop="static"
                            >
                                <div className="ModelHeader">
                                    {' '}
                                    <div style={{ textAlign: 'right', marginRight: '2px', marginTop: '3px' }}>
                                        <BsXSquareFill color="red" size={30} onClick={() => this.onClickChange('onClose')} />
                                    </div>
                                </div>
                                <ModalBody>{this.state.renderPages}</ModalBody>
                            </Modal>
                        )}
                    </Col>
                </Row>
            </>
        );
    }
}
export default CreateDualTransaction;
