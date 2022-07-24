import React, { Component } from 'react';
import Select from "react-select";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Row, Col, Card } from 'react-bootstrap';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { WalletService } from '../../services/WalletService';

class UpdateBalance extends Component {
    constructor(props) {
        super(props);

        this.state = {
            amount: 0.0,
            description: '',
            users: [],
            creditDebit: '',
            creditDebitOptions: [],
            bbscService: '',
            bbscServices: [],
            walletId: {},
            isUserSelected: false
        };

        this.fillUsers = this.fillUsers.bind(this);
        this.fillServices = this.fillServices.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.onTextChange = this.onTextChange.bind(this);
        this.fillCreditDebit = this.fillCreditDebit.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
        // redirect to login if not logged in
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
        }

        if (!(currentUser.role == AuthenticationService.superAdmin ||
            currentUser.role == AuthenticationService.admin)) {
            AuthenticationService.logout();
            this.props.history.push(Config.signInPath);
        }
    }

    componentDidMount() {
        WalletService.getUsersForWallet().then(this.fillUsers);
        WalletService.getBbscServices().then(this.fillServices);
        this.fillCreditDebit();
    }

    fillCreditDebit() {
        var ret = [];
        ret.push({ label: "Credit", value: true });
        ret.push({ label: "Debit", value: false });
        this.setState({ creditDebitOptions: ret });
    }

    fillServices(services) {
        var ret = [];
        if (services.bbscServices != null) {
            services.bbscServices.map(
                service => {
                    ret.push({ label: service, value: service });
                }
            );
        }
        this.setState({ bbscServices: ret });
    }

    fillUsers(users) {
        var ret = [];
        users.map(
            user => {
                if (user.hasWallet) {
                    ret.push({
                        label: `${user.fullName} (${user.email}) (${user.companyName})`,
                        value: {
                            label: `${user.fullName} (${user.email}) (${user.companyName})`, value: user.walletId
                        }
                    });
                }
            }
        );
        this.setState({ users: ret });
    }

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'walletId') {
            this.setState({ isUserSelected: true });
        }
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card >
                        <Card.Header>
                            <Card.Title as="h5">Update Wallet Balance</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik enableReinitialize
                                initialValues={{
                                    bbscService: this.state.bbscService,
                                    walletId: this.state.walletId,
                                    creditDebit: this.state.creditDebit,
                                    amount: this.state.amount,
                                    description: this.state.description
                                }}
                                validationSchema={Yup.object().shape({
                                    bbscService: Yup.string().required('This field is required'),
                                    creditDebit: Yup.boolean().required('This field is required'),
                                    description: Yup.string().required('This field is required')
                                })}
                                onSubmit={({ bbscService, walletId, creditDebit, amount, description }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    WalletService.updateBalance(walletId.value, amount, creditDebit, bbscService, description)
                                        .then(
                                            response => {
                                                const { from } = this.props.location.state || { from: { pathname: "/" } };
                                                this.props.history.push(from);
                                            },
                                            error => {
                                                setSubmitting(false);
                                                setStatus(error);
                                            }
                                        );
                                }}
                                render={({ errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="walletId">User</label>
                                                <Select name="walletId" onChange={this.onDropDownChange} options={this.state.users} classNamePrefix="select" className={'form-control' + (errors.walletId && touched.walletId ? ' is-invalid' : '')} />
                                                <ErrorMessage name="walletId" component="div" className="invalid-feedback" />
                                            </div>
                                            {this.state.isUserSelected &&
                                                <>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="bbscService">BBSC Service</label>
                                                        <Select name="bbscService" onChange={this.onDropDownChange} options={this.state.bbscServices} classNamePrefix="select"
                                                            className={'form-control' + (errors.bbscService && touched.bbscService ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="bbscService" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="creditDebit">Credit/Debit</label>
                                                        <Select name="creditDebit" onChange={this.onDropDownChange} options={this.state.creditDebitOptions} classNamePrefix="select"
                                                            className={'form-control' + (errors.creditDebit && touched.creditDebit ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="creditDebit" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="amount">Amount</label>
                                                        <Field name="amount" type="number" onChange={this.onTextChange} min='0.01' step='0.01'
                                                            className={'form-control' + (errors.amount && touched.amount ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="amount" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="description">Description</label>
                                                        <Field name="description" type="text" onChange={this.onTextChange} className={'form-control' + (errors.description && touched.description ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div className="form-group ">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update Balance</button>
                                            {isSubmitting &&
                                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            }
                                        </div>
                                        {status &&
                                            <div className={'alert alert-danger'}>{status}</div>
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
export default UpdateBalance;