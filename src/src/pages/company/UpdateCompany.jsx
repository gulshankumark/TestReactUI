import React, { Component } from 'react';
import Select from "react-select";
import { Row, Col, Card } from 'react-bootstrap';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Config from '../../config';
import { AuthenticationService } from '../../services/AuthenticationService';
import { CompanyService } from '../../services/CompanyService';
import { LocationService } from '../../services/LocationService';
import { GstService } from '../../services/GstService';
import { CustomSwitch } from '../../components/CustomSwitch';
import * as moment from 'moment';

class UpdateCompany extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            aliasName: '',
            mailingName: '',
            address: '',
            state: {},
            country: '',
            // loggedInRole: AuthenticationService.currentUserValue && AuthenticationService.currentUserValue.role,
            pincode: '',
            phoneNo: '',
            mobileno: '',
            whatsappno: '',
            email: '',
            website: '',
            pan: '',
            isGstApplicable: false,
            gstnumber: '',
            gstUserName: '',
            gstStateCode: {},
            gstapplicablefrom: '',
            isTdsApplicable: false,
            tinumber: '',
            tdsapplicablefrom: '',

            countries: [],
            roles: [],
            companies: [],
            gstLocations: []
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

        console.log(currentUser);
        if (!(currentUser.role == AuthenticationService.superAdmin ||
            currentUser.role == AuthenticationService.admin ||
            currentUser.role == AuthenticationService.clientAdmin)) {
            AuthenticationService.logout();
            this.props.history.push(Config.signInPath);
        }
    }

    componentDidMount() {
        //AuthenticationService.currentUser.subscribe(x => this.setState({ currentUser: x }));
        LocationService.getCountry().then(countries => {
            var ret = [];
            countries.map(
                country => {
                    ret.push({ label: country.countryName, value: { label: country.countryName, value: country.id } });
                }
            );

            this.setState({ countries: ret });
        });

        GstService.getGstLocations().then(x => {
            let ret = [];
            ret.push({ label: 'None', value: { label: 'None', value: 0 } });
            x.map(loc => {
                ret.push({ label: loc.locationName, value: { label: loc.locationName, value: loc.locationCode } });
            });
            this.setState({ gstLocations: ret });
        });

        CompanyService.getCompanyDetails().then(response => {
            console.log(response);
            this.setState({
                name: response.companyName,
                aliasName: response.aliasName,
                mailingName: response.mailingName,
                address: response.address && response.address.address,
                pincode: response.address && response.address.pincode,
                state: response.address && { label: response.address.state, value: response.address.stateId },
                country: response.address && { label: response.address.country, value: response.address.countryId },
                phoneNo: response.phoneNo,
                mobileno: response.mobileNo,
                whatsappno: response.whatsAppNo,
                email: response.email,
                website: response.website,
                pan: response.pan,
                isGstApplicable: response.isGstApplicable,
                gstnumber: response.gstNumber,
                gstUserName: response.gstUserName,
                gstStateCode: response.gstStateCode,
                gstapplicablefrom: response.gstApplicableFrom ? moment(response.gstApplicableFrom).format('YYYY-MM-DD') : '',
                isTdsApplicable: response.isTdsApplicable,
                tinumber: response.tinNumber,
                tdsapplicablefrom: response.tdsApplicableFrom ? moment(response.tdsApplicableFrom).format('YYYY-MM-DD') : '',
            }, _ => {
                if (response.gstStateCode == null) {
                    this.setState({ gstStateCode: { label: 'None', value: 0 } }, _ => {
                    });
                }
                else {
                    for (var i = 0; i < this.state.gstLocations.length; i++) {
                        var obj = this.state.gstLocations[i];
                        if (obj.value.value == response.gstStateCode) {
                            this.setState({ gstStateCode: obj.value }, _ => {
                            });
                            break;
                        }
                    }
                }
            });
        });

    }

    onTextChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    onCheckBoxChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked });
    }

    onDropDownChange(value, action) {
        this.setState({ [action.name]: value.value });
        if (action.name == 'country') {
            //call getstates api.
            LocationService.getStates(value.value.value).then(x => {
                console.log(x);
                var ret = [];
                x.map(
                    state => {
                        ret.push({ label: state.stateName, value: { label: state.stateName, value: state.id } });
                    }
                );

                this.setState({ states: ret, state: 0 });
            });
        }
    }

    render() {
        return (<>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">Company Profile</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Formik
                                enableReinitialize
                                initialValues={{
                                    name: this.state.name,
                                    aliasName: this.state.aliasName,
                                    mailingName: this.state.mailingName,
                                    address: this.state.address,
                                    state: this.state.state.value,
                                    country: this.state.country.value,
                                    // loggedInRole: AuthenticationService.currentUserValue && AuthenticationService.currentUserValue.role,
                                    pincode: this.state.pincode,
                                    phoneNo: this.state.phoneNo,
                                    mobileno: this.state.mobileno,
                                    whatsappno: this.state.whatsappno,
                                    email: this.state.email,
                                    website: this.state.website,
                                    pan: this.state.pan,
                                    isGstApplicable: this.state.isGstApplicable,
                                    gstnumber: this.state.gstnumber,
                                    gstUserName: this.state.gstUserName,
                                    gstStateCode: this.state.gstStateCode,
                                    gstapplicablefrom: this.state.gstapplicablefrom,
                                    isTdsApplicable: this.state.isTdsApplicable,
                                    tinumber: this.state.tinumber,
                                    tdsapplicablefrom: this.state.tdsapplicablefrom
                                }}
                                validationSchema={Yup.object().shape({
                                    name: Yup.string().required('This field is required'),
                                    email: Yup.string().email('Please enter a valid email').required('This field is required'),
                                    address: Yup.string().required('address is required'),
                                    country: Yup.number().min(1, 'This field is required'),
                                    state: Yup.number().min(1, 'This field is required'),

                                })}

                                onSubmit={(
                                    {
                                        name,
                                        address,
                                        aliasName,
                                        mailingName,
                                        country,
                                        state,
                                        pincode,
                                        phoneNo,
                                        mobileno,
                                        whatsappno,
                                        website,
                                        pan,
                                        isGstApplicable,
                                        gstnumber,
                                        gstUserName,
                                        gstStateCode,
                                        gstapplicablefrom,
                                        isTdsApplicable,
                                        tinumber,
                                        tdsapplicablefrom

                                    },
                                    { setStatus, setSubmitting }
                                ) => {
                                    setStatus();



                                    CompanyService.updateCompany(
                                        name,
                                        address,
                                        aliasName,
                                        mailingName,
                                        country,
                                        state,
                                        pincode,
                                        phoneNo,
                                        mobileno,
                                        whatsappno,
                                        website,
                                        pan,
                                        isGstApplicable,
                                        gstnumber,
                                        gstUserName,
                                        gstStateCode.value,
                                        gstapplicablefrom,
                                        isTdsApplicable,
                                        tinumber,
                                        tdsapplicablefrom == "Invalid date" ? null : tdsapplicablefrom,
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
                                }}

                                render={({ values, errors, status, touched, isSubmitting }) => (
                                    <Form>
                                        <Field name="id" type="hidden" onChange={this.onTextChange} />
                                        <div className="form-row">
                                            <div className="form-group col-md-12">
                                                <label htmlFor="name">Name</label>
                                                <Field name="name" type="text" onChange={this.onTextChange} className={'form-control' + (errors.name && touched.name ? ' is-invalid' : '')} />
                                                <ErrorMessage name="name" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="aliasName">Alias Name</label>
                                                <Field name="aliasName" type="text" onChange={this.onTextChange} className={'form-control' + (errors.aliasName && touched.aliasName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="aliasName" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="mailingName">Mailing Name</label>
                                                <Field name="mailingName" type="text" onChange={this.onTextChange} className={'form-control' + (errors.mailingName && touched.mailingName ? ' is-invalid' : '')} />
                                                <ErrorMessage name="mailingName" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-12">
                                                <label htmlFor="address">Address</label>
                                                <Field name="address" type="text" onChange={this.onTextChange} className={'form-control' + (errors.address && touched.address ? ' is-invalid' : '')} />
                                                <ErrorMessage name="address" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">

                                                <label htmlFor="country">Country</label>
                                                <Select name="country" value={this.state.country} onChange={this.onDropDownChange} options={this.state.countries} classNamePrefix="select" className={'form-control' + (errors.country && touched.country ? ' is-invalid' : '')} />
                                                <ErrorMessage name="country" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="state">State</label>
                                                <Select name="state" value={this.state.state} onChange={this.onDropDownChange} options={this.state.states} classNamePrefix="select" className={'form-control' + (errors.state && touched.state ? ' is-invalid' : '')} />
                                                <ErrorMessage name="state" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="pincode">Pincode</label>
                                                <Field name="pincode" type="text" onChange={this.onTextChange} className={'form-control' + (errors.pincode && touched.pincode ? ' is-invalid' : '')} />
                                                <ErrorMessage name="pincode" component="div" className="invalid-feedback" />
                                            </div>

                                            <div className="form-group col-md-4">
                                                <label htmlFor="phoneNo">Phone No</label>
                                                <Field name="phoneNo" type="text" onChange={this.onTextChange} className={'form-control' + (errors.phoneNo && touched.phoneNo ? ' is-invalid' : '')} />
                                                <ErrorMessage name="phoneNo" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="mobileno">Mobile No</label>
                                                <Field name="mobileno" type="text" onChange={this.onTextChange} className={'form-control' + (errors.mobileno && touched.mobileno ? ' is-invalid' : '')} />
                                                <ErrorMessage name="mobileno" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="whatsappno">Whatsapp No</label>
                                                <Field name="whatsappno" type="text" onChange={this.onTextChange} className={'form-control' + (errors.whatsappno && touched.whatsappno ? ' is-invalid' : '')} />
                                                <ErrorMessage name="whatsappno" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="email">Email</label>
                                                <Field name="email" disabled={false} type="text" onChange={this.onTextChange} className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                                                <ErrorMessage name="email" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="website">Website</label>
                                                <Field name="website" type="text" onChange={this.onTextChange} className={'form-control' + (errors.website && touched.website ? ' is-invalid' : '')} />
                                                <ErrorMessage name="website" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <label htmlFor="pan">PAN</label>
                                                <Field name="pan" type="text" onChange={this.onTextChange} className={'form-control' + (errors.pan && touched.pan ? ' is-invalid' : '')} />
                                                <ErrorMessage name="pan" component="div" className="invalid-feedback" />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <CustomSwitch checked={this.state.isGstApplicable} name="isGstApplicable" id="isGstApplicable" onChange={this.onCheckBoxChange} text="GST Applicable" />
                                            </div>
                                            {this.state.isGstApplicable == false &&
                                                <div className="form-group col-md-8"></div>
                                            }
                                            {this.state.isGstApplicable == true &&
                                                <>
                                                    <div className="form-group col-md-2">
                                                        <label htmlFor="gstnumber">GST Number</label>
                                                        <Field name="gstnumber" type="text" onChange={this.onTextChange} className={'form-control' + (errors.gstnumber && touched.gstnumber ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="gstnumber" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-2">
                                                        <label htmlFor="gstUserName">GST User name</label>
                                                        <Field name="gstUserName" type="text" onChange={this.onTextChange} className={'form-control' + (errors.gstUserName && touched.gstUserName ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="gstUserName" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-2">
                                                        <label htmlFor="gstStateCode">GST Location</label>
                                                        <Select name="gstStateCode" onChange={this.onDropDownChange} options={this.state.gstLocations}
                                                            classNamePrefix="select" className={'form-control' + (errors.gstStateCode && touched.gstStateCode ? ' is-invalid' : '')}
                                                            value={this.state.gstStateCode} />
                                                        <ErrorMessage name="gstStateCode" component="div" className="invalid-feedback" />
                                                    </div>
                                                    <div className="form-group col-md-2">
                                                        <label htmlFor="gstapplicablefrom">Applicable From</label>
                                                        <input name="gstapplicablefrom" type="date" value={this.state.gstapplicablefrom} onChange={this.onTextChange} className={'form-control' + (errors.gstapplicablefrom && touched.gstapplicablefrom ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="gstapplicablefrom" component="div" className="invalid-feedback" />
                                                    </div>
                                                </>
                                            }


                                            <div className="form-group col-md-4">
                                                <CustomSwitch checked={this.state.isTdsApplicable} name="isTdsApplicable" id="isTdsApplicable" onChange={this.onCheckBoxChange} text="TDS Applicable" />
                                            </div>
                                            {this.state.isTdsApplicable == true &&
                                                <>
                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="tinumber">TAN Number</label>
                                                        <Field name="tinumber" type="text" onChange={this.onTextChange} className={'form-control' + (errors.tinumber && touched.tinumber ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="tinumber" component="div" className="invalid-feedback" />
                                                    </div>

                                                    <div className="form-group col-md-4">
                                                        <label htmlFor="applicablefrom">Applicable From</label>
                                                        <input name="tdsapplicablefrom" type="date" value={this.state.tdsapplicablefrom} onChange={this.onTextChange} className={'form-control' + (errors.tdsapplicablefrom && touched.tdsapplicablefrom ? ' is-invalid' : '')} />
                                                        <ErrorMessage name="tdsapplicablefrom" component="div" className="invalid-feedback" />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        <div className="form-group ">
                                            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Update Company</button>
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
export default UpdateCompany;