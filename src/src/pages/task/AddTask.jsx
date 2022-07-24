import React, { Component } from 'react';
import Select from "react-select";
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { TaskService } from '../../services/TaskService';

class AddTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            clientName: '',
            startDate: '',
            endDate: '',
            taskName: '',
            description: '',
            service: 0,

            allClients: [],
            userDetails: {},
            services: [],
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);

        var currentUser = AuthenticationService.currentUserValue;
        // redirect to login if not logged in
        if (!currentUser) {
            this.props.history.push(Config.signInPath);
        }

        if (!currentUser || !(currentUser.isAdmin || currentUser.isSuperAdmin)) {
            AuthenticationService.logout();
            this.props.history.push(Config.signInPath);
        }
    }

    componentDidMount() {
        AuthenticationService.getClientUsersOnly().then(x => {
            var ret = [];
            x.map(
                user => {
                    ret.push({ label: `${user.fullName} (${user.email}) (${user.companyName})`, value: user.email });
                }
            );
            this.setState({ allClients: ret });
        });
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'clientName') {
            AuthenticationService.getClientServices(value.value).then(x => {
                var ret = [];
                x.map(service => {
                    ret.push({ label: service.serviceName, value: service.id });
                }
                );
                this.setState({ services: ret });
            });
        }
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Add Task</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    clientName: this.state.clientName,
                                    startDate: this.state.startDate,
                                    endDate: this.state.endDate,
                                    service: this.state.service,
                                    taskName: this.state.taskName,
                                    description: this.state.description
                                }}
                                validationSchema={Yup.object().shape({
                                    clientName: Yup.string().required('This field is required'),
                                    taskName: Yup.string().required('This field is required'),
                                    service: Yup.number().min(1, 'Please select a value'),
                                    description: Yup.string().required('This field is required'),
                                    startDate: Yup.date().required('This field is required'),
                                    endDate: Yup.date().required('This field is required').min(Yup.ref('startDate'), "End date can't be before start date")
                                })}
                                onSubmit={({ clientName, startDate, endDate, service, taskName, description }, { setStatus, setSubmitting }) => {
                                    setStatus();
                                    TaskService.addImmediateTask(taskName, description, startDate, endDate, clientName, service)
                                        .then(
                                            response => {
                                                if (!response.status) {
                                                    setSubmitting(false);
                                                    setStatus('Task was not added to the database.');
                                                }
                                                else {
                                                    const { from } = this.props.location.state || { from: { pathname: "/app/task/showtasks" } };
                                                    this.props.history.push(from);
                                                }
                                            },
                                            error => {
                                                setSubmitting(false);
                                                setStatus(error);
                                            }
                                        );
                                }}
                                render={({ values, errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="clientName">Client</label>
                                                <Select name="clientName" onChange={this.onDropDownChange} options={this.state.allClients} classNamePrefix="select" className={'form-control' + (errors.clientName && touched.clientName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="clientName" component="div" className="invalid-feedback" />
                                            </div>
                                            {this.state.clientName && this.state.clientName != '' &&
                                                <>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="startDate">Start Date</label>
                                                        <Field name="startDate" type="datetime-local" onChange={this.onTextChange} className={'form-control' + (errors.startDate && touched.startDate ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="startDate" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="endDate">End Date</label>
                                                        <Field name="endDate" type="datetime-local" onChange={this.onTextChange} className={'form-control' + (errors.endDate && touched.endDate ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="endDate" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="service">Service</label>
                                                        <Select name="service" onChange={this.onDropDownChange} options={this.state.services} classNamePrefix="select" className={'form-control' + (errors.service && touched.service ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="service" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="taskName">Task Name</label>
                                                        <Field name="taskName" type="text" onChange={this.onTextChange} className={'form-control' + (errors.taskName && touched.taskName ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="taskName" component="div" className="invalid-feedback" />
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
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Create Task &amp; Complete</button>
                                            {isSubmitting &&
                                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            }
                                        </div>
                                        {status &&
                                            <div className={'alert alert-danger'}>{status}</div>
                                        }
                                        {/* <p>
                                            <pre>{JSON.stringify(values, null, 2)}</pre>
                                        </p> */}
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
export default AddTask;