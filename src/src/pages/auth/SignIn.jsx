import  React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './../../assets/scss/style.scss';
import Breadcrumb from '../../App/layout/AdminLayout/Breadcrumb';
import logoDark from '../../assets/images/logo-dark.png';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { withRouter } from "react-router-dom";

import { AuthenticationService } from '../../services/AuthenticationService';
class SignIn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogo: true
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
                                            userName: '',
                                            password: ''
                                        }}
                                        validationSchema={Yup.object().shape({
                                            userName: Yup.string().required('This field is required'),
                                            password: Yup.string().required('This field is required')
                                        })}
                                        onSubmit={({ userName, password }, { setStatus, setSubmitting }) => {
                                            setStatus();
                                            AuthenticationService.login(userName, password)
                                                .then(
                                                    _ => {
                                                        this.props.history.push('/');
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
                                                <h4 className="m-b-10">Login</h4>
                                                <div className="form-group">
                                                    <Field name="userName" placeholder="User Name" type="text" className={'form-control' + (errors.userName && touched.userName ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="userName" component="div" className="invalid-feedback" />
                                                </div>

                                                <div className="form-group">
                                                    <Field name="password" placeholder="Password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group">
                                                    <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Login</button>
                                                    {isSubmitting &&
                                                        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                    }
                                                </div>
                                                <p className="mb-2 text-muted">
                                                    Forgot password?{' '}
                                                    <NavLink to="/app/auth/forgetPassword" className="f-w-400">
                                                        Reset
                                                    </NavLink>
                                                </p>
                                                {status &&
                                                    <div className={'alert alert-danger'}>{status}</div>
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
export default withRouter(SignIn);
