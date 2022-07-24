import React, { Component } from 'react';
import Select from 'react-select';
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { LocationService } from '../../services/LocationService';
import { CompanyService } from '../../services/CompanyService';
import { CustomSwitch } from '../../components/CustomSwitch';
import { ref } from 'yup';

class RegisterUser extends Component {
    constructor(props) {
        super(props);

        this.state = {
            fullName: '',
            userName: '',
            email: '',
            password: '',
            confirmPassword: '',
            phoneNumber: '',
            role:
                AuthenticationService.currentUserValue && AuthenticationService.currentUserValue.role == AuthenticationService.clientAdmin
                    ? AuthenticationService.clientUser
                    : '',
            createNewCompany: false,
            companyName: '',
            address: '',
            country: 0,
            state: 0,
            pan: '',
            pincode: '',
            companyId: 0,
            countries: [],
            states: [],
            roles: [],
            companies: [],
            roundFec: [],
            roundOffFactorId: 0,

        };

        this.onTextChange = this.onTextChange.bind(this);
        this.onCheckBoxChange = this.onCheckBoxChange.bind(this);
        this.onDropDownChange = this.onDropDownChange.bind(this);

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



        LocationService.getCountry().then((countries) => {
            var ret = [];
            countries.map((country) => {
                ret.push({ label: country.countryName, value: country.id });
            });

            this.setState({ countries: ret });
        });
        AuthenticationService.getRoles().then((x) => {
            var ret = [];
            x.map((role) => {
                ret.push({ label: role.roleName, value: role.roleName });
            });

            this.setState({ roles: ret });
        });

        if (
            AuthenticationService.currentUserValue &&
            (AuthenticationService.currentUserValue.role == AuthenticationService.admin ||
                AuthenticationService.currentUserValue.role == AuthenticationService.superAdmin)
        ) {
            CompanyService.getCompanies().then((x) => {
                var ret = [];
                x.map((company) => {
                    ret.push({ label: company.companyName, value: company.id });
                });

                this.setState({ companies: ret });
            });
        }
    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onCheckBoxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    };

    onDropDownChange(value, action) {

        this.setState({ [action.name]: value.value });
        if (value.value == "ClientAdmin") {
            this.setState({ createNewCompany: true })
        }
        if (action.name == 'RoundOffFactor') {
            this.setState({ roundOffFactorId: value.value })
        }
        if (action.name == 'role') {
            CompanyService.getRoundOffFactors().then((ref) => {
                var ret = [];
                ref.map((roundFec) => {
                    ret.push({ label: roundFec.factor, value: roundFec.id });
                })
                this.setState({ roundFec: ret });
            });
        }
        if (action.name == 'country') {
            //call getstates api.
            LocationService.getStates(value.value).then((states) => {
                var ret = [];
                states.map((state) => {
                    ret.push({ label: state.stateName, value: { label: state.stateName, value: state.id } });
                });

                this.setState({ states: ret, state: 0 });
            });
        }
    }

    render() {
        return (
            <>
                <Row>
                    <Col>
                        <Card>
                            <Card.Header>
                                <Card.Title as="h5">Register User</Card.Title>
                            </Card.Header>
                            <Card.Body>
                                <Formik
                                    enableReinitialize
                                    initialValues={{
                                        fullName: this.state.fullName,
                                        userName: this.state.userName,
                                        email: this.state.email,
                                        password: this.state.password,
                                        confirmPassword: this.state.confirmPassword,
                                        phoneNumber: this.state.phoneNumber,
                                        loggedInRole: AuthenticationService.currentUserValue && AuthenticationService.currentUserValue.role,
                                        role: this.state.role,
                                        createNewCompany: this.state.createNewCompany,
                                        companyName: this.state.companyName,
                                        companyId: this.state.companyId,
                                        address: this.state.address,
                                        country: this.state.country,
                                        state: this.state.state.value,
                                        pan: this.state.pan,
                                        pincode: this.state.pincode,
                                        roundOffFactorId: this.state.roundOffFactorId
                                    }}
                                    validationSchema={Yup.object().shape({
                                        fullName: Yup.string().required('This field is required'),
                                        userName: Yup.string().required('This field is required'),
                                        email: Yup.string().when(['role', 'loggedInRole'], {
                                            is: (role, loggedInRole) =>
                                                role == AuthenticationService.clientAdmin &&
                                                (loggedInRole == AuthenticationService.admin || loggedInRole == AuthenticationService.superAdmin),
                                            then: Yup.string().email('Please enter a valid email').required('This field is required')
                                        }),
                                        password: Yup.string().required('This field is required'),
                                        confirmPassword: Yup.string()
                                            .required('This field is required')
                                            .oneOf([Yup.ref('password'), null], 'Passwords must match'),
                                        phoneNumber: Yup.string().required('This field is required'),
                                        role: Yup.string().required('Please select a value'),
                                        loggedInRole: Yup.string(),
                                        address: Yup.string().when('createNewCompany', {
                                            is: true,
                                            then: Yup.string().required('This field is required')
                                        }),
                                        companyId: Yup.number().when(['role', 'loggedInRole'], {
                                            is: (role, loggedInRole) =>
                                                role == AuthenticationService.clientUser &&
                                                loggedInRole != AuthenticationService.clientAdmin,
                                            then: Yup.number().min(1, 'Please select a value')
                                        }),
                                        companyName: Yup.string().when('createNewCompany', {
                                            is: true,
                                            then: Yup.string().required('This field is required')
                                        }),
                                        country: Yup.number().when('createNewCompany', {
                                            is: true,
                                            then: Yup.number().min(1, 'This field is required')
                                        }),
                                        state: Yup.number().when('createNewCompany', {
                                            is: true,
                                            then: Yup.number().min(1, 'This field is required')
                                        }),
                                        pan: Yup.string().when('createNewCompany', {
                                            is: true,
                                            then: Yup.string().required('This field is required')
                                        })
                                    })}
                                    onSubmit={(
                                        {
                                            fullName,
                                            userName,
                                            email,
                                            password,
                                            confirmPassword,
                                            phoneNumber,
                                            createNewCompany,
                                            pan,
                                            companyName,
                                            address,
                                            country,
                                            state,
                                            role,
                                            pincode,
                                            companyId,
                                            roundOffFactorId
                                        },
                                        { setStatus, setSubmitting }
                                    ) => {
                                        setStatus();

                                        AuthenticationService.checkUsername(userName).then(
                                            (response) => {
                                                console.log(response);
                                                if (!response.isUserExists) {

                                                    if (this.state.role == AuthenticationService.clientAdmin) {
                                                        AuthenticationService.createUserWithCompany(
                                                            fullName,
                                                            userName,
                                                            email,
                                                            password,
                                                            confirmPassword,
                                                            phoneNumber,
                                                            role,
                                                            companyName,
                                                            pan,
                                                            address,
                                                            country,
                                                            state,
                                                            pincode,
                                                            roundOffFactorId
                                                        ).then(
                                                            (response) => {
                                                                const { from } = this.props.location.state || { from: { pathname: '/' } };
                                                                this.props.history.push(from);
                                                            },
                                                            (error) => {
                                                                setSubmitting(false);
                                                                setStatus(error);
                                                            }
                                                        );

                                                    }
                                                    else {
                                                        if (this.state.role != AuthenticationService.clientUser) {

                                                            this.setState({ companyId: 0 }, (_) => {
                                                                AuthenticationService.createUser(
                                                                    fullName,
                                                                    userName,
                                                                    password,
                                                                    confirmPassword,
                                                                    phoneNumber,
                                                                    role,
                                                                    companyId
                                                                ).then(
                                                                    (response) => {
                                                                        const { from } = this.props.location.state || {
                                                                            from: { pathname: '/' }
                                                                        };
                                                                        this.props.history.push(from);
                                                                    },
                                                                    (error) => {
                                                                        setSubmitting(false);
                                                                        setStatus(error);
                                                                    }
                                                                );
                                                            });
                                                        }
                                                        if (this.state.role == AuthenticationService.clientUser) {
                                                            AuthenticationService.createUser(
                                                                fullName,
                                                                userName,
                                                                password,
                                                                confirmPassword,
                                                                phoneNumber,
                                                                role,
                                                                companyId
                                                            ).then(
                                                                (response) => {
                                                                    const { from } = this.props.location.state || { from: { pathname: '/' } };
                                                                    this.props.history.push(from);
                                                                },
                                                                (error) => {
                                                                    setSubmitting(false);
                                                                    setStatus(error);
                                                                }
                                                            );
                                                        }

                                                    }
                                                } else {
                                                    setSubmitting(false);
                                                    setStatus(response.message);
                                                }
                                            },
                                            (error) => {
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
                                                    <Field
                                                        name="fullName"
                                                        type="text"
                                                        onChange={this.onTextChange}
                                                        className={
                                                            'form-control' + (errors.fullName && touched.fullName ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="userName">Username</label>
                                                    <Field
                                                        name="userName"
                                                        type="text"
                                                        onChange={this.onTextChange}
                                                        className={
                                                            'form-control' + (errors.userName && touched.userName ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="userName" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="password">Password</label>
                                                    <Field
                                                        name="password"
                                                        type="password"
                                                        onChange={this.onTextChange}
                                                        className={
                                                            'form-control' + (errors.password && touched.password ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="password" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="confirmPassword">Confirm password</label>
                                                    <Field
                                                        name="confirmPassword"
                                                        type="password"
                                                        onChange={this.onTextChange}
                                                        className={
                                                            'form-control' +
                                                            (errors.confirmPassword && touched.confirmPassword ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="confirmPassword" component="div" className="invalid-feedback" />
                                                </div>
                                                <div className="form-group col-md-12">
                                                    <label htmlFor="phoneNumber">Phone Number</label>
                                                    <Field
                                                        name="phoneNumber"
                                                        type="text"
                                                        onChange={this.onTextChange}
                                                        className={
                                                            'form-control' +
                                                            (errors.phoneNumber && touched.phoneNumber ? ' is-invalid' : '')
                                                        }
                                                    />
                                                    <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                                                </div>
                                                {AuthenticationService.currentUserValue &&
                                                    AuthenticationService.currentUserValue.role != AuthenticationService.clientAdmin && (
                                                        <>
                                                            <div className="form-group col-md-12">
                                                                <label htmlFor="role">Role</label>
                                                                <Select
                                                                    name="role"
                                                                    onChange={this.onDropDownChange}
                                                                    options={this.state.roles}
                                                                    classNamePrefix="select"
                                                                    className={
                                                                        'form-control' + (errors.role && touched.role ? ' is-invalid' : '')
                                                                    }
                                                                />
                                                                <ErrorMessage name="role" component="div" className="invalid-feedback" />
                                                            </div>

                                                            {this.state.role == AuthenticationService.clientUser && (
                                                                <div className="form-group col-md-12">
                                                                    <label htmlFor="companyId">Company</label>
                                                                    <Select
                                                                        name="companyId"
                                                                        onChange={this.onDropDownChange}
                                                                        options={this.state.companies}
                                                                        classNamePrefix="select"
                                                                        className={
                                                                            'form-control' +
                                                                            (errors.companyId && touched.companyId ? ' is-invalid' : '')
                                                                        }
                                                                    />
                                                                    <ErrorMessage
                                                                        name="companyId"
                                                                        component="div"
                                                                        className="invalid-feedback"
                                                                    />
                                                                </div>
                                                            )}
                                                            {this.state.createNewCompany &&
                                                                this.state.role == AuthenticationService.clientAdmin && (
                                                                    <>
                                                                        <div className="form-group col-md-12">
                                                                            <label htmlFor="email">Email</label>
                                                                            <Field
                                                                                name="email"
                                                                                type="text"
                                                                                onChange={this.onTextChange}
                                                                                className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')}
                                                                            />
                                                                            <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                                                        </div>
                                                                        <div className="form-group col-md-12">
                                                                            <label htmlFor="companyName">Company Name</label>
                                                                            <Field
                                                                                name="companyName"
                                                                                type="text"
                                                                                onChange={this.onTextChange}
                                                                                className={
                                                                                    'form-control' +
                                                                                    (errors.companyName && touched.companyName
                                                                                        ? ' is-invalid'
                                                                                        : '')
                                                                                }
                                                                            />
                                                                            <ErrorMessage
                                                                                name="companyName"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                        <div className="form-group col-md-12">
                                                                            <label htmlFor="address">Address</label>
                                                                            <Field
                                                                                name="address"
                                                                                type="text"
                                                                                onChange={this.onTextChange}
                                                                                placeholder="Address"
                                                                                className={
                                                                                    'form-control' +
                                                                                    (errors.address && touched.address ? ' is-invalid' : '')
                                                                                }
                                                                            />
                                                                            <ErrorMessage
                                                                                name="address"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                        <div className="form-group col-md-4">
                                                                            <label htmlFor="country">Country</label>
                                                                            <Select
                                                                                name="country"
                                                                                onChange={this.onDropDownChange}
                                                                                options={this.state.countries}
                                                                                classNamePrefix="select"
                                                                                className={
                                                                                    'form-control' +
                                                                                    (errors.country && touched.country ? ' is-invalid' : '')
                                                                                }
                                                                            />
                                                                            <ErrorMessage
                                                                                name="country"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                        <div className="form-group col-md-4">
                                                                            <label htmlFor="state">State</label>
                                                                            <Select
                                                                                name="state"
                                                                                onChange={this.onDropDownChange}
                                                                                value={this.state.state}
                                                                                options={this.state.states}
                                                                                classNamePrefix="select"
                                                                                className={
                                                                                    'form-control' +
                                                                                    (errors.state && touched.state ? ' is-invalid' : '')
                                                                                }
                                                                            />
                                                                            <ErrorMessage
                                                                                name="state"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>

                                                                        <div className="form-group col-md-4">
                                                                            <label htmlFor="pincode">Pincode</label>
                                                                            <Field
                                                                                name="pincode"
                                                                                type="text"
                                                                                onChange={this.onTextChange}
                                                                                placeholder="Pincode"
                                                                                className={
                                                                                    'form-control' +
                                                                                    (errors.pincode && touched.pincode ? ' is-invalid' : '')
                                                                                }
                                                                            />
                                                                            <ErrorMessage
                                                                                name="pincode"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                            />
                                                                        </div>
                                                                        <div className="form-group col-md-12">
                                                                            <label htmlFor="pan">PAN</label>
                                                                            <Field
                                                                                name="pan"
                                                                                type="text"
                                                                                onChange={this.onTextChange}
                                                                                className={
                                                                                    'form-control' +
                                                                                    (errors.pan && touched.pan ? ' is-invalid' : '')
                                                                                }
                                                                            />
                                                                            <ErrorMessage
                                                                                name="pan"
                                                                                component="div"
                                                                                className="invalid-feedback"
                                                                            />

                                                                        </div>
                                                                        <div className="form-group col-md-12">
                                                                            <label htmlFor="role">RoundOffFactor</label>
                                                                            <Select
                                                                                name="RoundOffFactor"
                                                                                onChange={this.onDropDownChange}
                                                                                options={this.state.roundFec}
                                                                                classNamePrefix="select"
                                                                                className={
                                                                                    'form-control' + (errors.role && touched.role ? ' is-invalid' : '')
                                                                                }
                                                                            />
                                                                            <ErrorMessage name="role" component="div" className="invalid-feedback" />
                                                                        </div>
                                                                    </>
                                                                )}
                                                        </>
                                                    )}
                                            </div>
                                            <div className="form-group ">
                                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                                    Add User
                                                </button>
                                                {isSubmitting && (
                                                    <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                                )}
                                            </div>
                                            {status && <div className={'alert alert-danger'}>{status}</div>}
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
            </>
        );
    }
}
export default RegisterUser;
