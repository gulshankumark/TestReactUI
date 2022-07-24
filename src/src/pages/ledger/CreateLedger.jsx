import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import BlockUi from 'react-block-ui';
import * as Yup from 'yup';
import 'react-block-ui/style.css';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { CompanyService } from '../../services/CompanyService';
import { LocationService } from '../../services/LocationService';
import { LedgerService } from '../../services/LedgerService';
import { GroupsService } from '../../services/GroupsService';
import { CustomSwitch } from '../../components/CustomSwitch';
import { Button } from 'devextreme-react/button';
import { FcPlus } from 'react-icons/fc';
import { BsXSquareFill } from 'react-icons/bs';
import CreateAccountGroup from '../groups/CreateAccountGroup';
import { Modal, ModalHeader, ModalBody, ModalFooter, Container } from 'reactstrap';

class CreateLedger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            blocking: false,
            //Basic Details
            name: '',
            aliasName: '',
            groupId: 0,
            //Bill Wise
            isBillWiseApplicable: false,
            //Address
            address: '',
            state: 0, //{ "label": '', "value": 0 },
            country: 0, //{ "label": '', "value": 0 },
            pincode: '',
            //Pan
            pan: '',
            gstNumber: '',
            nop: 0,
            //Payment Receipt Active
            isPaymentReceipt: false,
            //Gst
            isGstApplicable: false,
            gstRate: 0,
            sacCode: '',
            isReverseChargeApplicable: false,
            //Quantity applicable
            isQuantityApplicable: false,
            //TDS
            isTdsApplicable: false,
            isTcsApplicable: false,
            //Contact Details
            contactPerson: '',
            designation: '',
            mobileNumber: '',
            phoneNumber: '',
            whatsappNumber: '',
            email: '',
            //Bank Details
            bankAccountNumber: '',
            bankAccountType: 0,
            ifsc: '',
            micr: '',
            bankName: '',
            bankBranch: '',
            //Balance Details
            openingBalance: 0,
            debitCredit: 0,
            effectiveFrom: '',
            showhidebackButton: 0,
            activeSections: {
                //sectionsActive
                isBillWiseActive: false,
                isAddressActive: false,
                panSectionActive: false,
                paymentOrReceiptModeActive: false,
                gstDetailsActive: false,
                quantityApplicableActive: false,
                tdsDetailsActive: false,
                contactDetailsActive: false,
                bankDetailsActive: false,
                paymentOrReceiptModeDefaultActiveReadonly: false
            },
            IsMOdelPopUp: false,
            groups: [],
            natureOfPersons: [],
            gstRates: [],
            balanceTypes: [],
            accountTypes: [],
            countries: [],
            states: [],
            alert: false,
            show: true,
            isModalVisible: false
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
        this.onClickChange = this.onClickChange.bind(this);
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
       
        GroupsService.getAccountGroups().then((groups) => {
            var ret = [];
            groups.map((group) => {
                ret.push({ label: group.name, value: group.id });
            });

            this.setState({ groups: ret });
        });

        // CompanyService.getCompanyPan().then(x => {
        //     this.setState({ pan: x });
        // })

        LedgerService.getNatureOfPersonEntities().then((entities) => {
            var ret = [];
            entities.map((entity) => {
                ret.push({ label: entity.name, value: entity.id });
            });

            this.setState({ natureOfPersons: ret });
        });

        LedgerService.getGstRates().then((entities) => {
            var ret = [];
            entities.map((entity) => {
                ret.push({ label: entity.rate, value: entity.id });
            });

            this.setState({ gstRates: ret });
        });

        LedgerService.getBalanceTypes().then((entities) => {
            var ret = [];

            entities.map((entity) => {
                ret.push({ label: entity.name, value: entity.id });
            });

            this.setState({ balanceTypes: ret });
        });

        LedgerService.getAccountTypes().then((entities) => {
            var ret = [];
            entities.map((entity) => {
                ret.push({ label: entity.name, value: entity.id });
            });

            this.setState({ accountTypes: ret });
        });

        LocationService.getCountry().then((countries) => {
            var ret = [];
            countries.map((country) => {
                ret.push({ label: country.countryName, value: country.id });
            });

            this.setState({ countries: ret });
        });
    }
    
    onTextChange = (e) => {        
        this.setState({  [e.target.name]: e.target.value });
    };

    onCheckBoxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    };
    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/ledger/ViewLedgers' } };
        this.props.history.push(from);
    }
    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
       
        if (action.name == 'country') {
            //call getstates api.
            this.setState({ blocking: !this.state.blocking });
            LocationService.getStates(value.value).then((x) => {
                var ret = [];
                x.map((state) => {
                    ret.push({ label: state.stateName, value: state.id });
                });
                this.setState({ states: ret, state: 0 });
                this.setState({ blocking: false });
            });
        } else if (action.name == 'groupId') {
            this.setState({ blocking: !this.state.blocking });            
            LedgerService.getSections(value.value).then((sections) => { 
                this.setState({ activeSections: sections, isPaymentReceipt: sections.paymentOrReceiptModeActive });
                this.setState({ blocking: false });
            });
        }
        this.setState({ effectiveFrom: this.state.effectiveFrom });
    }

    onClickChange(e) {
        var id = 1;
        if (e == 'UnderGroup') {
            var page = <CreateAccountGroup id={id} />;
            this.setState({ renderPages: page, isModalVisible: true });
        } else if (e == 'onClose') {
            GroupsService.getAccountGroups().then((groups) => {
                var ret = [];
                groups.map((group) => {
                    ret.push({ label: group.name, value: group.id });
                });

                this.setState({ groups: ret });
            });
            this.setState({ isModalVisible: false });
        }
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        {this.state.show == true && (
                            <Card>
                                <Card.Header>
                                    <Card.Title as="h4">Create Ledger</Card.Title>
                                    {this.state.showhidebackButton == undefined && (
                                        <Button className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Button>
                                    )}
                                </Card.Header>
                            </Card>
                        )}
                        <Formik
                            enableReinitialize
                            initialValues={{
                                name: this.state.name,
                                aliasName: this.state.aliasName,
                                groupId: this.state.groupId,
                                //Bill Wise
                                isBillWiseApplicable: this.state.isBillWiseApplicable,
                                //Address
                                address: this.state.address,
                                state: this.state.state,
                                country: this.state.country,
                                pincode: this.state.pincode,
                                //Pan
                                pan: this.state.pan,
                                gstNumber: this.state.gstNumber,
                                nop: this.state.nop,
                                //Payment Receipt Active
                                isPaymentReceipt: this.state.isPaymentReceipt,
                                //Gst
                                isGstApplicable: this.state.isGstApplicable,
                                gstRate: this.state.gstRate,
                                sacCode: this.state.sacCode,
                                isReverseChargeApplicable: this.state.isReverseChargeApplicable,
                                //Quantity applicable
                                isQuantityApplicable: this.state.isQuantityApplicable,
                                //TDS
                                isTdsApplicable: this.state.isTdsApplicable,
                                isTcsApplicable: this.state.isTcsApplicable,
                                //Contact Details
                                contactPerson: this.state.contactPerson,
                                designation: this.state.designation,
                                mobileNumber: this.state.mobileNumber,
                                phoneNumber: this.state.phoneNumber,
                                whatsappNumber: this.state.whatsappNumber,
                                email: this.state.email,
                                //Bank Details
                                bankAccountNumber: this.state.bankAccountNumber,
                                bankAccountType: this.state.bankAccountType,
                                ifsc: this.state.ifsc,
                                micr: this.state.micr,
                                bankName: this.state.bankName,
                                bankBranch: this.state.bankBranch,
                                //Balance Details
                                openingBalance: this.state.openingBalance,
                                debitCredit: this.state.debitCredit,
                                effectiveFrom: this.state.effectiveFrom,

                                //sectionsActive
                                isBillWiseActive: this.state.activeSections && this.state.activeSections.isBillWiseActive,
                                isAddressActive: this.state.activeSections && this.state.activeSections.isAddressActive,
                                panSectionActive: this.state.activeSections && this.state.activeSections.panSectionActive,
                                paymentOrReceiptModeActive:
                                    this.state.activeSections && this.state.activeSections.paymentOrReceiptModeActive,
                                gstDetailsActive: this.state.activeSections && this.state.activeSections.gstDetailsActive,
                                quantityApplicableActive: this.state.activeSections && this.state.activeSections.quantityApplicableActive,
                                tdsDetailsActive: this.state.activeSections && this.state.activeSections.tdsDetailsActive,
                                contactDetailsActive: this.state.activeSections && this.state.activeSections.contactDetailsActive,
                                bankDetailsActive: this.state.activeSections && this.state.activeSections.bankDetailsActive,
                                paymentOrReceiptModeDefaultActiveReadonly:
                                    this.state.activeSections && this.state.activeSections.paymentOrReceiptModeDefaultActiveReadonly
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().required('This field is required'),
                                groupId: Yup.number().min(1, 'This field is required'),
                                debitCredit: Yup.number().min(1, 'This field is required'),
                                openingBalance: Yup.number().min(0, 'This field is required'),
                                effectiveFrom: Yup.date().required('This field is required'),
                                country: Yup.number().when('isAddressActive', {
                                    is: true,
                                    then: Yup.number().min(1, 'Please select a value')
                                }),
                                //  Yup.object().when("isAddressActive", {
                                //     is: true,
                                //     then: Yup.object({
                                //         value: Yup.number().min(1, 'Please select a value')
                                //     })
                                // }),
                                state: Yup.number().when('isAddressActive', {
                                    is: true,
                                    then: Yup.number().min(1, 'Please select a value')
                                }),
                                //  Yup.object().when("isAddressActive", {
                                //     is: true,
                                //     then: Yup.object({
                                //         value: Yup.number().min(1, 'Please select a value')
                                //     })
                                //}),
                                email: Yup.string().email('Please enter a valid email'),
                                address: Yup.string().when('isAddressActive', {
                                    is: true,
                                    then: Yup.string().required('This field is required')
                                }),
                                nop: Yup.number().when('panSectionActive', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required')
                                }),
                                // pan: Yup.string().when('panSectionActive', {
                                //     is: true,
                                //     then: Yup.string().required('This field is required')
                                // }),
                                gstRate: Yup.number().when('gstDetailsActive', {
                                    is: true,
                                    then: Yup.number().min(1, 'This field is required')
                                })
                                // bankAccountType: Yup.number().when("bankDetailsActive", {
                                //     is: true,
                                //     then: Yup.number().min(1, 'This field is required')
                                // })
                            })}
                            onSubmit={(
                                {
                                    name,
                                    aliasName,
                                    groupId,
                                    isBillWiseApplicable,
                                    address,
                                    state,
                                    country,
                                    pincode,
                                    pan,
                                    gstNumber,
                                    nop,
                                    isPaymentReceipt,
                                    isGstApplicable,
                                    gstRate,
                                    sacCode,
                                    isReverseChargeApplicable,
                                    isQuantityApplicable,
                                    isTdsApplicable,
                                    isTcsApplicable,
                                    contactPerson,
                                    designation,
                                    mobileNumber,
                                    phoneNumber,
                                    whatsappNumber,
                                    email,
                                    bankAccountNumber,
                                    bankAccountType,
                                    ifsc,
                                    micr,
                                    bankName,
                                    bankBranch,
                                    openingBalance,
                                    debitCredit,
                                    effectiveFrom
                                },
                                { setStatus, setSubmitting }
                            ) => {
                                setStatus();                          
                                LedgerService.createLedger(
                                    name,
                                    aliasName,
                                    groupId,
                                    isBillWiseApplicable,
                                    address,
                                    state,
                                    pincode,
                                    pan,
                                    gstNumber,
                                    nop,
                                    isPaymentReceipt,
                                    isGstApplicable,
                                    gstRate,
                                    isReverseChargeApplicable,
                                    sacCode,
                                    isQuantityApplicable,
                                    isTdsApplicable,
                                    isTcsApplicable,
                                    contactPerson,
                                    designation,
                                    mobileNumber,
                                    phoneNumber,
                                    whatsappNumber,
                                    email,
                                    bankAccountNumber,
                                    bankAccountType,
                                    ifsc,
                                    bankName,
                                    micr,
                                    bankBranch,
                                    openingBalance,
                                    debitCredit,
                                    effectiveFrom
                                ).then(
                                    (response) => {
                                        if (this.state.showhidebackButton == 1) {
                                            setSubmitting(false);
                                            this.setState({ alert: true, show: false });
                                            return;
                                        }
                                        const { from } = this.props.location.state || { from: { pathname: '/app/ledger/ViewLedgers' } };
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
                                        <Field name="id" type="hidden" onChange={this.onTextChange} />
                                        {this.state.show == true && (
                                            <Card>
                                                <Card.Header>
                                                    <Card.Title as="h5">Basic Details</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="name">Name</label>
                                                            <Field
                                                                name="name"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' + (errors.name && touched.name ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="aliasName">Alias Name</label>
                                                            <Field
                                                                name="aliasName"
                                                                type="text"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.aliasName && touched.aliasName ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage name="aliasName" component="div" className="invalid-feedback" />
                                                        </div>
                                                        <div className="form-group col-md-9">
                                                            <label htmlFor="groupId">Under Group </label>

                                                            <FcPlus
                                                                style={{ marginLeft: '10px' }}
                                                                size={20}
                                                                onClick={() => this.onClickChange('UnderGroup')}
                                                            />

                                                            <Select
                                                                name="groupId"
                                                                onChange={this.onDropDownChange}
                                                                options={this.state.groups}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.groupId && touched.groupId ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage name="groupId" component="div" className="invalid-feedback" />
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.isBillWiseActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Bill Wise Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <CustomSwitch
                                                                    checked={this.state.isBillWiseApplicable}
                                                                    name="isBillWiseApplicable"
                                                                    id="isBillWiseApplicable"
                                                                    onChange={this.onCheckBoxChange}
                                                                    text="Bill Wise"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.activeSections && this.state.activeSections.isAddressActive && this.state.show == true && (
                                            <Card>
                                                <Card.Header>
                                                    <Card.Title as="h5">Address Section</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="address">Address</label>
                                                            <Field
                                                                name="address"
                                                                type="text"
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
                                                                onChange={this.onDropDownChange}
                                                                options={this.state.states}
                                                                classNamePrefix="select"
                                                                className={
                                                                    'form-control' + (errors.state && touched.state ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                                        </div>

                                                        <div className="form-group col-md-4">
                                                            <label htmlFor="pincode">Pincode</label>
                                                            <Field
                                                                name="pincode"
                                                                type="text"
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
                                        )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.panSectionActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">PAN Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="pan">PAN</label>
                                                                <Field
                                                                    name="pan"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' + (errors.pan && touched.pan ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="pan" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="gstNumber">GST Number</label>
                                                                <Field
                                                                    name="gstNumber"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.gstNumber && touched.gstNumber ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="gstNumber"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                                <label htmlFor="nop">Nature of Person</label>
                                                                <Select
                                                                    name="nop"
                                                                    onChange={this.onDropDownChange}
                                                                    options={this.state.natureOfPersons}
                                                                    classNamePrefix="select"
                                                                    className={
                                                                        'form-control' + (errors.nop && touched.nop ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="nop" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.paymentOrReceiptModeActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Active in Payment/Receipt Mode Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-12">
                                                                <CustomSwitch
                                                                    enabled={
                                                                        this.state.activeSections &&
                                                                        !this.state.activeSections.paymentOrReceiptModeDefaultActiveReadonly
                                                                    }
                                                                    checked={this.state.isPaymentReceipt}
                                                                    name="isPaymentReceipt"
                                                                    id="isPaymentReceipt"
                                                                    onChange={this.onCheckBoxChange}
                                                                    text="Payment/Receipt Mode"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.gstDetailsActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">GST Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <CustomSwitch
                                                                    checked={this.state.isGstApplicable}
                                                                    name="isGstApplicable"
                                                                    id="isGstApplicable"
                                                                    onChange={this.onCheckBoxChange}
                                                                    text="GST Applicable"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="gstRate">GST Rate</label>
                                                                <Select
                                                                    name="gstRate"
                                                                    onChange={this.onDropDownChange}
                                                                    options={this.state.gstRates}
                                                                    classNamePrefix="select"
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.gstRate && touched.gstRate ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="gstRate" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <CustomSwitch
                                                                    checked={this.state.isReverseChargeApplicable}
                                                                    name="isReverseChargeApplicable"
                                                                    id="isReverseChargeApplicable"
                                                                    onChange={this.onCheckBoxChange}
                                                                    text="Reverse Charge"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="sacCode">SAC Code</label>
                                                                <Field
                                                                    name="sacCode"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.sacCode && touched.sacCode ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="sacCode" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.quantityApplicableActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Quantity Applicable Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-12">
                                                                <CustomSwitch
                                                                    checked={this.state.isQuantityApplicable}
                                                                    name="isQuantityApplicable"
                                                                    id="isQuantityApplicable"
                                                                    onChange={this.onCheckBoxChange}
                                                                    text="Quantity Applicable"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.tdsDetailsActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">TDS Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <CustomSwitch
                                                                    checked={this.state.isTdsApplicable}
                                                                    name="isTdsApplicable"
                                                                    id="isTdsApplicable"
                                                                    onChange={this.onCheckBoxChange}
                                                                    text="TDS Applicable"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <CustomSwitch
                                                                    checked={this.state.isTcsApplicable}
                                                                    name="isTcsApplicable"
                                                                    id="isTcsApplicable"
                                                                    onChange={this.onCheckBoxChange}
                                                                    text="TCS Applicable"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.contactDetailsActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Contact Details Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="contactPerson">Contact Person</label>
                                                                <Field
                                                                    name="contactPerson"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.contactPerson && touched.contactPerson ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="contactPerson"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="designation">Desigination</label>
                                                                <Field
                                                                    name="designation"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.designation && touched.designation ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="designation"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="mobileNumber">Mobile No</label>
                                                                <Field
                                                                    name="mobileNumber"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.mobileNumber && touched.mobileNumber ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="mobileNumber"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="phoneNumber">Phone No</label>
                                                                <Field
                                                                    name="phoneNumber"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.phoneNumber && touched.phoneNumber ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="phoneNumber"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="whatsappNumber">WhatsApp No</label>
                                                                <Field
                                                                    name="whatsappNumber"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.whatsappNumber && touched.whatsappNumber
                                                                            ? ' is-invalid'
                                                                            : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="whatsappNumber"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="email">Email Id</label>
                                                                <Field
                                                                    name="email"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.email && touched.email ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.activeSections &&
                                            this.state.activeSections.bankDetailsActive &&
                                            this.state.show == true && (
                                                <Card>
                                                    <Card.Header>
                                                        <Card.Title as="h5">Bank Details Section</Card.Title>
                                                    </Card.Header>
                                                    <Card.Body>
                                                        <div className="form-row">
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="bankAccountNumber">A/c No</label>
                                                                <Field
                                                                    name="bankAccountNumber"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.bankAccountNumber && touched.bankAccountNumber
                                                                            ? ' is-invalid'
                                                                            : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="bankAccountNumber"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="bankAccountType">Account Type</label>
                                                                <Select
                                                                    name="bankAccountType"
                                                                    onChange={this.onDropDownChange}
                                                                    options={this.state.accountTypes}
                                                                    classNamePrefix="select"
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.bankAccountType && touched.bankAccountType
                                                                            ? ' is-invalid'
                                                                            : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="bankAccountType"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="ifsc">IFSC</label>
                                                                <Field
                                                                    name="ifsc"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' + (errors.ifsc && touched.ifsc ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="ifsc" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="micr">MICR</label>
                                                                <Field
                                                                    name="micr"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' + (errors.micr && touched.micr ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="micr" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="bankName">Bank Name</label>
                                                                <Field
                                                                    name="bankName"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.bankName && touched.bankName ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="bankName"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <label htmlFor="bankBranch">Branch Name</label>
                                                                <Field
                                                                    name="bankBranch"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.bankBranch && touched.bankBranch ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="bankBranch"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                        </div>
                                                    </Card.Body>
                                                </Card>
                                            )}

                                        {this.state.groupId > 0 && this.state.show == true && (
                                            <Card>
                                                <Card.Header>
                                                    <Card.Title as="h5">Balance Section</Card.Title>
                                                </Card.Header>
                                                <Card.Body>
                                                    <div className="form-row">
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="openingBalance">Opening Balance</label>
                                                            <Field
                                                                name="openingBalance"
                                                                type="number"
                                                                onChange={this.onTextChange}
                                                                className={
                                                                    'form-control' +
                                                                    (errors.openingBalance && touched.openingBalance ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="openingBalance"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label htmlFor="debitCredit">Debit/Credit</label>
                                                            <Select
                                                                name="debitCredit"
                                                                onChange={this.onDropDownChange}
                                                                options={this.state.balanceTypes}
                                                                classNamePrefix="select"
                                                                defaultValue="{1}"
                                                                className={
                                                                    'form-control' +
                                                                    (errors.debitCredit && touched.debitCredit ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage name="debitCredit" component="div" className="invalid-feedback" />
                                                        </div>
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="effectiveFrom">Effective From</label>
                                                            <input
                                                                name="effectiveFrom"
                                                                type="date"
                                                                onChange={this.onTextChange}                                                                
                                                                className={
                                                                    'form-control' +
                                                                    (errors.effectiveFrom && touched.effectiveFrom ? ' is-invalid' : '')
                                                                }
                                                            />
                                                            <ErrorMessage
                                                                name="effectiveFrom"
                                                                component="div"
                                                                className="invalid-feedback"
                                                            />
                                                        </div>
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        )}
                                        {this.state.show == true && (
                                            <div className="form-group ">
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                    Create Ledger
                                                </button>
                                                {isSubmitting && (
                                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                )}
                                            </div>
                                        )}

                                        {/*{status && <div className={'alert alert-danger'}>{status}</div>}
                                         <p>
                                            <pre>{JSON.stringify(errors, null, 2)}</pre>
                                        </p>
                                        <p>
                                            <pre>{JSON.stringify(values, null, 2)}</pre>
                                                </p>*/}
                                    </Form>
                                </BlockUi>
                            )}
                        />
                        {this.state.alert == true && (
                            <div class="card">
                                <div class="card-header">Ledgers</div>
                                <div class="card-body">
                                    <div className="alert alert-success">
                                        <div style={{ color: 'green' }}>
                                            <strong>Success!</strong> Ledgers Added Successfully.
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
export default CreateLedger;
