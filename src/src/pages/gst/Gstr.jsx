import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card, ResponsiveEmbed } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { GstService } from '../../services/GstService';
import { CompanyService } from '../../services/CompanyService';
import { GstReportService } from '../../services/GstReportService';
import { WalletService } from '../../services/WalletService';
import { Dropdown } from 'bootstrap';
import DatePicker from "react-datepicker";
import * as moment from 'moment';

const RequestOtpActivity = 'RequestOtpActivity';
const AuthenticateOtp = 'AuthenticateOtp';
const B2BActivity = 'GstActivity';
const B2BAllActivity = 'B2BAllActivity';
const ConfirmDownload = 'ConfirmDownload';
const CancelDownload = 'CancelDownload';

const QuaterlyDowndoad = "QuaterlyDowndoad";
class Gstr extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAdmin: false,
            isInitiated: false,
            isAuthenticated: false,
            otp: '',
            month: '',
            transactionCode: '',
            submitAction: '',
            modalSubmitAction: '',
            isModalVisible: false,
            modalText: '',
            isTransactionAllowed: false,
            selectedUser: '',
            selectedUserTag: '',
            gstUsers: [],
            isClientAdmin: false,
            clientGst: '',
            month: '',
            buttonText: '',
            month: '',
            gstr1ToDate: '',
            gstr1fromDate: '',
            gstr1Status: '',
            years: [],
            quaters: [
                { label: '01/Jan - 31/Mar', value: '01/Jan - 31/Mar' },
                { label: '01/Apr - 30/Jun', value: '01/Apr - 30/Jun' },
                { label: '01/Jul - 30/Sep', value: '01/Jul - 30/Sep' },
                { label: '01/Oct - 31/Dec', value: '01/Oct - 31/Dec' }
            ],
            quarterlyyear: '',
            quarterly: '',
            submitAction: ''
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.formModalText = this.formModalText.bind(this);
        this.ViewGstr1 = this.ViewGstr1.bind(this);

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
        if (!AuthenticationService.currentUserValue) {
            this.props.history.push(Config.signInPath);
            return;
        }
        var isUserAdmin =
            AuthenticationService.currentUserValue.role == AuthenticationService.superAdmin ||
            AuthenticationService.currentUserValue.role == AuthenticationService.Admin;
        var isClientAdmin = AuthenticationService.currentUserValue.role == AuthenticationService.clientAdmin;
        // var isUserAdmin = AuthenticationService.currentUserValue.isAdmin || AuthenticationService.currentUserValue.isSuperAdmin;
        this.setState({ isAdmin: isUserAdmin }, (_) => {
            if (isUserAdmin) {
                GstService.getGstUsers().then((users) => {
                    var ret = [];
                    users.map((user) => {
                        ret.push({ label: `${user.name} (${user.company})`, value: { id: user.companyId, gst: user.gst } });
                    });
                    this.setState({ gstUsers: ret, buttonText: 'Admin' });
                });
            } else if (isClientAdmin) {
                CompanyService.getCompanyDetails().then((c) => {
                    this.setState({ isClientAdmin: true, buttonText: 'clientAdmin', clientGst: c.gstNumber });
                });
            }
        });

        var startYear = new Date().getFullYear() - 69;
        var currentYear = new Date().getFullYear();
        var ret = [];
        var c = 0;
        for (var i = startYear; i != currentYear + 1; i++) {
            c++;
            ret.push({ label: i, value: i });
        }
        this.setState({ years: ret });


    }
    ViewGstr1(e) {
        var startDate = "";
        var endDate = "";
        if (e == 'MonthWise') {

            var date = new Date(this.state.month);
            var days = 0;
            var months = new Date(date).getMonth() + 1;
            if (months == 3 || months == 12) {
                days = 31;
            }
            else {
                days = 30;
            }
            startDate = date;
            endDate = new Date(this.state.month);
            endDate.setDate(endDate.getDate() + days);
        }
        else {
            var quaterlystartDate = "";
            var QuaterlyEndDate = "";


            if (this.state.quarterly != '') {
                if (this.state.quarterly == "01/Jan - 31/Mar") {
                    quaterlystartDate = moment("01/01" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    QuaterlyEndDate = moment("03/31" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    startDate = new Date(quaterlystartDate);
                    endDate = new Date(QuaterlyEndDate);
                }
                else if (this.state.quarterly == "01/Apr - 30/Jun") {
                    quaterlystartDate = moment("04/01" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    QuaterlyEndDate = moment("06/30" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    startDate = new Date(quaterlystartDate);
                    endDate = new Date(QuaterlyEndDate);
                }
                else if (this.state.quarterly == "01/Jul - 30/Sep") {
                    quaterlystartDate = moment("07/01" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    QuaterlyEndDate = moment("09/30" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    startDate = new Date(quaterlystartDate);
                    endDate = new Date(QuaterlyEndDate);
                }
                else if (this.state.quarterly == " value: '01/Oct -  31/Dec") {
                    quaterlystartDate = moment("10/01" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    QuaterlyEndDate = moment("12/31" + "/" + this.state.quarterlyyear).format("MM-DD-YYYY");
                    startDate = new Date(quaterlystartDate);
                    endDate = new Date(QuaterlyEndDate);
                }
            }
        }
        var data = {
            startDate: startDate,
            endDate: endDate
        };
        // this.props.history.push('/app/gst/ViewGstr1',state:data);
        this.props.history.push({
            pathname: '/app/gst/ViewGstr1',
            state: data
        });
    }
    formModalText() {
        if (this.state.isAdmin) {
            var text = 'Confirm Download?';
            this.setState({ isModalVisible: true, modalText: text, isTransactionAllowed: true });
        } else {
            WalletService.getWalletInfo().then(
                (res) => {
                    if (res.isSuccess) {
                        var text = '';
                        if (res.walletInfo.balance < 300) {
                            text = `You have low wallet balance of ${res.walletInfo.balance} to perform this operation`;
                            this.setState({ isModalVisible: true, modalText: text, isTransactionAllowed: false });
                        } else {
                            text = `You Wallet Balance is ${res.walletInfo.balance
                                } Points, you will be charged ${300} Points for the transaction`;
                            this.setState({ isModalVisible: true, modalText: text, isTransactionAllowed: true });
                        }
                    }
                },
                (err) => {
                    this.setState({ isModalVisible: true, modalText: err, isTransactionAllowed: false });
                }
            );
        }
    }

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'selectedUser') {
            this.setState({ selectedUser: value.value, selectedUserTag: value.label });
        }
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <>
                <>
                    <Formik
                        enableReinitialize
                        initialValues={{
                            isInitiated: this.state.isInitiated,
                            isAuthenticated: this.state.isAuthenticated,
                            otp: this.state.otp,
                            month: this.state.month,
                            selectedUser: this.state.selectedUser,
                            selectedUserTag: this.state.selectedUserTag,
                            quarterlyyear: this.state.quarterlyyear,
                            quarterly: this.state.quarterly
                        }}
                        validationSchema={Yup.object().shape({
                            // otp: Yup.string().when("isInitiated", {
                            //     is: true,
                            //     then: Yup.string().required('This field is required')
                            // })
                        })}
                        onSubmit={({ selectedUser, month, quarterlyyear, quarterly }, { setStatus, setSubmitting }) => {
                            setStatus();
                            var startDate = '';
                            var endDate = '';

                            var date = new Date(month);
                            var days = 0;
                            var months = new Date(date).getMonth() + 1;
                            if (months == 3 || months == 12) {
                                days = 30;
                            }
                            else {
                                days = 29;
                            }
                            startDate = date;
                            endDate = new Date(month);
                            endDate.setDate(endDate.getDate() + days);
                            // var year = date.getFullYear();
                            // var month = date.getMonth() + 1;

                            var quaterlystartDate = "";
                            var QuaterlyEndDate = "";

                            if (quarterly != '') {
                                if (quarterly == "01/Jan - 31/Mar") {
                                    quaterlystartDate = Date.parse("01/01" + "/" + quarterlyyear,'dd/MM/yyyy');
                                    QuaterlyEndDate = Date.parse("03/31" + "/" + quarterlyyear,'dd/MM/yyyy');
                                    startDate = moment(quaterlystartDate).format('MM/DD/YYYY');
                                    endDate = moment(QuaterlyEndDate).format('MM/DD/YYYY');
                                }
                                else if (quarterly == "01/Apr - 30/Jun") {                                    
                                    quaterlystartDate=Date.parse("4/1" + "/" + quarterlyyear,'dd/MM/yyyy');
                                    QuaterlyEndDate=Date.parse("6/30" + "/" + quarterlyyear,'dd/MM/yyyy');                         
                                    startDate = moment(quaterlystartDate).format('MM/DD/YYYY');
                                    endDate = moment(QuaterlyEndDate).format('MM/DD/YYYY');
                                }
                                else if (quarterly == "01/Jul - 30/Sep") {
                                    quaterlystartDate = Date.parse("07/01" + "/" + quarterlyyear,'dd/MM/yyyy');
                                    QuaterlyEndDate = Date.parse("09/29" + "/" + quarterlyyear,'dd/MM/yyyy');
                                    startDate = moment(quaterlystartDate).format('MM/DD/YYYY');
                                    endDate = moment(QuaterlyEndDate).format('MM/DD/YYYY');
                                }
                                else if (quarterly == " value: '01/Oct -  31/Dec") {
                                    quaterlystartDate = Date.parse("10/01" + "/" + quarterlyyear,'dd/MM/yyyy');
                                    QuaterlyEndDate = Date.parse("12/31" + "/" + quarterlyyear,'dd/MM/yyyy');
                                    startDate = moment(quaterlystartDate).format('MM/DD/YYYY');
                                    endDate = moment(QuaterlyEndDate).format('MM/DD/YYYY');
                                }
                            }
                            if (this.state.submitAction == QuaterlyDowndoad) {
                                selectedUser = '';
                            }
                            if (this.state.buttonText == 'Admin' && selectedUser != '') {
                                GstReportService.GetGstr1ReportForCompany(
                                    startDate,
                                    endDate,
                                    selectedUser.id,
                                    selectedUser.gst
                                ).then(
                                    (response) => {
                                        return response;
                                    },
                                    (error) => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                            } else if (this.state.buttonText == 'clientAdmin' || this.state.buttonText == 'Admin' && selectedUser == '') {
                                GstReportService.GetGstr1Report(startDate, endDate, this.state.clientGst).then(
                                    (response) => {
                                        return response;
                                    },
                                    (error) => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                            }

                        }}
                        render={({ errors, status, touched, isSubmitting }) => (
                            <>

                                <Form>
                                    {this.state.isAdmin && (
                                        <Card>
                                            <Card.Header>
                                                <div className='row'>
                                                    <div className='col-md-4'></div>
                                                    <div className='col-md-4'><Card.Title as="h5">GST Home</Card.Title></div>
                                                    <div className='col-md-4'></div>
                                                </div>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className='row'>
                                                    <div className='col-md-12'>

                                                        <div className="form-row">
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="selectedUserTag">Select User</label>
                                                                <Select
                                                                    name="selectedUser"
                                                                    onChange={this.onDropDownChange}
                                                                    options={this.state.gstUsers}
                                                                    classNamePrefix="select"
                                                                    className={
                                                                        'form-control' +
                                                                        (errors.selectedUser && touched.selectedUser
                                                                            ? ' is-invalid'
                                                                            : '')
                                                                    }
                                                                />
                                                                <ErrorMessage
                                                                    name="selectedUser"
                                                                    component="div"
                                                                    className="invalid-feedback"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )}
                                    <Card>
                                        <Card.Header>
                                            <div className='row'>
                                                <div className='col-md-4'></div>
                                                <div className='col-md-4'><Card.Title as="h5">GST Home</Card.Title></div>
                                                <div className='col-md-4'></div>
                                            </div>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className='row'>
                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <label htmlFor="month">Select Month</label>
                                                        <input
                                                            name="month"
                                                            type="month"
                                                            onChange={this.onTextChange}
                                                            className={
                                                                'form-control' + (errors.month && touched.month ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="month" component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group col-md-12">
                                                        <button type="submit" className="btn btn-primary">
                                                            Download
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ marginLeft: '12px' }}
                                                            submitAction={false}
                                                            onClick={() => this.ViewGstr1("MonthWise")}
                                                        >
                                                            GO
                                                        </button>
                                                    </div>

                                                </div>

                                                <div className='col-md-6'>
                                                    <div className="form-group">
                                                        <label htmlFor="quarterlyyear">Select Year</label>
                                                        <Select
                                                            name="quarterlyyear"
                                                            options={this.state.years}
                                                            onChange={this.onDropDownChange}
                                                            className={
                                                                'form-control' + (errors.quarterlyyear && touched.quarterlyyear ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="quarterlyyear" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group">
                                                        <label htmlFor="quarterly">quarterly</label>
                                                        <Select
                                                            name="quarterly"
                                                            onChange={this.onDropDownChange}
                                                            options={this.state.quaters}
                                                            className={
                                                                'form-control' +
                                                                (errors.quarterly && touched.quarterly
                                                                    ? ' is-invalid'
                                                                    : '')
                                                            }
                                                        />
                                                        <ErrorMessage
                                                            name="quarterly"
                                                            component="div"
                                                            className="invalid-feedback"
                                                        />
                                                    </div>

                                                    <div className='form-group'>

                                                        <button type="submit" onClick={() => this.setState({ submitAction: QuaterlyDowndoad })} className="btn btn-primary">
                                                            Download
                                                        </button>
                                                        <button
                                                            className="btn btn-primary"
                                                            style={{ marginLeft: '12px' }}
                                                            submitAction={false}
                                                            onClick={this.ViewGstr1}
                                                        >
                                                            GO
                                                        </button>

                                                    </div>

                                                </div>

                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Form>

                            </>
                        )
                        }
                    />
                </>

            </>
        );
    }
}
export default Gstr;
