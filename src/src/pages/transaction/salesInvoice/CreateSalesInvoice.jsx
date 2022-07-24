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
import { BsXSquareFill } from 'react-icons/bs';
import { FcPlus } from 'react-icons/fc';
import CreateLedger from '../../ledger/CreateLedger';
// import { DataGrid, Column } from 'devextreme-react/data-grid';

const notesEditorOptions = { height: 100 };
class CreateSalesInvoice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            blocking: false,
            showOption: false,
            isInvoiceNumberAuto: false,
            invoiceDate: '',
            invoiceNumber: '',
            billedToLedgerId: { id: 0 },
            gstin: '',
            remarks: '',
            isAliasName: false,
            country: 0,
            state: 0,
            pincode: '',
            address: '',
            rateIncludingGst: false,
            allLedgers: [],
            particulars: [],
            loadGrid: false,
            show: false,
            bankAccounts: 0,
            particularData: [],
            particularLedgers: [],
            Narration: [],
            bankAccountLedgerId: '',
            countryId: '',
            stateId: '',
            disable: 'true',
            isAddressModified: false,
            Tax: 0,
            bankAcountData: [],
            isModalVisible: false,
            renderPages: null
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        // this.OnRowChanged = this.OnRowChanged.bind(this);
        this.setCellValue = this.setCellValue.bind(this);
        this.taxableAmountCalculate = this.taxableAmountCalculate.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.onClickChange=this.onClickChange.bind(this);
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
        this.setState({ isAddressModified: false });

        VoucherSettingService.salesInvoiceSettingType().then((setting) => {
            this.setState({ isInvoiceNumberAuto: setting.isAutomatic });
        });

        LocationService.getCountry().then((countries) => {
            var ret = [];
            countries.map((country) => {
                ret.push({ label: country.countryName, value: { label: country.countryName, value: country.id } });
            });

            this.setState({ countries: ret });
        });

        LedgerService.getLedgers().then((ledgers) => {
            var ret = [];
            ledgers.map((ledger) => {
                ret.push({ label: ledger.name, value: ledger });
            });
            this.setState({ allLedgers: ret });
        });

        LedgerService.getParticularLedgers().then((ledgers) => {
            this.setState({ particularLedgers: ledgers });
            var ret = [];

            ledgers.map((ledger) => {
                ret.push({ name: ledger.name, id: ledger.id });
            });
            this.setState({ particularData: ret });

        });

        LedgerService.getBankAccountLedgers().then((bankAccount) => {
            var ret = [];
            bankAccount.map((ledger) => {
                ret.push({ label: ledger.name, value: ledger.id });
            });
            this.setState({ bankAcountData: ret });
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

    onCheckBoxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    };

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'billedToLedgerId') {
            this.setState({ blocking: !this.state.blocking });
            LocationService.getCountry().then((countries) => {
                this.setState({
                    blocking: false,
                    address: !!value.value.address ? value.value.address.address : '',
                    pincode: value.value.address ? value.value.address.pincode : '',
                    state: value.value.address && { label: value.value.address.state, value: value.value.address.stateId },
                    country: value.value.address && { label: value.value.address.country, value: value.value.address.countryId },
                    stateId: value.value.address && value.value.address.stateId,
                    countryId: value.value.address && value.value.address.countryId,
                    gstin: value.value.gstin
                });
            });
        }

        if (action.name == 'country') {
            //call getstates api.
            LocationService.getStates(value.value.value).then((x) => {
                var ret = [];
                x.map((state) => {
                    ret.push({ label: state.stateName, value: { label: state.stateName, value: state.id } });
                });
                this.setState({
                    countryId: value.value.value,
                    isAddressModified: true,
                    states: ret,
                    state: 0
                });
            });
        }

        if (action.name == 'state') {
            this.setState({
                stateId: value.value.value,
                isAddressModified: true
            });
        }
    }

    setCellValue(newData, value, currentRowData) {
        newData.Particular = value;
        let data = this.state.particularLedgers.find((v) => v.id === value);
        if (data.isQuantityApplicable == true) {
            this.setState({ disable: null });
        } else {
            this.setState({ disable: 'true' });
        }
        if (data.tax && data.tax.taxPercentage) {
            this.setState({ Tax: data.tax.taxPercentage });
        } else {
            this.setState({ Tax: 0 });
        }
    }

    taxableAmountCalculate(newData, value, currentRowData) {
        let taxableAmount = parseInt(value);
        let tax = this.state.Tax;
        let particularTax = (taxableAmount * tax) / 100;
        newData.Tax = particularTax;
        let amount = particularTax + taxableAmount;
        newData.Amount = amount;
        newData.TaxableAmount = value;
    }

    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/salesInvoice/SalesInvoice' } };
        this.props.history.push(from);
    }

    onClickChange(e) {
        var id = 1;
        if (e == 'billedToLedgerId') {
            var page = <CreateLedger id={id} />;
            this.setState({ renderPages: page, isModalVisible: true });
        }
        else if (e == 'onClose') {
            LedgerService.getParticularLedgers().then((ledgers) => {
                this.setState({ particularLedgers: ledgers });
                var ret = [];

                ledgers.map((ledger) => {
                    ret.push({ name: ledger.name, id: ledger.id });
                });
                this.setState({ particularData: ret });

            });
            LedgerService.getBankAccountLedgers().then((bankAccount) => {
                var ret = [];
                bankAccount.map((ledger) => {
                    ret.push({ label: ledger.name, value: ledger.id });
                });
                this.setState({ bankAcountData: ret });
            });
            LedgerService.getLedgers().then((ledgers) => {
                var ret = [];
                ledgers.map((ledger) => {
                    ret.push({ label: ledger.name, value: ledger });
                });
                this.setState({ allLedgers: ret });
            });
            this.setState({ isModalVisible: false });
        }
    }
    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h4">Create Sales Invoice</Card.Title>
                                <Button className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Button>
                            </Card.Header>
                        </Card>

                        <Formik
                            enableReinitialize
                            initialValues={{
                                invoiceDate: this.state.invoiceDate,
                                isInvoiceNumberAuto: this.state.isInvoiceNumberAuto,
                                invoiceNumber: this.state.invoiceNumber,
                                billedToLedgerId: this.state.billedToLedgerId.id,
                                gstin: this.state.gstin,
                                remarks: this.state.remarks,
                                isAliasName: this.state.isAliasName,
                                country: this.state.country,
                                state: this.state.state,
                                pincode: this.state.pincode,
                                address: this.state.address,
                                rateIncludingGst: this.state.rateIncludingGst,
                                particulars: this.state.particulars,
                                particularLedgers: this.state.particularLedgers,
                                bankAccounts: this.state.bankAccounts,
                                countryId: this.state.countryId,
                                stateId: this.state.stateId,
                                bankAccountLedgerId: this.state.bankAccountLedgerId,
                                isAddressModified: this.state.isAddressModified
                            }}
                            validationSchema={Yup.object().shape({
                                invoiceDate: Yup.date().required('This field is required'),
                                invoiceNumber: Yup.string().when('isInvoiceNumberAuto', {
                                    is: false,
                                    then: Yup.string().required('This field is required')
                                }),
                                billedToLedgerId: Yup.number().min(1, 'This field is required'),
                                address: Yup.string().required('This field is required'),
                                country: Yup.object()
                                    .shape({
                                        label: Yup.string(),
                                        value: Yup.string()
                                    })
                                    .nullable()
                                    .required('This field is required'),
                                state: Yup.object()
                                    .shape({
                                        label: Yup.string(),
                                        value: Yup.string()
                                    })
                                    .nullable()
                                    .required('This field is required'),
                                pincode: Yup.string().required('This field is required'),
                                particulars: Yup.array()
                                    .of(Yup.object().shape({ Particular: Yup.number() }))
                                    .min(1, 'Atleast one particular is required')
                                    .required('Atleast one particular is required'),
                                bankAccounts: Yup.number().min(1, 'This field is required')
                            })}
                            onSubmit={(
                                {
                                    isAliasName,
                                    invoiceDate,
                                    invoiceNumber,
                                    remarks,
                                    gstin,
                                    isAddressModified,
                                    address,
                                    countryId,
                                    stateId,
                                    pincode,
                                    billedToLedgerId,
                                    bankAccounts
                                },
                                { setStatus, setSubmitting }
                            ) => {
                                setStatus();
                                let bankData = [
                                    {
                                        bankAccountLedgerId: bankAccounts
                                    }
                                ];

                                let particularsDetails = this.state.particulars.map((item) => {
                                    return {
                                        ledgerId: item.Particular,
                                        amount: item.TaxableAmount,
                                        unit: item.Unit,
                                        quantity: item.Quantity,
                                        narration: item.Narration
                                    };
                                });

                                SalesInvoiceService.CreateSalesInvoice(
                                    isAliasName,
                                    invoiceDate,
                                    invoiceNumber,
                                    remarks,
                                    gstin,
                                    isAddressModified,
                                    address,
                                    countryId,
                                    stateId,
                                    pincode,
                                    billedToLedgerId,
                                    particularsDetails,
                                    bankData
                                ).then(
                                    (response) => {
                                        const { from } = this.props.location.state || { from: { pathname: '/app/salesInvoice/SalesInvoice' } };
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
                                                <Card.Title as="h5">Sales Information</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="form-row">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="invoiceDate">Invoice Date</label>
                                                        <input
                                                            name="invoiceDate"
                                                            type="date"
                                                            onChange={this.onTextChange}
                                                            className={
                                                                'form-control' +
                                                                (errors.invoiceDate && touched.invoiceDate ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="invoiceDate" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="billedToLedgerId">Billed to</label>
                                                        <FcPlus
                                                            style={{ marginLeft: '10px' }}
                                                            size={20}
                                                            onClick={() => this.onClickChange('billedToLedgerId')}
                                                        />
                                                        <Select
                                                            name="billedToLedgerId"
                                                            onChange={this.onDropDownChange}
                                                            options={this.state.allLedgers}
                                                            classNamePrefix="select"
                                                            className={
                                                                'form-control' +
                                                                (errors.billedToLedgerId && touched.billedToLedgerId ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            name="billedToLedgerId"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="gstin">GSTIN</label>
                                                        <Field
                                                            name="gstin"
                                                            type="text"
                                                            disabled={true}
                                                            value={this.state.gstin}
                                                            className={
                                                                'form-control' + (errors.gstin && touched.gstin ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="gstin" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="remarks">Remarks</label>
                                                        <Field
                                                            name="remarks"
                                                            type="text"
                                                            onChange={this.onTextChange}
                                                            className={
                                                                'form-control' + (errors.remarks && touched.remarks ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="remarks" component="div" className="invalid-feedback" />
                                                    </div>
                                                    {!this.state.isInvoiceNumberAuto && (
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
                                                            <ErrorMessage name="remarks" component="div" className="invalid-feedback" />
                                                        </div>
                                                    )}
                                                    <div className="form-group col-md-12">
                                                        <CustomSwitch
                                                            checked={this.state.isAliasName}
                                                            name="isAliasName"
                                                            id="isAliasName"
                                                            onChange={this.onCheckBoxChange}
                                                            text="Is Alias Name"
                                                        />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>

                                        {this.state.billedToLedgerId && this.state.billedToLedgerId.id > 0 && (
                                            <>
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Address Information</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="address">Address</label>
                                                                <Field
                                                                    name="address"
                                                                    type="text"
                                                                    value={this.state.address}
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.address && touched.address ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                                            </div>

                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="country">Country</label>
                                                                <Select
                                                                    name="country"
                                                                    value={this.state.country}
                                                                    onChange={this.onDropDownChange}
                                                                    options={this.state.countries}
                                                                    classNamePrefix="select"
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.country && touched.country ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                                            </div>

                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="state">State</label>
                                                                <Select
                                                                    name="state"
                                                                    value={this.state.state}
                                                                    onChange={this.onDropDownChange}
                                                                    options={this.state.states}
                                                                    classNamePrefix="select"
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.state && touched.state ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                                            </div>

                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="pincode">Pincode</label>
                                                                <Field
                                                                    name="pincode"
                                                                    type="text"
                                                                    value={this.state.pincode}
                                                                    disabled={false}
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.pincode && touched.pincode ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="pincode" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>

                                                <Card className={errors.particulars && touched.particulars ? 'invalid-card' : ''}>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Rate setting</Card.Title>

                                                        <FcPlus
                                                                style={{ marginLeft: '10px' }}
                                                                size={20}
                                                                onClick={() => this.onClickChange('billedToLedgerId')}
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
                                                            <Editing
                                                                mode="popup"
                                                                allowUpdating={true}
                                                                allowAdding={true}
                                                                allowDeleting={true}
                                                            >
                                                                <Popup title="Particular Data" showTitle={true} width={700} height={525} />
                                                                <FormDG>
                                                                    <Item itemType="group" colCount={2} colSpan={2}>
                                                                        <Item dataField="Particular" colSpan={2} />
                                                                        <Item dataField="Quantity" disabled={this.state.disable} />
                                                                        <Item dataField="Unit" disabled={this.state.disable} />
                                                                        <Item dataField="TaxableAmount" />
                                                                        <Item dataField="Tax" disabled="true" />
                                                                        <Item dataField="Amount" colSpan={2} />
                                                                        <Item dataField="Narration" name="Narration" colSpan={2} />
                                                                    </Item>
                                                                </FormDG>
                                                            </Editing>
                                                            <Column dataField="Particular" setCellValue={this.setCellValue}>
                                                                <Lookup
                                                                    dataSource={this.state.particularData}
                                                                    valueExpr="id"
                                                                    displayExpr="name"
                                                                ></Lookup>
                                                                <RequiredRule />
                                                            </Column>
                                                            <Column dataField="Quantity" dataType="number" />
                                                            <Column dataField="Unit"></Column>
                                                            <Column dataField="Narration"></Column>
                                                            <Column
                                                                dataField="TaxableAmount"

                                                                setCellValue={this.taxableAmountCalculate}
                                                            >
                                                                <RequiredRule />
                                                            </Column>
                                                            <Column dataField="Tax" visible={false} />
                                                            <Column dataField="Amount" dataType="number">
                                                                <RequiredRule />
                                                            </Column>
                                                        </DataGrid>

                                                        {errors.particulars && touched.particulars && (
                                                            <>
                                                                <div className={'invalid-array'}>Atleast one particular is required</div>
                                                            </>
                                                        )}
                                                    </Card.Body>
                                                </Card>

                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Bank Details</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="bankAccounts">Bank Account</label>
                                                                <FcPlus
                                                                    style={{ marginLeft: '10px' }}
                                                                    size={20}
                                                                    onClick={() => this.onClickChange('billedToLedgerId')}
                                                                />

                                                            <Select
                                                                name="bankAccounts"
                                                                options={this.state.bankAcountData}
                                                                onChange={this.onDropDownChange}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.bankAccounts && touched.bankAccounts ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="bankAccounts"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            </>
                                        )}

                                        <div className="form-group ">
                                            <button
                                                type="submit"
                                                className="btn btn-primary"
                                                disabled={isSubmitting}
                                                onClick={this.checkParticular}
                                            >
                                                Create SalesInvoice
                                            </button>
                                            {isSubmitting && (
                                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            )}
                                        </div>
                                        {status && <div className={'alert alert-danger'}>{status}</div>}
                                        {/*<p>
                                            <pre>{JSON.stringify(errors, null, 2)}</pre>
                                        </p>
                                        <p>
                                            <pre>{JSON.stringify(values, null, 2)}</pre>
                                         </p> */}
                                    </Form>
                                </BlockUi>
                            )}
                        />

                        {this.state.isModalVisible && (
                            <Modal isOpen={this.state.isModalVisible} size="lg" style={{ maxWidth: '1000px', width: '100%' }} backdrop="static">
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
export default CreateSalesInvoice;
