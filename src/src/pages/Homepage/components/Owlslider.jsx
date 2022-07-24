import React, { Component } from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import '../../../../src/index.css';
import photo1 from "../components/Images/payroll.png";
import photo2 from "../components/Images/TAXATION.webp";
import photo3 from "../components/Images/Taxphoto3.jpg";
export class Owlslider extends Component {
  render() {
    return (
      <>
        <div className='Principlesbgcolor'>
          <div class='Principlesbgcolor-owl container-fluid' >
            <OwlCarousel items={4} margin={8} autoplay={true} >
              <div ><img
                alt="..."
                className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">PDH LOGISTICS PRIVATE LIMITED </h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">

                  </p>
                </div>
              </div>
              <div>
                <img
                  alt="..."
                  className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">SUBHAM ROADWAYS</h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                  </p>
                </div>
              </div>
              <div><img
                alt="..."
                className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">NEW KHANDA ROAD LINES</h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                  </p>
                </div>
              </div>
              <div>
                <img
                  alt="..."
                  className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">RAJASTHAN HARIYANA ROAD LINES</h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">

                  </p>
                </div>
              </div>
              <div><img
                alt="..."
                className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">SHREE SAI TRANSPORT CORPORATION</h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                  </p>
                </div>
              </div>
              <div>
                <img
                  alt="..."
                  className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">AMBALA GUWAHATI ROADLINES</h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                  </p>
                </div>
              </div>
              <div><img
                alt="..."
                className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">GOODWILL & CO.</h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">

                  </p>
                </div>
              </div>
              <div><img
                alt="..."
                className="img" src={require("../components/Images/img1.jpg").default} />
                <div className="pt-6 text-center">
                  <h5 className="text-xl font-bold">SHREE KRISHNA ROADLINES</h5>
                  <p className="mt-1 text-sm text-blueGray-400 uppercase font-semibold">
                  </p>
                </div>
              </div>
            </OwlCarousel>

            <div className="justify-center text-center flex flex-wrap mt-24">
              <div className="w-full md:w-6/12 px-12 md:px-4">
                <h1 class=" py-4 text-center">PRINCIPLES <span class="rnd">AND FOCUSS</span></h1>
                <p className="aboutus-text text-center mt-4 mb-4 text-blueGray-500">
                  At Transport Works you are not just another customer. We give you time to understand the needs and requirements of your business. Our ability to think outside the box will give you new ideas on how to manage your supply chain.
                  <br /> We use business acumen and the latest technology to integrate service offerings that exceed your expectations. We are big enough to handle any of our clients' challenges and small enough to know all of our client's needs.
                </p>
                <br /><br /><br /><br />
              </div>
            </div>


            <section className="block relative z-1 bg-blueGray-600">
              <div className="container mx-auto">
                <div className="justify-center flex flex-wrap">
                  <div className="w-full lg:w-12/12 px-4  -mt-24">
                    <div className="flex flex-wrap">


                      <div className="w-full lg:w-4/12 px-4">
                        <h5 className="text-xl font-semibold pb-4 text-center">
                          {/* Landing Page */}
                        </h5>
                        {/* <Link to="/landing"> */}
                        <div className="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150">
                          <img
                            alt="..."
                            className="align-middle border-none max-w-full h-auto rounded-lg"
                            src={photo1}
                          />
                        </div>
                        {/* </Link> */}
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <h5 className="text-xl font-semibold pb-4 text-center">
                          {/* Landing Page */}
                        </h5>
                        {/* <Link to="/landing"> */}
                        <div className="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150">
                          <img
                            alt="..."
                            className="align-middle border-none max-w-full h-auto rounded-lg"
                            src={photo2}
                          />
                        </div>
                        {/* </Link> */}
                      </div>
                      <div className="w-full lg:w-4/12 px-4">
                        <h5 className="text-xl font-semibold pb-4 text-center">
                          {/* Landing Page */}
                        </h5>
                        {/* <Link to="/landing"> */}
                        <div className="hover:-mt-4 relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg ease-linear transition-all duration-150">
                          <img
                            alt="..."
                            className="align-middle border-none max-w-full h-auto rounded-lg"
                            src={photo3}
                          />
                        </div>
                        {/* </Link> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="py-20 bg-blueGray-600 overflow-hidden">

            </section>

            <section className="pb-16 bg-blueGray-200 relative pt-32">
              <div
                className="-mt-20 top-0 bottom-auto left-0 right-0 w-full absolute h-20"
                style={{ transform: "translateZ(0)" }}
              >
                <svg
                  className="absolute bottom-0 overflow-hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                  version="1.1"
                  viewBox="0 0 2560 100"
                  x="0"
                  y="0"
                >
                  <polygon
                    className="text-blueGray-200 fill-current"
                    points="2560 0 2560 100 0 100"
                  ></polygon>
                </svg>
              </div>

              <div className="container mx-auto">
                <div className="flex flex-wrap justify-center bg-white shadow-xl rounded-lg -mt-64 py-16 px-12 relative z-10">
                  <div className="w-full text-center lg:w-8/12">
                    <p className="text-4xl text-center">
                      <span role="img" aria-label="love">
                        😍
                      </span>
                    </p>
                    <h3 className="font-semibold text-3xl">
                      Do you love AccountsWonders?
                    </h3>
                    <p className="aboutus-text text-center text-blueGray-500 text-lg leading-relaxed mt-4 mb-4">
                      We would like to help your all problems.
                    </p>
                    <div className="sm:block flex flex-col mt-10">
                      <a href='/Homepage/pages/ContactUs'>
                        <button
                          className='contact_form_submit'>
                          Contact Us
                        </button>
                      </a>
                    </div>
                    <div className="text-center mt-16"></div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>


      </>

    )
  }
}
export default Owlslider;