import React, { Component } from 'react';
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { WalletService } from '../../services/WalletService';

class AddFunds extends Component {
    constructor(props) {
        super(props);

        this.state = {
            walletActivated: true,
            walletMessage: '',
            amount: 0.0,
            paymentCompleted: false,
            paymentMessage: '',
            txnId: ''
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.callBolt = this.callBolt.bind(this);
        this.handleBoltSuccess = this.handleBoltSuccess.bind(this);
        this.handleBoltFailure = this.handleBoltFailure.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
        // redirect to login if not logged in
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
        }
    }

    componentDidMount() {
        WalletService.getWalletInfo().then(x => {
            if (!x.isSuccess) {
                this.setState({ walletActivated: false, walletMessage: x.message });
            }
        });
    }

    callBolt(paymentHashEntity) {
        window.bolt.launch({
            key: paymentHashEntity.key,
            txnid: paymentHashEntity.transactionId,
            hash: paymentHashEntity.hash,
            amount: paymentHashEntity.amount,
            firstname: paymentHashEntity.firstName,
            email: paymentHashEntity.email,
            phone: paymentHashEntity.phone,
            productinfo: paymentHashEntity.productInfo,
            //udf5: 'BOLT_KIT_ASP.NET',
            surl: "http://bbscclients.in/success",
            furl: "http://bbscclients.in/failure"
        }, {
            responseHandler: this.handleBoltSuccess,
            catchException: this.handleBoltFailure
        });
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value, paymentCompleted: false });
    }

    handleBoltFailure(BOLT) {
        this.setState({ paymentCompleted: true, paymentMessage: BOLT.message });
    }

    handleBoltSuccess(BOLT) {
        if (BOLT.response.txnStatus != 'CANCEL') {
            var res = BOLT.response;
            WalletService.updatePaymentStatus(res.txnStatus, res.txnMessage, res.txnid, res.hash, res.mode, res.error_Message,
                res.bankcode, res.net_amount_debit, res.status, res.isConsentPayment, res.error, res.addedon, res.encryptedPaymentId,
                res.bank_ref_num, res.unmappedstatus, res.payuMoneyId, res.mihpayid, res.giftCardIssued, res.field1, res.cardnum,
                res.amount_split, res.PG_TYPE, res.name_on_card)
                .then(x => {
                    if (x.isSuccess) {
                        var msg = `The updated Wallet balance is ${x.walletEntity.balance} points`;
                        this.setState({ paymentCompleted: true, paymentMessage: msg });
                    }
                    else {
                        this.setState({ paymentCompleted: true, paymentMessage: "Payment Successful but could not update wallet, Please contact administrator" });
                    }
                },
                    err => {
                        this.setState({ paymentCompleted: true, paymentMessage: err });
                    });
        }
        else {
            var res = BOLT.response;
            WalletService.updatePaymentStatus(res.txnStatus, res.txnMessage, this.state.txnId, null, null, null, null,
                null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null)
                .then(x => {
                    if (x.isSuccess) {
                        this.setState({ paymentCompleted: true, paymentMessage: "Payment Cancelled" });
                    }
                    else {
                        this.setState({ paymentCompleted: true, paymentMessage: "Payment Cancelled" });
                    }
                },
                    err => {
                        this.setState({ paymentCompleted: true, paymentMessage: err });
                    });
        }
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card >
                        <Card.Header>
                            <Card.Title as="h5">Add Funds</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik enableReinitialize
                                initialValues={{
                                    amount: this.state.amount
                                }}
                                validationSchema={Yup.object().shape({
                                    amount: Yup.number().min(0)
                                })}
                                onSubmit={({ amount }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    // this.callBolt(null);
                                    // return
                                    WalletService.getPaymentHash(amount, "http://bbscclients.in/success", "http://bbscclients.in/failure")
                                        .then(
                                            response => {
                                                if (response.isSuccess) {
                                                    this.setState({ txnId: response.paymentHashEntity.transactionId }, _ => {
                                                        this.callBolt(response.paymentHashEntity);
                                                    });
                                                }
                                                else {
                                                    setSubmitting(false);
                                                    setStatus(response.message);
                                                }
                                            },
                                            error => {
                                                setSubmitting(false);
                                                setStatus(error);
                                            }
                                        );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        {this.state.walletActivated &&
                                            <>
                                                <div className="form-row">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="amount">Amount</label>
                                                        <Field name="amount" type="number" onChange={this.onTextChange} min='0.01' step='0.01'
                                                            className={'form-control' + (errors.amount && touched.amount ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="amount" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                                <div className="form-group ">
                                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update Balance</button>
                                                    {isSubmitting && !this.state.paymentCompleted &&
                                                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                    }
                                                </div>
                                                {this.state.paymentCompleted &&
                                                    <div className={'alert alert-info'}>{this.state.paymentMessage}</div>
                                                }
                                                {status &&
                                                    <div className={'alert alert-danger'}>{status}</div>
                                                }
                                            </>
                                        }
                                        {!this.state.walletActivated &&
                                            <div className="form-row">
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="walletMessage">{this.state.walletMessage}</label>
                                                </div>
                                            </div>
                                        }
                                    </Form>
                                )}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>);
    }
};
export default AddFunds;