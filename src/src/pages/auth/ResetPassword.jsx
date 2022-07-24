import React, { Component } from 'react';
import qs from 'qs';
import './../../assets/scss/style.scss';
import Breadcrumb from '../../App/layout/AdminLayout/Breadcrumb';
import logoDark from '../../assets/images/logo-dark.png';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";

import { AuthenticationService } from '../../services/AuthenticationService';
class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).userId,
            token: qs.parse(this.props.location.search, { ignoreQueryPrefix: true }).tokenId
        };
    }

    componentDidMount() {
        if (AuthenticationService.currentUserValue) {
            this.props.history.push('/');
        }
    }

    render() {
        return (<>
            <Breadcrumb />
            <div className="auth-wrapper">
                <div className="auth-content">
                    <div className="card">
                        <div className="row align-items-center text-center">
                            <div className="col-md-12">
                                <div className="card-body">
                                    <Formik
                                        initialValues={{
                                            userName: this.state.user,//Fill from url
                                            token: this.state.token,//Fill from url
                                            newPassword: '',
                                            confirmPassword: ''
                                        }}
                                        validationSchema={Yup.object().shape({
                                            newPassword: Yup.string().required('This field is required'),
                                            confirmPassword: Yup.string().required('This field is required')
                                        })}
                                        onSubmit={({ userName, token, newPassword, confirmPassword }, { setStatus, setSubmitting }) => {
                                            setStatus();
                                            AuthenticationService.resetPassword(userName, token, newPassword, confirmPassword)
                                                .then(
                                                    response => {
                                                        if (response.isSuccess) {
                                                            const { from } = this.props.location.state || { from: { pathname: "/" } };
                                                            this.props.history.push(from);
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
                                                <img src={logoDark} alt="" className="img-fluid mb-4" />
                                                <h4 className="m-b-10">Reset Password</h4>
                                                <div className="form-group">
                                                    <Field name="newPassword" placeholder="New Password" type="password" className={'form-control' + (errors.newPassword && touched.newPassword ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group">
                                                    <Field name="confirmPassword" placeholder="Confirm New Password" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting || this.state.submitted}>Reset Password</button>
                                                    {isSubmitting &&
                                                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                    }
                                                </div>
                                                {status &&
                                                    <div id="errorStatus" className={'alert alert-danger'}>{status}</div>
                                                }
                                            </Form>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>);
    }
};
export default withRouter(ResetPassword);