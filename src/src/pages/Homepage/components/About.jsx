import React from "react";

const About = () => {
  return (
    <>
      <div className="aboutus-section">
        <div className="container-fluid background-color">
          <div className="row">
            {/* <div className="col-md-0 col-sm-12 col-xs-12"> */}
            <div className="aboutus">
              <h1 class=" py-4 text-center">Evolution of <span class="rnd">AccountsWonders</span></h1>
              <p className="aboutus-text">
                Many software companies have programmed various accounting software for different industries such as Tally, Quick Books, Marg, Busy, Vyapar etc. but one sector remain ignored throughout these days that is Accounting sector.
              </p>
              <p className="aboutus-text">
                Accounting of Accounting business cannot be done properly with the traditional accounting software available in the market. Traditional accounting softwrae are not equipped with features such as Consignment note, Truckers payment slip, Vehicle Verification, Vehicle wise Tracking of accounts etc. thus increasing the hardship of the Accounting sector.
              </p>
              <p className="aboutus-text">
                Looking into the hardship of this sector Bipin Bihari Singh Consultants Pvt. Ltd. developed an accounting software exclusively for the Accounting Sector under the brand name of "AccountsWonders".

              </p>
              <p className="aboutus-text">
                AccountsWonders is a complete accounting package for Accountingers. From this platform Accountingers can verify vehicles, GSTIN, File GST Return, they can also use this as their CRM software.
              </p>
            </div>
          </div>

        </div>
      </div>



      <section className=" Principlesbgcolor pt-2 pb-2">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center text-center mb-2">
            <div className="w-full lg:w-6/6 px-4">
              <h1 class=" py-4 text-center">OUR <span class="rnd">CLIENTS</span></h1>
              <p className="text-lg leading-relaxed m-4 text-blueGray-700">
                A true partnership is a two-way street — ideas and information flow openly and regularly, based on a foundation of mutual trust and respect for one another’s expertise — and our clients embrace this philosophy.

                The best and most productive relationships are synergistic and goal-oriented, and a long-term relationship has the value add of deep-rooted industry and company knowledge and relationships.
              </p>
            </div>
          </div>

        </div>
      </section>

    </>
  );
};

export default About;
