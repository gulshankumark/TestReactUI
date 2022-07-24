import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { LocationService } from '../../services/LocationService';
import { GroupsService } from '../../services/GroupsService';
import { LedgerService } from '../../services/LedgerService';
import { Button } from 'devextreme-react/button';

class CreateAccountGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            groupId: 0,
            description: '',

            groups: [],
            showhidebackButton: 0,
            show: true
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.RedirectPage = this.RedirectPage.bind(this);
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
        //AuthenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
        this.setState({ showhidebackButton: this.props.id });
        GroupsService.getAccountGroups().then((groups) => {
            var ret = [];
            groups.map((group) => {
                ret.push({ label: group.name, value: group.id });
            });

            this.setState({ groups: ret });
        });
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onCheckBoxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    };
    RedirectPage() {
        const { from } = this.props.location.state || { from: { pathname: '/app/groups/ViewGroups' } };
        this.props.history.push(from);
    }

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'country') {
            //call getstates api.
            LocationService.getState(value.value).then((states) => {
                var ret = [];
                states.map((states) => {
                    ret.push({ label: states.stateName, states: states.id });
                });

                this.setState({ states: ret });
            });
        } else if (action.name == 'groupId') {
            LedgerService.getSections(value.value).then((sections) => {
                this.setState({ activeSections: sections });
            });
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
                                    <Card.Title as="h4">Create Account Groups</Card.Title>
                                    {this.state.showhidebackButton == undefined && (
                                        <Button className="float-right" type="success" text="Back" onClick={this.RedirectPage}></Button>
                                    )}
                                </Card.Header>
                            </Card>
                        )}
                        <Formik
                            enableReinitialize
                            initialValues={{
                                id: this.state.id,
                                name: this.state.name,
                                groupId: this.state.groupId,
                                description: this.state.description
                            }}
                            validationSchema={Yup.object().shape({
                                name: Yup.string().required('This field is required'),
                                groupId: Yup.number().min(1, 'This field is required')
                            })}
                            onSubmit={(
                                { name, groupId, description },

                                { setStatus, setSubmitting }
                            ) => {
                                setStatus();
                                GroupsService.saveAccountGroups(name, groupId, description).then(
                                    (response) => {
                                        if (this.state.showhidebackButton == 1) {
                                            setSubmitting(false);
                                            this.setState({ alert: true, show: false });
                                            return;
                                        }
                                        const { from } = this.props.location.state || { from: { pathname: '/app/groups/ViewGroups' } };
                                        this.props.history.push(from);
                                    },
                                    (error) => {
                                        setSubmitting(false);
                                        setStatus(error);
                                    }
                                );
                            }}
                            render={({ values, errors, status, touched, isSubmitting }) => (
                                <Form>
                                    {this.state.show == true && (
                                        <Card>
                                            <Card.Header>
                                                <Card.Title as="h5">Create Group</Card.Title>
                                            </Card.Header>
                                            <Card.Body>
                                                <div className="form-row">
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="name">Name</label>
                                                        <Field
                                                            name="name"
                                                            type="text"
                                                            onChange={this.onTextChange}
                                                            className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')}
                                                        />
                                                        <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="groupId">Under Group</label>
                                                        <Select
                                                            name="groupId"
                                                            onChange={this.onDropDownChange}
                                                            options={this.state.groups}
                                                            classNamePrefix="select"
                                                            className={
                                                                'form-control' + (errors.groupId && touched.groupId ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="groupId" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label htmlFor="description">Description</label>
                                                        <Field
                                                            name="description"
                                                            type="text"
                                                            onChange={this.onTextChange}
                                                            className={
                                                                'form-control' +
                                                                (errors.description && touched.description ? ' is-invalid' : '')
                                                            }
                                                        />
                                                        <ErrorMessage name="description" component="div" className="invalid-feedback" />
                                                    </div>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    )}
                                    {this.state.show == true && (
                                        <div className="form-group ">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                Create Group
                                            </button>
                                            {isSubmitting && (
                                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                            )}
                                        </div>
                                    )}
                                    {status && <div className={'alert alert-danger'}>{status}</div>}
                                    {/* <p>
                                    <pre>{JSON.stringify(values, null, 2)}</pre>
                                </p> */}
                                </Form>
                            )}
                        />
                        {this.state.alert == true && (
                            <div class="card">
                                <div class="card-header">Createn AccountGroups</div>
                                <div class="card-body">
                                    <div className="alert alert-success">
                                        <div style={{ color: 'green' }}>
                                            <strong>Success!</strong> AccountGroups Added Successfully.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Col>
                </Row>
            </>
        );
    }
}
export default CreateAccountGroup;
