import React, { Component } from "react";
import RegisterTrialUser from "./RegisterTrialUser";
import Blank from "./Blank";


class Ourservices extends Component {

  constructor(props) {
    super(props);
    this.state = {
      change: true,
      visible: false,
    };
    this.openModal = this.openModal.bind(this);
  }

  openModal(e) {
    this.setState({ visible: !this.state.visible });
  }
  render() {
    return (
      <>

        <section id="what-we-do ">
          <div class="feat bg-gray pt-5 pb-5 container-fluid background-color">
            <div class="container">
              <div class="row">


                <div class="section-head col-sm-12">
                  <br />
                  <br />
                  <h1 class="displaysize text-center">OUR <span class="rnd">FEATURES</span></h1>
                  <p>We close the gap between customers and carriers. With the help of technology and intelligent reporting, we are developing transport solutions that add value to the chain of supply chain management, reduce risk and continuously improve outcomes and We are providing Accounting and Statutory - also known as <b />Financial Statements or Year-End-Accounts.</p>
                </div>


                <div class="col-lg-4 col-sm-6">
                  <div class="item">
                    <span class="icon feature_box_col_one ">
                      <svg width="1.6em" height="1.6em" viewBox="0 0 16 16" class="bi pb-2 bi-award" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M9.669.864L8 0 6.331.864l-1.858.282-.842 1.68-1.337 1.32L2.6 6l-.306 1.854 1.337 1.32.842 1.68 1.858.282L8 12l1.669-.864 1.858-.282.842-1.68 1.337-1.32L13.4 6l.306-1.854-1.337-1.32-.842-1.68L9.669.864zm1.196 1.193l-1.51-.229L8 1.126l-1.355.702-1.51.229-.684 1.365-1.086 1.072L3.614 6l-.25 1.506 1.087 1.072.684 1.365 1.51.229L8 10.874l1.356-.702 1.509-.229.684-1.365 1.086-1.072L12.387 6l.248-1.506-1.086-1.072-.684-1.365z" />
                        <path d="M4 11.794V16l4-1 4 1v-4.206l-2.018.306L8 13.126 6.018 12.1 4 11.794z" />
                      </svg>
                    </span>
                    <h6>GST Compliance</h6>
            <p>Accounts Wonders is fully compliant to GST. All reports regarding can be easily generated and shared. Users have the facility to file all GST Return on single click, even it can be done from mobile and it is very user friendly.</p><br/><br/>
                  </div>
                </div>

                <div class="col-lg-4 col-sm-6">
                  <div class="item">
                    <span class="icon feature_box_col_two">
                      <svg width="1.6em" height="1.6em" viewBox="0 0 16 16" class="bi pb-2 bi-blockquote-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M2 3.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 0 1h-6a.5.5 0 0 1-.5-.5zm0 3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z" />
                        <path d="M12.168 6.352c.184.105.332.197.445.275.114.074.229.174.346.299.11.117.193.24.252.369s.1.295.123.498h-.281c-.243 0-.432.06-.569.182-.14.117-.21.29-.21.521 0 .164.062.318.187.463.121.14.289.21.504.21.336 0 .576-.108.72-.327.145-.223.217-.514.217-.873 0-.254-.054-.485-.164-.692a2.436 2.436 0 0 0-.398-.562c-.16-.168-.33-.31-.51-.428-.18-.117-.33-.213-.451-.287l-.211.352zm-2.168 0c.184.105.332.197.445.275.114.074.229.174.346.299.113.12.2.246.258.375.055.125.094.289.117.492h-.281c-.242 0-.432.06-.569.182-.14.117-.21.29-.21.521 0 .164.062.318.187.463.121.14.289.21.504.21.336 0 .576-.108.72-.327.145-.223.217-.514.217-.873 0-.254-.054-.485-.164-.692a2.438 2.438 0 0 0-.398-.562c-.16-.168-.33-.31-.51-.428-.18-.117-.33-.213-.451-.287L10 6.352z" />
                      </svg>
                    </span>
                    <h6>TDS Compliance</h6>
            <p>This software makes it easy for the user to file their TDS return in one click. FVU file are generated and are directly uploaded to the Income Tax website. Thus, no separate TDS software is required anymore and no need to pay any extra charges to TDS professionals means cost saving to the business entity..</p>
                  </div>
                </div>

                <div class="col-lg-4 col-sm-6">
                  <div class="item">
                    <span class="icon feature_box_col_three">
                      <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi pb-2 bi-book-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M8.5 2.687v9.746c.935-.53 2.12-.603 3.213-.493 1.18.12 2.37.461 3.287.811V2.828c-.885-.37-2.154-.769-3.388-.893-1.33-.134-2.458.063-3.112.752zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783z" />
                      </svg>
                    </span>
                    <h6>Transactional SMS</h6>
            <p>Facility of real time transactional sms has been provided in this application. It means as soon as the receipt/payment/journals etc. entries are made or invoices are created an SMS automatically get sent to your vendors informing about the transaction done.</p><br/>
                  </div>
                </div>

                <div class="col-lg-4 col-sm-6">
                  <div class="item">
                    <span class="icon feature_box_col_one ">
                      <svg width="1.3em" height="1.3em" viewBox="0 0 16 16" class="bi pb-2 bi-book-half" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h9.586a2 2 0 0 1 1.414.586l2 2V2a1 1 0 0 0-1-1H2zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
                        <path d="M7.066 4.76A1.665 1.665 0 0 0 4 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112zm4 0A1.665 1.665 0 0 0 8 5.668a1.667 1.667 0 0 0 2.561 1.406c-.131.389-.375.804-.777 1.22a.417.417 0 1 0 .6.58c1.486-1.54 1.293-3.214.682-4.112z" />
                      </svg>
                    </span>
                    <h6>Accounting on the Go</h6>
            <p>Accounts Wonders is a cloud based application. Here you can generate invoices, make entries, share reports etc. Even you can file your GST and TDS returns on click of a button from your mobile as well.</p>
                  </div>
                </div>

                <div class="col-lg-4 col-sm-6">
                  <div class="item">
                    <span class="icon feature_box_col_two">
                      <svg width="1.6em" height="1.6em" viewBox="0 0 16 16" class="bi pb-2 bi-blockquote-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd" d="M6.146 6.146a.5.5 0 0 1 .708 0L8 7.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 8l1.147 1.146a.5.5 0 0 1-.708.708L8 8.707 6.854 9.854a.5.5 0 0 1-.708-.708L7.293 8 6.146 6.854a.5.5 0 0 1 0-.708z" />
                        <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                        <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                      </svg>
                    </span>
                    <h6>Incomparable speed</h6>
            <p>It feels 3x fast GST input, 5x faster invoice reconciliation and 10x faster e-waybill production. People submit their tax returns in less than 7 minutes.</p>
			<br/><br/>
                  </div>
                </div>

                <div class="col-lg-4 col-sm-6">
                  <div class="item">
                    <span class="icon feature_box_col_three">
                      <svg width="1.6em" height="1.6em" viewBox="0 0 16 16" class="bi pb-2 bi-blockquote-right" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
                        <path d="m2.165 15.803.02-.004c1.83-.363 2.948-.842 3.468-1.105A9.06 9.06 0 0 0 8 15c4.418 0 8-3.134 8-7s-3.582-7-8-7-8 3.134-8 7c0 1.76.743 3.37 1.97 4.6a10.437 10.437 0 0 1-.524 2.318l-.003.011a10.722 10.722 0 0 1-.244.637c-.079.186.074.394.273.362a21.673 21.673 0 0 0 .693-.125zm.8-3.108a1 1 0 0 0-.287-.801C1.618 10.83 1 9.468 1 8c0-3.192 3.004-6 7-6s7 2.808 7 6c0 3.193-3.004 6-7 6a8.06 8.06 0 0 1-2.088-.272 1 1 0 0 0-.711.074c-.387.196-1.24.57-2.634.893a10.97 10.97 0 0 0 .398-2z" />
                      </svg>
                    </span>
                    <h6>24/7 Support</h6>
            <p>Call Us : 03326590206<br/>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 03329692929<br/>Email Id : contact@bbsc.co.in<br /> Dedicated Manager will be provided</p><br/><br/>
                  </div>
                </div>

              </div>
            </div>
          </div>




          <div class="container Principlesbgcolor">
            <Blank />
            <div class="blob"></div>
          </div>

          <div>
            <br />
            <br /><br /><br />
            <h1 class=" py-4 text-center"><span class="rnd">PRICING</span></h1>
            <div className="pricing-container container-fluid background-color">

              <img class="home-img " src="https://github.com/Sacsam005/assets_codepen/blob/main/assets/person.png?raw=true" alt="Person" />
              <div class="wave"></div>
              <div class="wave wave-2"></div>
              <div class="wave wave-3"></div>
              <div className="pricing-item featured">
                <div className="pricing-item-header">
                  <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M30.3333 17C30.3333 13.4638 28.9286 10.0724 26.4281 7.57189C23.9276 5.0714 20.5362 3.66665 17 3.66665C13.4638 3.66665 10.0724 5.0714 7.57189 7.57189C5.0714 10.0724 3.66665 13.4638 3.66665 17V23.6666H8.66665C9.10867 23.6666 9.5326 23.8422 9.84516 24.1548C10.1577 24.4674 10.3333 24.8913 10.3333 25.3333V30.3333H23.6666V25.3333C23.6666 24.8913 23.8422 24.4674 24.1548 24.1548C24.4674 23.8422 24.8913 23.6666 25.3333 23.6666H30.3333V17ZM27 27V32C27 32.442 26.8244 32.8659 26.5118 33.1785C26.1993 33.4911 25.7753 33.6666 25.3333 33.6666H8.66665C8.22462 33.6666 7.8007 33.4911 7.48814 33.1785C7.17558 32.8659 6.99998 32.442 6.99998 32V27H1.99998C1.55795 27 1.13403 26.8244 0.821468 26.5118C0.508908 26.1993 0.333313 25.7753 0.333313 25.3333V17C0.333313 7.79498 7.79498 0.333313 17 0.333313C26.205 0.333313 33.6666 7.79498 33.6666 17V25.3333C33.6666 25.7753 33.4911 26.1993 33.1785 26.5118C32.8659 26.8244 32.442 27 32 27H27ZM9.49998 20.3333C9.17168 20.3333 8.84659 20.2687 8.54327 20.143C8.23996 20.0174 7.96436 19.8332 7.73221 19.6011C7.50007 19.3689 7.31592 19.0933 7.19028 18.79C7.06464 18.4867 6.99998 18.1616 6.99998 17.8333C6.99998 17.505 7.06464 17.1799 7.19028 16.8766C7.31592 16.5733 7.50007 16.2977 7.73221 16.0655C7.96436 15.8334 8.23996 15.6493 8.54327 15.5236C8.84659 15.398 9.17168 15.3333 9.49998 15.3333C10.163 15.3333 10.7989 15.5967 11.2677 16.0655C11.7366 16.5344 12 17.1703 12 17.8333C12 18.4964 11.7366 19.1322 11.2677 19.6011C10.7989 20.0699 10.163 20.3333 9.49998 20.3333ZM24.5 20.3333C24.1717 20.3333 23.8466 20.2687 23.5433 20.143C23.24 20.0174 22.9644 19.8332 22.7322 19.6011C22.5001 19.3689 22.3159 19.0933 22.1903 18.79C22.0646 18.4867 22 18.1616 22 17.8333C22 17.505 22.0646 17.1799 22.1903 16.8766C22.3159 16.5733 22.5001 16.2977 22.7322 16.0655C22.9644 15.8334 23.24 15.6493 23.5433 15.5236C23.8466 15.398 24.1717 15.3333 24.5 15.3333C25.163 15.3333 25.7989 15.5967 26.2677 16.0655C26.7366 16.5344 27 17.1703 27 17.8333C27 18.4964 26.7366 19.1322 26.2677 19.6011C25.7989 20.0699 25.163 20.3333 24.5 20.3333Z"
                      fill="currentColor" />
                  </svg>

                </div>
                <div className="pricing-item-body">
                  <h3>What You’ll Get</h3>

                  <div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.0001 0.00012207C4.48606 0.00012207 6.10352e-05 4.48612 6.10352e-05 10.0001C6.10352e-05 15.5141 4.48606 20.0001 10.0001 20.0001C15.5141 20.0001 20.0001 15.5141 20.0001 10.0001C20.0001 4.48612 15.5141 0.00012207 10.0001 0.00012207ZM8.00106 14.4131L4.28806 10.7081L5.70006 9.29212L7.99906 11.5871L13.2931 6.29312L14.7071 7.70712L8.00106 14.4131Z"
                        fill="currentColor" />
                    </svg>
                    <span>Rs.1999/- P.M. including Tax.</span>
                  </div>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M10.0001 0.00012207C4.48606 0.00012207 6.10352e-05 4.48612 6.10352e-05 10.0001C6.10352e-05 15.5141 4.48606 20.0001 10.0001 20.0001C15.5141 20.0001 20.0001 15.5141 20.0001 10.0001C20.0001 4.48612 15.5141 0.00012207 10.0001 0.00012207ZM8.00106 14.4131L4.28806 10.7081L5.70006 9.29212L7.99906 11.5871L13.2931 6.29312L14.7071 7.70712L8.00106 14.4131Z"
                        fill="currentColor" />
                    </svg>
                    <span>2 months discount on payment of <br /> 12 months at a time.
                      <br />
                      e.g. (12 Months x 1999/-) = 23988/-<br />Less Discount : (2 Months x 1999/-) =3998/- <br /> Amount to Pay : 19990/-</span>
                  </div>
                  <span></span>
                  <div>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="" />
                    </svg>
                    <span></span>
                  </div>
                </div>
                <a href='/Homepage/pages/ContactUs'>
                  <div className="pricings-items-footers">
                    <div>
                      <button
                        className='btn btn-primary text-uppercase'>Get Started</button>
                    </div>
                  </div>
                </a>
              </div>
              <br />
            </div>
          </div>
          <Blank />
          <br />

          <div className=" container-fluid background-color">
            <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-2 py-16 px-12 relative z-10">
              <div className="w-full text-center lg:w-8/12">
                <div className="sm:block flex flex-col mt-10">

                  <button
                    onClick={this.openModal}
                    className='contact_form_submit'>
                    Get Your Free Trial
                  </button>
                  {this.state.visible &&
                    <RegisterTrialUser />
                  }

                </div>
              </div>
              <div className="text-center mt-16"></div>
            </div>
          </div>
        </section>
        <br /><br /><br />
      </>
    );
  }
}


export default Ourservices;