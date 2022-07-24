import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import BlockUi from 'react-block-ui';
import * as Yup from 'yup';
import 'react-block-ui/style.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, Container } from 'reactstrap';
import Config from '../../../config';
import { AuthenticationService } from '../../../services/AuthenticationService';
import { PaymentReceiptService } from '../../../services/PaymentReceiptService';
import { LocationService } from '../../../services/LocationService';
import { SalesInvoiceService } from '../../../services/SalesInvoiceService';
import { LedgerService } from '../../../services/LedgerService';
import { VoucherSettingService } from '../../../services/VoucherSettingService';
import { CustomSwitch } from '../../../components/CustomSwitch';
import DataGrid, { RequiredRule, Column, Editing, Popup, Paging, Lookup, Form as FormDG } from 'devextreme-react/data-grid';
import { Item } from 'devextreme-react/form';
import themes from 'devextreme/ui/themes';
import 'devextreme-react/text-area';
import { string } from 'yup/lib/locale';
import { Button } from 'devextreme-react/button';
import { FcPlus } from 'react-icons/fc';
import { BsXSquareFill } from 'react-icons/bs';
import CreateLedger from '../../ledger/CreateLedger';
// import { DataGrid, Column } from 'devextreme-react/data-grid';

const notesEditorOptions = { height: 100 };
class CreatePaymentReceipt extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Date: '',
            voucherType: '',
            TransactionDetails: '',
            blocking: false,
            billedToLedgerId: { id: 0 },
            transtypeId: 0,
            gstin: '',
            remarks: '',
            isAliasName: false,
            country: 0,
            state: 0,
            pincode: '',
            address: '',
            rateIncludingGst: false,
            allLedgers: [],
            ledgersBalance: [],
            CurrentBalance: 0,
            allmodeData: [],
            particulars: [],
            loadGrid: false,
            show: false,
            bankAccounts: 0,
            particularData: [],
            particularLedgers: [],
            narration: '',
            bankAccountLedgerId: '',
            countryId: '',
            stateId: '',
            disable: 'true',
            isAddressModified: false,
            Tax: 0,
            bankAcountData: [],
            modeOfPayment: [],
            modeOfPaymentId: { id: 0 },
            voucher: [
                { label: 'Payment', value: 'Payment' },
                { label: 'Receipt', value: 'Receipt' }
            ],
            modeId: 0,
            balance: '',

            transactionTypeData: [],
            transactionType: { id: 0 },
            isModalVisible: false,
            invoiceNumber: '',
            showInvoiceNumber: false
        };

        this.onTextChange = this.onTextChange.bind(this);

        this.onDropDownforledgerbalance = this.onDropDownforledgerbalance.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.onDropDown = this.onDropDown.bind(this);
        this.onDropDown2 = this.onDropDown2.bind(this);
        this.getPaymentReceiptSettingType = this.getPaymentReceiptSettingType.bind(this);
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
        LedgerService.getLedgers().then((ledgers) => {
            var rett = [];
            var led = [];
            ledgers.map((ledger) => {
                rett.push({ name: ledger.name, id: ledger.id });
                led.push({ currentBalance: ledger.currentBalance, id: ledger.id });
            });
            this.setState({
                allLedgers: rett,
                ledgersBalance: led
            });
        });
        ////////////////////////////////

        PaymentReceiptService.GetModeOfPayment().then((modeofpayments) => {
            var data = [];
            var modeof = modeofpayments.map((modeofpayment) => {
                data.push(modeofpayment);
                return { label: modeofpayment.name, value: modeofpayment.id };
            });
            this.setState({ modeOfPayment: modeof });
            this.setState({ allmodeData: data });
        });

        // LedgerService.getParticularLedgers().then((ledgers) => {
        //     this.setState({ particularLedgers: ledgers });
        //     var ret = [];
        //     ledgers.map((ledger) => {
        //         ret.push({ name: ledger.name, id: ledger.id });
        //     });
        //     this.setState({ particularData: ret });
        // });

        // LedgerService.getBankAccountLedgers().then((bankAccount) => {
        //     var ret = [];
        //     bankAccount.map((ledger) => {
        //         ret.push({ label: ledger.name, value: ledger.id });
        //     });
        //     this.setState({ bankAcountData: ret });
        // });

        PaymentReceiptService.GetTransactionType().then((transactiontypes) => {
            var trans = [];
            transactiontypes.map((transactiontype) => {
                trans.push({ label: transactiontype.transactionMode, value: transactiontype.id });
            });
            this.setState({ transactionTypeData: trans });
        });
    }

    onTextChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        if (e.target.name == 'pincode' || e.target.name == 'address') {
            this.setState({ isAddressModified: true });
        }
    };

    onDropDown2(value, action) {
        this.setState({ [action.name]: value });
        if (action.name == 'transactionType') {
            //    this.state.transactionTypeData.find((v) => v.id === value);

            this.setState({ transtypeId: value.value });
        }
    }

    onDropDown(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'modeOfPaymentId') {
            let data = this.state.allmodeData.find((v) => v.id === value.value);
            let id = this.state.allmodeData.find((v) => v.id === value.value);
            this.setState({ balance: data.currentBalance });
            this.setState({ modeId: id.id });
        }
        if (action.name === 'voucherType') {
            this.setState({ [action.name]: value.value }, () => {
                this.getPaymentReceiptSettingType();
            });
        }
    }

    onDropDownforledgerbalance(newData, value, currentRowData) {
        newData.Ledger = value;
        let data = this.state.ledgersBalance.find((v) => v.id === value);
        if (data && data.currentBalance) {
            newData.CurrentBalance = data.currentBalance;
        } else {
            newData.CurrentBalance = 0;
        }
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/salesInvoice/SalesInvoice' } };
        this.props.history.push(from);
    }

    onClickChange(e) {
        var id = 1;
        if (e == 'modeOfPaymentId') {
            var page = <CreateLedger id={id} />;
            this.setState({ renderPages: page, isModalVisible: true });
        } else if (e == 'InformationDetails') {
            var page = <CreateLedger id={id} />;
            this.setState({ renderPages: page, isModalVisible: true });
        } else if (e == 'onClose') {
            PaymentReceiptService.GetModeOfPayment().then((modeofpayments) => {
                var data = [];
                var modeof = modeofpayments.map((modeofpayment) => {
                    data.push(modeofpayment);
                    return { label: modeofpayment.name, value: modeofpayment.id };
                });
                this.setState({ modeOfPayment: modeof });
                this.setState({ allmodeData: data });
            });

            LedgerService.getLedgers().then((ledgers) => {
                var rett = [];
                var led = [];
                ledgers.map((ledger) => {
                    rett.push({ name: ledger.name, id: ledger.id });
                    led.push({ currentBalance: ledger.currentBalance, id: ledger.id });
                });
                this.setState({
                    allLedgers: rett,
                    ledgersBalance: led
                });
            });
            this.setState({ isModalVisible: false });
        }
    }

    getPaymentReceiptSettingType() {
        if (this.state.voucherType === 'Payment') {
            VoucherSettingService.paymentVoucherSettingType().then((res) => {
                this.setState({ showInvoiceNumber: !res.isAutomatic });
            });
        }
        if (this.state.voucherType === 'Receipt') {
            VoucherSettingService.receiptVoucherSettingType().then((res) => {
                this.setState({ showInvoiceNumber: !res.isAutomatic });
            });
        }
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Create Payment Receipt</Card.Title>
                                <Button className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Button>
                            </Card.Header>
                        </Card>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                Date: this.state.Date,
                                voucherType: this.state.voucherType,
                                modeOfPaymentId: this.state.modeOfPaymentId.id,
                                transactionType: this.state.transactionType.id,
                                TransactionDetails: this.state.TransactionDetails,
                                particulars: this.state.particulars,
                                particularLedgers: this.state.particularLedgers,
                                narration: this.state.narration,
                                modeId: this.state.modeId,
                                transtypeId: this.state.transtypeId,
                                showInvoiceNumber: this.state.showInvoiceNumber,
                                invoiceNumber: this.state.invoiceNumber
                            }}
                            validationSchema={Yup.object().shape({
                                Date: Yup.date().required('This field is required'),
                                voucherType: Yup.string().required('This field is required'),
                                modeOfPaymentId: Yup.number().min(1, 'This field is required'),
                                transactionType: Yup.number().min(1, 'This field is required'),
                                // transactionType: Yup.object()
                                //     .shape({
                                //         label: Yup.string(),
                                //         value: Yup.string()
                                //     })
                                //     .nullable()
                                //     .required('This field is required'),
                                particulars: Yup.array()
                                    .of(Yup.object().shape({ Particular: Yup.number() }))
                                    .min(1, 'Atleast one particular is required')
                                    .required('Atleast one particular is required'),
                                invoiceNumber: Yup.string().when('showInvoiceNumber', {
                                    is: true,
                                    then: Yup.string().test('len', 'Invoice number is required', (val) => val && val.length > 0)
                                })
                            })}
                            onSubmit={(
                                { Date, voucherType, modeId, transtypeId, TransactionDetails, narration,invoiceNumber },

                                { setStatus, setSubmitting }
                            ) => {
                                setStatus();

                                //change here
                                let particularsDetails = this.state.particulars.map((item) => {
                                    return {
                                        ledgerId: item.Ledger,

                                        amount: item.Amount
                                    };
                                });

                                PaymentReceiptService.CreatePaymentReceipt(
                                    voucherType,
                                    Date,
                                    modeId,
                                    transtypeId,
                                    TransactionDetails,
                                    narration,
                                    particularsDetails,
                                    invoiceNumber
                                ).then(
                                    (response) => {
                                        if (this.state.showhidebackButton == 1) {
                                            setSubmitting(false);
                                            this.setState({ alert: true, show: false });
                                            return;
                                        }
                                        const { from } = this.props.location.state || {
                                            from: { pathname: '/app/paymentReceipt/ViewPaymentReceipt' }
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
                                <BlockUi tag="div" blocking={this.state.blocking}>
                                    <Form>
                                        <Card>
                                            <Card.Header>
                                                <Card.Title as="h5">Payment Information</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="Date"> Date</label>
                                                        <input
                                                            name="Date"
                                                            type="date"
                                                            onChange={this.onTextChange}
                                                            className={'form-control' + (errors.Date && touched.Date ? ' is-invalid' : '')}
                                                        />
                                                        <ErrorMessage name="Date" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="voucherType">Voucher type</label>
                                                        <Select
                                                            name="voucherType"
                                                            options={this.state.voucher}
                                                            onChange={this.onDropDown}
                                                            classNamePrefix="select"
                                                            className={
                                                                'form-control' +
                                                                (errors.voucherType && touched.voucherType ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="voucherType" component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="modeOfPaymentId">Mode Of Payment</label>
                                                        <FcPlus
                                                            style={{ marginLeft: '10px' }}
                                                            size={20}
                                                            onClick={() => this.onClickChange('modeOfPaymentId')}
                                                        />
                                                        <Select
                                                            name="modeOfPaymentId"
                                                            onChange={this.onDropDown}
                                                            options={this.state.modeOfPayment}
                                                            classNamePrefix="select"
                                                            className={
                                                                'form-control' +
                                                                (errors.modeOfPaymentId && touched.modeOfPaymentId ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <RequiredRule />
                                                        <ErrorMessage name="modeOfPaymentId" component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="Currentbalance">Current Balance</label>
                                                        <Field
                                                            name="CurrentBalance"
                                                            type="text"
                                                            value={this.state.balance}
                                                            disabled={true}
                                                            className={
                                                                'form-control' + (errors.gstin && touched.gstin ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="Currentbalance" component="div" className="invalid-feedback" />
                                                    </div>
                                                    {this.state.showInvoiceNumber && (
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="invoiceNumber">Invoice Number</label>
                                                            <Field
                                                                name="invoiceNumber"
                                                                type="text"
                                                                onChange={this.onTextChange}
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
                                            </Card.Body>
                                        </Card>

                                        <>
                                            <Card className={errors.particulars && touched.particulars ? 'invalid-card' : ''}>
                                                <Card.Header>
                                                    <Card.Title as="h5">Information In Details </Card.Title>

                                                    <FcPlus
                                                        style={{ marginLeft: '10px' }}
                                                        size={20}
                                                        onClick={() => this.onClickChange('InformationDetails')}
                                                    />
                                                </Card.Header>
                                                <Card.Body>
                                                    <DataGrid
                                                        dataSource={this.state.particulars}
                                                        remoteOperations={true}
                                                        keyExpr="ID"
                                                        showBorders={true}
                                                    >
                                                        <Paging enabled={false} />
                                                        <Editing mode="popup" allowUpdating={true} allowAdding={true} allowDeleting={true}>
                                                            <Popup title="Paid To/Receive From" showTitle={true} width={700} height={250} />
                                                            <FormDG>
                                                                <Item itemType="group" colCount={2} colSpan={2}>
                                                                    <Item dataField="Ledger" colSpan={2} />
                                                                    <Item dataField="CurrentBalance" colSpan={1} disabled={true} />
                                                                    <Item dataField="Amount" colSpan={1} />
                                                                </Item>
                                                            </FormDG>
                                                        </Editing>

                                                        <Column dataField="Ledger" setCellValue={this.onDropDownforledgerbalance}>
                                                            <Lookup
                                                                dataSource={this.state.allLedgers}
                                                                valueExpr="id"
                                                                displayExpr="name"
                                                            ></Lookup>
                                                            <RequiredRule />
                                                        </Column>
                                                        <Column dataField="CurrentBalance"></Column>
                                                        <Column dataField="Amount" dataType="number">
                                                            <RequiredRule />
                                                        </Column>
                                                    </DataGrid>

                                                    {errors.particulars && touched.particulars && (
                                                        <>
                                                            <div className={'invalid-array'}>Atleast one Ledger is required</div>
                                                        </>
                                                    )}
                                                </Card.Body>
                                            </Card>

                                            <Card>
                                                <Card.Header>
                                                    <Card.Title as="h5">More Info</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="transactionType">Transaction Type</label>
                                                            <Select
                                                                name="transactionType"
                                                                options={this.state.transactionTypeData}
                                                                onChange={this.onDropDown2}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.transactionType && touched.transactionType ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="transactionType"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>

                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="TransactionDetails">Transaction Details</label>
                                                            <Field
                                                                name="TransactionDetails"
                                                                type="text"
                                                                // onChange={this.onDropDown}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.TransactionDetails && touched.TransactionDetails
                                                                        ? ' is-invalid'
                                                                        : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="TransactionDetails"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="narration">Narration</label>
                                                            <Field
                                                                name="narration"
                                                                type="text"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.narration && touched.narration ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage name="narration" component="div" className="invalid-feedback" />
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </>

                                        <div className="form-group ">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                                onClick={this.checkParticular}
                                            >
                                                Create
                                            </button>
                                            {isSubmitting && (
                                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            )}
                                        </div>
                                        {status && <div className={'alert alert-danger'}>{status}</div>}
                                        <p>
                                            <pre>{JSON.stringify(errors, null, 2)}</pre>
                                        </p>
                                        <p>
                                            <pre>{JSON.stringify(values, null, 2)}</pre>
                                        </p>
                                    </Form>
                                </BlockUi>
                            )}
                        />
                        {this.state.alert == true && (
                            <div class="card">
                                <div class="card-header">Ledger</div>
                                <div class="card-body">
                                    <div className="alert alert-success">
                                        <div style={{ color: 'green' }}>
                                            <strong>Success!</strong> Ledger Added Successfully.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {this.state.isModalVisible && (
                            <Modal
                                isOpen={this.state.isModalVisible}
                                size="lg"
                                style={{ maxWidth: '1000px', width: '100%' }}
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
export default CreatePaymentReceipt;
