import React, { Component } from 'react';
import Select from "react-select";
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { GstService } from '../../services/GstService';
import { WalletService } from '../../services/WalletService';


const RequestOtpActivity = 'RequestOtpActivity';
const AuthenticateOtp = 'AuthenticateOtp';
const B2BActivity = 'GstActivity';
const B2BAllActivity = 'B2BAllActivity';
const ConfirmDownload = 'ConfirmDownload';
const CancelDownload = 'CancelDownload';

class GstMenu extends Component {
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
            gstUsers: []
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.formModalText = this.formModalText.bind(this);

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
        var isUserAdmin = AuthenticationService.currentUserValue.role == AuthenticationService.superAdmin
            || AuthenticationService.currentUserValue.role == AuthenticationService.Admin
        // var isUserAdmin = AuthenticationService.currentUserValue.isAdmin || AuthenticationService.currentUserValue.isSuperAdmin;
        this.setState({ isAdmin: isUserAdmin }, _ => {
            if (isUserAdmin) {
                GstService.getGstUsers().then(
                    users => {
                        var ret = [];
                        users.map(
                            user => {
                                ret.push({ label: `${user.name} (${user.company})`, value: user.companyId });
                            }
                        );
                        this.setState({ gstUsers: ret });
                    }
                )
            }
        });
    }

    formModalText() {
        if (this.state.isAdmin) {
            var text = 'Confirm Download?';
            this.setState({ isModalVisible: true, modalText: text, isTransactionAllowed: true });
        }
        else {
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
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">GST Home</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <>
                                    <Formik
                                        enableReinitialize
                                        initialValues={{
                                            isInitiated: this.state.isInitiated,
                                            isAuthenticated: this.state.isAuthenticated,
                                            otp: this.state.otp,
                                            month: this.state.month,
                                            selectedUser: this.state.selectedUser,
                                            selectedUserTag: this.state.selectedUserTag
                                        }}
                                        validationSchema={Yup.object().shape({
                                            // otp: Yup.string().when("isInitiated", {
                                            //     is: true,
                                            //     then: Yup.string().required('This field is required')
                                            // })
                                        })}
                                        onSubmit={({ otp, selectedUser }, { setStatus, setSubmitting }) => {
                                            setStatus();
                                            if (this.state.submitAction == RequestOtpActivity) {
                                                if (this.state.isAdmin) {
                                                    GstService.startSessionAdmin(selectedUser).then(
                                                        (response) => {
                                                            if (!response.isSuccess) {
                                                                setSubmitting(false);
                                                                setStatus(response.message);
                                                            } else {
                                                                setSubmitting(false);
                                                                this.setState({ isInitiated: true, transactionCode: response.transactionId });
                                                            }
                                                        },
                                                        (error) => {
                                                            setSubmitting(false);
                                                            setStatus(error);
                                                        }
                                                    );
                                                }
                                                else {
                                                    GstService.startSession().then(
                                                        (response) => {
                                                            if (!response.isSuccess) {
                                                                setSubmitting(false);
                                                                setStatus(response.message);
                                                            } else {
                                                                setSubmitting(false);
                                                                this.setState({ isInitiated: true, transactionCode: response.transactionId });
                                                            }
                                                        },
                                                        (error) => {
                                                            setSubmitting(false);
                                                            setStatus(error);
                                                        }
                                                    );
                                                }
                                            } else if (this.state.submitAction == AuthenticateOtp) {
                                                if (this.state.isAdmin) {
                                                    GstService.authenticateAdmin(selectedUser, otp, this.state.transactionCode).then(
                                                        (response) => {
                                                            if (!response.isSuccess) {
                                                                setSubmitting(false);
                                                                setStatus(response.message);
                                                            } else {
                                                                setSubmitting(false);
                                                                this.setState({
                                                                    isAuthenticated: true,
                                                                    transactionCode: response.transactionId
                                                                });
                                                            }
                                                        },
                                                        (error) => {
                                                            setSubmitting(false);
                                                            setStatus(error);
                                                        }
                                                    );
                                                }
                                                else {
                                                    GstService.authenticate(otp, this.state.transactionCode).then(
                                                        (response) => {
                                                            if (!response.isSuccess) {
                                                                setSubmitting(false);
                                                                setStatus(response.message);
                                                            } else {
                                                                setSubmitting(false);
                                                                this.setState({
                                                                    isAuthenticated: true,
                                                                    transactionCode: response.transactionId
                                                                });
                                                            }
                                                        },
                                                        (error) => {
                                                            setSubmitting(false);
                                                            setStatus(error);
                                                        }
                                                    );
                                                }
                                            } else if (this.state.submitAction == B2BAllActivity) {
                                                this.formModalText();
                                                setSubmitting(false);
                                            } else if (this.state.submitAction == B2BActivity) {
                                                this.formModalText();
                                                setSubmitting(false);
                                            }
                                        }}
                                        render={({ errors, status, touched, isSubmitting }) => (
                                            <>
                                                <Form>
                                                    {this.state.isInitiated && !this.state.isAuthenticated && (
                                                        <div className="form-row">
                                                            {this.state.isAdmin &&
                                                                <div className="form-group col-md-12">
                                                                    <label htmlFor="selectedUserTag">Select User</label>
                                                                    <Field name="selectedUserTag" disabled={true} options={this.state.selectedUserTag}
                                                                        className={'form-control' + (errors.selectedUserTag && touched.selectedUserTag ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="selectedUserTag" component="div" className="invalid-feedback" />
                                                                </div>
                                                            }
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="otp">OTP</label>
                                                                <Field
                                                                    name="otp"
                                                                    type="text"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' + (errors.otp && touched.otp ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="otp" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group col-md-12">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                    disabled={isSubmitting}
                                                                    onClick={() => this.setState({ submitAction: AuthenticateOtp })}
                                                                >
                                                                    Authenticate
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {!this.state.isInitiated && (
                                                        <div className="form-row">
                                                            {this.state.isAdmin &&
                                                                <div className="form-group col-md-12">
                                                                    <label htmlFor="selectedUser">Select User</label>
                                                                    <Select name="selectedUser" onChange={this.onDropDownChange} options={this.state.gstUsers}
                                                                        classNamePrefix="select" className={'form-control' + (errors.selectedUser && touched.selectedUser ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="selectedUser" component="div" className="invalid-feedback" />
                                                                </div>
                                                            }
                                                            <div className="form-group col-md-12">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                    disabled={isSubmitting}
                                                                    onClick={() => this.setState({ submitAction: RequestOtpActivity })}
                                                                >
                                                                    Request OTP
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    {this.state.isInitiated && this.state.isAuthenticated && (
                                                        <div className="form-row">
                                                            {this.state.isAdmin &&
                                                                <div className="form-group col-md-12">
                                                                    <label htmlFor="selectedUserTag">Select User</label>
                                                                    <Field name="selectedUserTag" disabled={true} options={this.state.selectedUserTag}
                                                                        className={'form-control' + (errors.selectedUserTag && touched.selectedUserTag ? ' is-invalid' : '')} />
                                                                    <ErrorMessage name="selectedUserTag" component="div" className="invalid-feedback" />
                                                                </div>
                                                            }
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="month">Select Month</label>
                                                                <Field
                                                                    name="month"
                                                                    type="month"
                                                                    onChange={this.onTextChange}
                                                                    className={
                                                                        'form-control' + (errors.otp && touched.otp ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="month" component="div" className="invalid-feedback" />
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                    disabled={isSubmitting}
                                                                    onClick={() => this.setState({ submitAction: B2BActivity })}
                                                                >
                                                                    Download B2B Invoices
                                                                </button>
                                                            </div>
                                                            <div className="form-group col-md-6">
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                    disabled={isSubmitting}
                                                                    onClick={() => this.setState({ submitAction: B2BAllActivity })}
                                                                >
                                                                    Download B2B AllInvoices
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                    <div className="form-group ">
                                                        {isSubmitting && (
                                                            <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                        )}
                                                    </div>
                                                    {this.state.data && (
                                                        <div className="form-row">
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="data">Data</label>
                                                                <Field
                                                                    component="textarea"
                                                                    readonly={true}
                                                                    rows="4"
                                                                    value={this.state.data}
                                                                ></Field>
                                                                {/* <Field name="data" readonly={true} type="text" className={'form-control' + (errors.data && touched.data ? ' is-invalid' : '')} /> */}
                                                                <ErrorMessage name="data" component="div" className="invalid-feedback" />
                                                            </div>
                                                        </div>
                                                    )}
                                                    {status && <div className={'alert alert-danger'}>{status}</div>}
                                                </Form>
                                            </>
                                        )}
                                    />
                                    {this.state.isModalVisible && (
                                        <Modal isOpen={this.state.isModalVisible} toggle={this.setFolderModal}>
                                            <ModalHeader toggle={this.setFolderModal}>Confirm Download</ModalHeader>
                                            <ModalBody>
                                                <div>
                                                    <Formik
                                                        initialValues={{}}
                                                        validationSchema={Yup.object().shape({})}
                                                        onSubmit={({ transactionCode, month }, { setStatus, setSubmitting }) => {
                                                            setStatus();
                                                            if (this.state.modalSubmitAction == CancelDownload) {
                                                                this.setState({ isModalVisible: false });
                                                            } else if (this.state.modalSubmitAction == ConfirmDownload) {
                                                                if (this.state.submitAction == B2BActivity) {
                                                                    if (this.state.isAdmin) {
                                                                        GstService.getB2bInvoicesAdmin(
                                                                            this.state.selectedUser,
                                                                            this.state.transactionCode,
                                                                            this.state.month
                                                                        ).then(
                                                                            (_) => {
                                                                                setSubmitting(false);
                                                                                this.setState({ month: '', isModalVisible: false });
                                                                            },
                                                                            (err) => {
                                                                                setSubmitting(false);
                                                                                setStatus(err.detail);
                                                                            }
                                                                        );
                                                                    }
                                                                    else {
                                                                        GstService.getB2bInvoices(
                                                                            this.state.transactionCode,
                                                                            this.state.month
                                                                        ).then(
                                                                            (_) => {
                                                                                setSubmitting(false);
                                                                                this.setState({ month: '', isModalVisible: false });
                                                                            },
                                                                            (err) => {
                                                                                setSubmitting(false);
                                                                                setStatus(err.detail);
                                                                            }
                                                                        );
                                                                    }
                                                                }
                                                                else if (this.state.submitAction == B2BAllActivity) {

                                                                    if (this.state.isAdmin) {
                                                                        GstService.GetB2bAllInvoicesAdmin(
                                                                            this.state.selectedUser,
                                                                            this.state.transactionCode,
                                                                            this.state.month
                                                                        ).then(
                                                                            (_) => {
                                                                                setSubmitting(false);
                                                                                this.setState({ month: '', isModalVisible: false });
                                                                            },
                                                                            (err) => {
                                                                                setSubmitting(false);
                                                                                setStatus(err.detail);
                                                                            }
                                                                        );
                                                                    }
                                                                    else {
                                                                        GstService.GetB2bAllInvoices(
                                                                            this.state.transactionCode,
                                                                            this.state.month
                                                                        ).then(
                                                                            (_) => {
                                                                                setSubmitting(false);
                                                                                this.setState({ month: '', isModalVisible: false });
                                                                            },
                                                                            (err) => {
                                                                                setSubmitting(false);
                                                                                setStatus(err.detail);
                                                                            }
                                                                        );
                                                                    }
                                                                }
                                                            }
                                                        }}
                                                        render={({ errors, status, touched, isSubmitting }) => (
                                                            <Form>
                                                                <div className="form-row">
                                                                    <div className="form-group col-md-12">
                                                                        <label htmlFor="modalText">{this.state.modalText}</label>
                                                                    </div>
                                                                    {this.state.isTransactionAllowed && (
                                                                        <div className="form-group col-md-6">
                                                                            <button
                                                                                type="submit"
                                                                                className="btn btn-primary"
                                                                                disabled={isSubmitting}
                                                                                onClick={() =>
                                                                                    this.setState({ modalSubmitAction: ConfirmDownload })
                                                                                }
                                                                            >
                                                                                Confirm
                                                                            </button>
                                                                        </div>
                                                                    )}
                                                                    <div className="form-group col-md-6">
                                                                        <button
                                                                            type="submit"
                                                                            className="btn btn-secondary"
                                                                            disabled={isSubmitting}
                                                                            onClick={() =>
                                                                                this.setState({ modalSubmitAction: CancelDownload })
                                                                            }
                                                                        >
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                                {status && (
                                                                    <div id="errorStatus" className={this.state.msgClassName}>
                                                                        {status}
                                                                    </div>
                                                                )}
                                                            </Form>
                                                        )}
                                                    />
                                                </div>
                                            </ModalBody>
                                        </Modal>
                                    )}
                                </>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </>
        );
    }
}
export default GstMenu;
