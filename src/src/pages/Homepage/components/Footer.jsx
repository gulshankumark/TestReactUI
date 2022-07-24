import React from "react";

const Footer = () => {
  return (
    <>
      <footer>
        <div className="container">
          <div className="row">
            <div className="col-12 col-lg-10 mx-auto">
              <div className="row">
                <div className="col-6 col-lg-3">
                  <h2>Company</h2>
                  <p className="p">
                    BIPIN BIHARI SINGH CONSULTANTS PVT. LTD<br />
                    Ground & 3rd Floor, City Centre, Axis Bank Building, Near Dankuni Municipality, T.N. Mukherjee Road, South Subhas Pally, Dankuni, Hooghly (W.B.)- 712311.
                    <p></p>
                    <p>Ph : 03326590206/03329692929</p>
                    <p></p>
                    <p>Email : contact@bbsc.co.in</p>
                  </p>
                </div>

                <div className="col-6 col-lg-3">
                  <h2>Support</h2>
                  <li>
                    <a href="/">GST Compliance</a>
                  </li>
                  <li>
                    <a href="/">TDS Compliance</a>
                  </li>
                  <li>
                    <a href="/">Transactional SMS</a>
                  </li>
                  <li>
                    <a href="/">ITR E Filing</a>
                  </li>
                </div>

                <div className="col-6 col-lg-3">
                  <h2>Services</h2>
                  <li>
                    <a href="/">Accounts Wonders</a>
                  </li>
                  <li>
                    <a href="/">Trans Wonders</a>
                  </li>
                  <li>
                    <a href="/">Software</a>
                  </li>
                </div>

                <div className="col-6 col-lg-3">
                  <h2>Follow Us</h2>
                  <div className="row">
                    <div className="col-3 mx-auto">
                      <a
                        href="https://www.facebook.com/bbsconsultants/"
                        target=""
                      >
                        <i className="fab fa-facebook-f fontawesome-style"></i>
                      </a>
                    </div>
                    <div className="col-3 mx-auto">
                      <a
                        href="/"
                        target=""
                      >
                        <i className="fab fa-instagram fontawesome-style"></i>
                      </a>
                    </div>
                    <div className="col-3 mx-auto">
                      <i className="fab fa-youtube fontawesome-style"></i>
                    </div>
                    <div className="col-3 mx-auto">
                      <a
                        href="/"
                        target=""
                      >
                        <i className="fab fa-whatsapp fontawesome-style"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <hr />
              <div className="mt-5">
                <p className="main-hero-para text-center w-100">
                  Copyright © 2022 AccountsWonders. All rights reserved.
                  <p>Design & Developed by <a href="http://bbsc.in/" className="hreaf"> BBSC</a></p>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
