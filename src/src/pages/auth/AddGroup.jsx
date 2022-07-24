import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';

class AddGroup extends Component {
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
                            <Card.Title as="h5">Add Group</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                initialValues={{
                                    groupName: ''
                                }}
                                validationSchema={Yup.object().shape({
                                    groupName: Yup.string().required('This field is required')
                                })}
                                onSubmit={({ groupName }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    AuthenticationService.addGroup(groupName)
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
                                                <label htmlFor="groupName">Group Name</label>
                                                <Field name="groupName" type="text" className={'form-control' + (errors.groupName && touched.groupName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="groupName" component="div" className="invalid-feedback" />
                                            </div>
                                        </div>
                                        <div className="form-group ">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Add Group</button>
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
export default AddGroup;