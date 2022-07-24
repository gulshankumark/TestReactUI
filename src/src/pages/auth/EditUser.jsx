import React, { Component } from 'react';
import Select from "react-select";
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { CustomSwitch } from '../../components/CustomSwitch';

class EditUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            companyName: '',
            email: '',
            departmentEmail: '',
            departmentPhoneNumber: '',
            pan: '',
            tan: '',
            gstin: '',
            phoneNumber: '',
            address: '',
            country: '',
            state: '',
            hasGroup: false,
            groupId: {},
            pan: '',
            tan: '',
            gstin: '',
            serviceIds: [],
            feesFrequencyId: {},
            fees: 0.0,

            userDetails: {},

            userGroupNameLabel: '',
            feesFrequencyLabel: '',

            feesFrequencies: [],
            groups: [],
            services: []
        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);
        this.setServices = this.setServices.bind(this);
        this.userChanged = this.userChanged.bind(this);

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
        AuthenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
        AuthenticationService.getFeesFrequency().then(x => {
            var ret = [];
            x.map(
                fee => {
                    ret.push({ label: fee.feeType, value: { label: fee.feeType, value: fee.id } });
                }
            );
            this.setState({ feesFrequencies: ret });
        });
        AuthenticationService.getGroups().then(x => {
            var ret = [];
            x.map(
                group => {
                    ret.push({ label: group.groupName, value: { label: group.groupName, value: group.id } })
                }
            );
            this.setState({ groups: ret });
        });
        AuthenticationService.getServices().then(x => {
            this.setState({ services: x });
        })

        if (this.props.history.location.state != null) {
            this.userChanged(this.props.history.location.state.email);
            return;
        }
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onCheckBoxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    }

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
    }

    userChanged(user) {
        this.setState({ selectedUser: user });

        AuthenticationService.getUserDetails(user).then(x => {
            this.setState({
                fullName: x.fullName,
                companyName: x.companyName,
                email: x.email,
                departmentEmail: x.departmentEmail,
                departmentPhoneNumber: x.departmentPhoneNumber,
                pan: x.pan,
                tan: x.tan,
                gstin: x.gstin,
                phoneNumber: x.phoneNumber,
                address: x.address,
                country: x.country,
                state: x.state,
                hasGroup: x.hasGroup,
                pan: x.pan,
                tan: x.tan,
                gstin: x.gstin,
                serviceIds: x.services,
                fees: x.fees,
                userDetails: x
            }, _ => {
                if (x.hasGroup) {
                    for (var i = 0; i < this.state.groups.length; i++) {
                        var obj = this.state.groups[i];
                        if (obj.value.value == x.groupId) {
                            this.setState({ groupId: obj.value });
                            break;
                        }
                    }
                }

                for (var i = 0; i < this.state.feesFrequencies.length; i++) {
                    var obj = this.state.feesFrequencies[i];
                    if (obj.value.value == x.feesFrequencyId) {
                        this.setState({ feesFrequencyId: obj.value }, _ => {
                        });
                        break;
                    }
                }

                var newServices = [];
                for (var i = 0; i < this.state.services.length; i++) {
                    var obj = this.state.services[i];
                    var en = false;
                    for (var j = 0; j < this.state.serviceIds.length; j++) {
                        if (obj.id === this.state.serviceIds[j]) {
                            en = true;
                            break;
                        }
                    }

                    if (en) {
                        newServices.push({
                            id: obj.id,
                            serviceName: obj.serviceName,
                            enabled: true
                        });
                    }
                    else {
                        newServices.push({
                            id: obj.id,
                            serviceName: obj.serviceName,
                            enabled: false
                        });
                    }
                }

                this.setState({ services: newServices });
            });
        });
    }

    setServices(serv) {
        let serviceId = serv.target.defaultValue;
        let checked = serv.target.checked;
        var newServices = [];
        for (var i = 0; i < this.state.services.length; i++) {
            var obj = this.state.services[i];
            if (obj.id == serviceId) {
                newServices.push({
                    id: obj.id,
                    serviceName: obj.serviceName,
                    enabled: checked
                });
                continue;
            }

            newServices.push({
                id: obj.id,
                serviceName: obj.serviceName,
                enabled: obj.enabled
            });
        }

        this.setState({ services: newServices });
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Edit User</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    fullName: this.state.fullName,
                                    companyName: this.state.companyName,
                                    email: this.state.email,
                                    departmentEmail: this.state.departmentEmail,
                                    departmentPhoneNumber: this.state.departmentPhoneNumber,
                                    phoneNumber: this.state.phoneNumber,
                                    address: this.state.address,
                                    country: this.state.country,
                                    state: this.state.state,
                                    hasGroup: this.state.hasGroup,
                                    groupId: this.state.groupId,
                                    pan: this.state.pan,
                                    tan: this.state.tan,
                                    gstin: this.state.gstin,
                                    services: this.state.services,
                                    fees: this.state.fees,
                                    feesFrequencyId: this.state.feesFrequencyId
                                }}
                                validationSchema={Yup.object().shape({
                                    fullName: Yup.string().required('This field is required'),
                                    companyName: Yup.string().required('This field is required'),
                                    departmentEmail: Yup.string(),
                                    departmentPhoneNumber: Yup.string(),
                                    pan: Yup.string(),
                                    tan: Yup.string(),
                                    gstin: Yup.string(),
                                    phoneNumber: Yup.string().required('This field is required'),
                                    address: Yup.string().required('This field is required'),
                                    country: Yup.string().required('This field is required'),
                                    state: Yup.string().required('This field is required'),
                                    hasGroup: Yup.boolean()                                    
                                })}
                                onSubmit={({ fullName, companyName, email, departmentEmail, departmentPhoneNumber, pan, tan, gstin,
                                    phoneNumber, address, country, state, fees, feesFrequencyId, hasGroup, groupId, services },
                                    { setStatus, setSubmitting }) => {
                                    if (feesFrequencyId.value == 0 || (hasGroup && groupId.value == 0)) {
                                        setSubmitting(false);
                                        return;
                                    }

                                    var serviceIds = [];
                                    for (var i = 0; i < services.length; i++) {
                                        var obj = services[i];
                                        if (obj.enabled) {
                                            serviceIds.push(obj.id);
                                        }
                                    }

                                    setStatus();
                                    AuthenticationService.editUser(fullName, companyName, email, phoneNumber, address, departmentEmail, departmentPhoneNumber,
                                        country, state, pan, tan, gstin, fees, feesFrequencyId.value, hasGroup, groupId.value, serviceIds)
                                        .then(
                                            response => {
                                                if (!response.status) {
                                                    setSubmitting(false);
                                                    setStatus('Server error has occured, not able to update the details');
                                                }
                                                else {
                                                }
                                                this.props.history.push('/app/auth/viewusers');
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
                                                <label htmlFor="fullName">Full name</label>
                                                <Field name="fullName" type="text" onChange={this.onTextChange} className={'form-control' + (errors.fullName && touched.fullName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="companyName">Company name</label>
                                                <Field name="companyName" type="text" onChange={this.onTextChange} className={'form-control' + (errors.companyName && touched.companyName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="companyName" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="email">Email</label>
                                                <Field name="email" type="text" disabled={true} onChange={this.onTextChange} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="phoneNumber">Phone Number</label>
                                                <Field name="phoneNumber" type="text" onChange={this.onTextChange} className={'form-control' + (errors.phoneNumber && touched.phoneNumber ? ' is-invalid' : '')} />
                                                <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="departmentEmail">Department Email</label>
                                                <Field name="departmentEmail" type="text" onChange={this.onTextChange} className={'form-control' + (errors.deptartmentEmail && touched.deptartmentEmail ? ' is-invalid' : '')} />
                                                <ErrorMessage name="departmentEmail" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="departmentPhoneNumber">Department Phone No</label>
                                                <Field name="departmentPhoneNumber" type="text" onChange={this.onTextChange} className={'form-control' + (errors.departmentPhoneNumber && touched.departmentPhoneNumber ? ' is-invalid' : '')} />
                                                <ErrorMessage name="departmentPhoneNumber" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="address">Address</label>
                                                <Field name="address" type="text" onChange={this.onTextChange} placeholder="Address" className={'form-control' + (errors.address && touched.address ? ' is-invalid' : '')} />
                                                <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <Field name="country" type="text" onChange={this.onTextChange} placeholder="Country" className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')} />
                                                <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-6">
                                                <Field name="state" type="text" onChange={this.onTextChange} placeholder="State" className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')} />
                                                <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                            </div>
                                            {!(this.state.userDetails.isAdmin || this.state.userDetails.isSuperAdmin) &&
                                                <>
                                                    <div className="form-group col-md-12">
                                                        <CustomSwitch checked={values.hasGroup} name="hasGroup" id="hasGroup" onChange={this.onCheckBoxChange} text="Has Group" />
                                                    </div>
                                                    {this.state.hasGroup &&
                                                        <div className="form-group col-md-12">
                                                            <label htmlFor="groupId">Group</label>
                                                            <Select name="groupId" onChange={this.onDropDownChange} options={this.state.groups}
                                                                classNamePrefix="select" className={'form-control' + (errors.groupId && touched.groupId ? ' is-invalid' : '')}
                                                                value={this.state.groupId}
                                                            />
                                                            <ErrorMessage name="groupId" component="div" className="invalid-feedback" />
                                                        </div>
                                                    }
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="pan">PAN</label>
                                                        <Field name="pan" type="text" onChange={this.onTextChange} className={'form-control' + (errors.pan && touched.pan ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="pan" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="tan">TAN</label>
                                                        <Field name="tan" type="text" onChange={this.onTextChange} className={'form-control' + (errors.tan && touched.tan ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="tan" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="gstin">GSTIN</label>
                                                        <Field name="gstin" type="text" onChange={this.onTextChange} className={'form-control' + (errors.gstin && touched.gstin ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="gstin" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <div>
                                                            <label htmlFor="serviceIds">Services</label>
                                                        </div>
                                                        {this.state.services.map(service => {
                                                            return <div><CustomSwitch checked={service.enabled} name={`serviceIds${service.id}`} id={`serviceIds${service.id}`} value={service.id} onChange={this.setServices} text={service.serviceName} /></div>
                                                        })}
                                                        <ErrorMessage name="serviceIds" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="feesFrequencyId">Fees Frequency</label>
                                                        <Select name="feesFrequencyId" onChange={this.onDropDownChange} options={this.state.feesFrequencies}
                                                            classNamePrefix="select" className={'form-control' + (errors.feesFrequencyId && touched.feesFrequencyId ? ' is-invalid' : '')}
                                                            value={this.state.feesFrequencyId}
                                                        />
                                                        <ErrorMessage name="feesFrequencyId" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-12">
                                                        <label htmlFor="fees">Fees</label>
                                                        <Field name="fees" type="number" onChange={this.onTextChange} className={'form-control' + (errors.fees && touched.fees ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="fees" component="div" className="invalid-feedback" />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div className="form-group ">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update User</button>
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
export default EditUser;