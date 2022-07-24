import React, { Component, } from 'react';
import '../../../assets/scss/style.scss';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import nft from './Transwonders.jpeg';
import swal from 'sweetalert';

import { AuthenticationService } from '../../../services/AuthenticationService';


class RegisterTrialUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      isOpen: false,
    };
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.setOpenModal = this.setOpenModal.bind(this);
  }

  handleCloseModal(e) {
    window.$('#modal').modal().hide();
  }

  componentDidMount() {
  }


  setOpenModal() {
    this.setState({ show: !this.state.isOpen });

  }



  render() {
    return (
      <>
        <div className='overlay' id="modal">
          <div
            className='modalContainer'
          >
            <img className='imagespop' src={nft} alt='/' />
            <div>


              <div className='modalRight'
                onClick={this.handleCloseModal}
              >
                <p className='closeBtn mt-1'>
                  <button type="button" class="btn-close" aria-label="Close"></button>
                </p>
              </div>



              <div className='content'>
                <p>Do you want to get</p>
                <h1>TransWonders Software</h1>
                <p> Free for 30 days</p>
              </div>

              <Formik
                initialValues={{
                  fullName: "",
                  phoneNumber: "",
                  email: "",
                  companyname: "",
                }}

                validationSchema={Yup.object().shape({
                  fullName: Yup.string().required('This field is required'),
                  phoneNumber: Yup.string().required('This field is required'),
                  email: Yup.string().required('This field is required'),
                  companyname: Yup.string().required('This field is required')
                })}

                onSubmit={({ fullName, phoneNumber, email, companyname }, { setStatus, setSubmitting }) => {
                  setStatus();
                  AuthenticationService.RegisterTrialUser(fullName, companyname, phoneNumber, email)
                    .then(
                      _ => {
                        setSubmitting(false);
                        // this.props.history.push('/src/pages/Homepage/pages/Home');
                      },
                      error => {
                        setSubmitting(false);
                        setStatus(error);
                      }
                    );
                    swal({
                      title: "Registration Was Successful!",
                      text: "Our Support Team will Contact Within 48 Hours.",
                      icon: "success",
                      button: "Okay",
                    });
                }}
                render={({ errors, status, touched, isSubmitting }) => (
                  <Form>
                    <div class="row">
                      <div className="form-group">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <Field name="fullName" placeholder="Full Name" type="text" className={'form-control' + (errors.fullName && touched.fullName ? ' is-invalid' : '')} />
                          <ErrorMessage name="fullName" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div className="form-group">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <Field name="phoneNumber" placeholder="Phone Number" type="text" className={'form-control' + (errors.phoneNumber && touched.phoneNumber ? ' is-invalid' : '')} />
                          <ErrorMessage name="phoneNumber" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div className="form-group">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <Field name="email" placeholder="Email" type="text" className={'form-control' + (errors.email && touched.email ? ' is-invalid' : '')} />
                          <ErrorMessage name="email" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                    </div>
                    <div class="row">
                      <div className="form-group">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <Field name="companyname" placeholder="Company Name" type="text" className={'form-control' + (errors.companyname && touched.companyname ? ' is-invalid' : '')} />
                          <ErrorMessage name="companyname" component="div" className="invalid-feedback" />
                        </div>
                      </div>
                    </div>

                    <div className='btnContainer ' >
                      <button type="submit" className='btnPrimary' disabled={isSubmitting}><span className='bold'>YES</span>, I love It</button>
                      {isSubmitting &&
                        <img alt="" src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                      }
                      
                      <button
                        onClick={this.handleCloseModal}
                        type="button" class="btn btn-primary btn-rounded" data-dismiss="modal"><span className='bold'>NO</span>, thanks</button>

                    </div>
                    {status &&
                      <div className={'alert alert-danger'}>{status}</div>
                    }
                  </Form>

                )}
              />
            </div>
          </div>
        </div>
      </>);
  }
};
export default RegisterTrialUser;