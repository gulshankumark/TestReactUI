import React, { useState, useEffect } from "react";

const Contactform = () => {
  const initialValues = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    message: "",
  };
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formValues);
    }
  }, [formErrors, formValues, isSubmit]);
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
    if (!values.firstName) {
      errors.firstName = "First Name is required!";
    }
    if (!values.lastName) {
      errors.lastName = "Last Name is required!";
    }
    if (!values.phone) {
      errors.phone = "Phone number is required!";
    }
    if (!values.email) {
      errors.email = "Email is required!";
    } else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format!";
    }
    if (!values.address) {
      errors.address = "Address is required!";
    }
    return errors;
  };



  return (
    <>
      <section className="contactus-section">
        <div className='content'>
          <div className="container">
            <div className="row">
              <div className="col-12 col-lg-10 mx-auto">
                <div className="row">
                  <div className="contact-leftside col-12 col-lg-5">
                    <h2 className="main-heading fw-bold">
                      We'd love to hear from you
                    </h2>
                    <p className="main-hero-para">
                      Comments, suggestions and questions are always welcome
                    </p>
                    <h2 className="main-heading fw-bold">
                      Company Address
                    </h2>
                    <p className="main-hero-para">
                      <b>BIPIN BIHARI SINGH CONSULTANTS PVT. LTD<br /></b>
                      Ground & 3rd Floor, City Centre, Axis Bank Building, Near Dankuni Municipality,
                      T.N. Mukherjee Road, South Subhas Pally, Dankuni, Hooghly (W.B.)- 712311.
                    </p>
                    <h2 className="main-heading fw-bold">
                      Contact Number
                    </h2>
                    <p className="main-hero-para">
                      +919433360644
                    </p>
                    <h2 className="main-heading fw-bold">
                      Email Id
                    </h2>
                    <p className="main-hero-para">
                      sales@bbsc.co.in
                    </p>
                  </div>

                  {/* right side contact form  */}
                  <div className="contact-rightside col-12 col-lg-7">
                    {Object.keys(formErrors).length === 0 && isSubmit ? (
                      <div className="ui message success">Form Submitted successfully</div>
                    ) : (
                      <pre>{JSON.stringify()}</pre>
                    )}
                    <form onSubmit={handleSubmit}>
                      <div className="row">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <input
                            type="text"
                            name="firstName"
                            id=""
                            className="form-control form-group"
                            placeholder="First Name"
                            value={formValues.firstName}
                            onChange={handleChange}
                          />
                        </div>
                        <p>{formErrors.firstName}</p>
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <input
                            type="text"
                            name="lastName"
                            id=""
                            className="form-control form-group"
                            placeholder="Last Name"
                            value={formValues.lastName}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <p>{formErrors.lastName}</p>
                      <div className="row">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <input
                            type="text"
                            name="phone"
                            id=""
                            className="form-control form-group"
                            placeholder="Phone Number "
                            value={formValues.phone}
                            onChange={handleChange}
                          />
                        </div>
                        <p>{formErrors.phone}</p>
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <input
                            type="text"
                            name="email"
                            id=""
                            className="form-control form-group"
                            placeholder="Email ID"
                            value={formValues.email}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <p>{formErrors.email}</p>
                      <div className="row">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <input
                            type="text"
                            name="address"
                            id=""
                            className="form-control form-group"
                            placeholder="Add Address"
                            value={formValues.address}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <p>{formErrors.address}</p>
                      <div className="row">
                        <div className="col-12 col-lg-12 contact-input-feild">
                          <input
                            type="text"
                            name="message"
                            id=""
                            className="form-control form-group"
                            placeholder="Enter Your Message"
                            value={formValues.message}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="btnContainer">
                        <button
                          type="submit"
                          className="contact_form_submit"

                        >
                          Submit
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </>
  );
};

export default Contactform;
