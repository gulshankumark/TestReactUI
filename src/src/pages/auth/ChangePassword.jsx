import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';

class ChangePassword extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        if (!AuthenticationService.currentUserValue) {
            this.props.history.push(Config.signInPath);
        }
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Change Password</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                initialValues={{
                                    userName: AuthenticationService.currentUserValue == null ? '' : AuthenticationService.currentUserValue.userName,
                                    oldPassword: '',
                                    newPassword: '',
                                    confirmPassword: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    oldPassword: Yup.string().required('This field is required'),
                                    newPassword: Yup.string().required('This field is required'),
                                    confirmPassword: Yup.string().required('This field is required').oneOf([Yup.ref('newPassword'), null], 'New passwords must match')
                                })}
                                onSubmit={({ userName, oldPassword, newPassword, confirmPassword }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    AuthenticationService.changePassword(oldPassword, newPassword, confirmPassword)
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
                                                <label htmlFor="oldPassword">Old Password</label>
                                                <Field name="oldPassword" type="password" className={'form-control' + (errors.oldPassword && touched.oldPassword ? ' is-invalid' : '')} />
                                                <ErrorMessage name="oldPassword" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="newPassword">New Password</label>
                                                <Field name="newPassword" type="password" className={'form-control' + (errors.newPassword && touched.newPassword ? ' is-invalid' : '')} />
                                                <ErrorMessage name="newPassword" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                                <Field name="confirmPassword" type="password" className={'form-control' + (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')} />
                                                <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="form-group ">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Change Password</button>
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
export default ChangePassword;