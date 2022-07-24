import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Contactform from '../components/Contactform'
import Blank from '../components/Blank'
import photo1 from "../components/Images/discussion-1874792_1920.png"

export default function ContactUs() {
  return (
    <>
      <Navbar />
      <section class="section-a container-fluid background-color">
        <div class="container">
          <div>
            <h1>Contact us</h1>
            <h4>
              Get in touch with us and let us know how we can help!
            </h4>
          </div>
          <img src={photo1} alt="" />
        </div>
      </section>
      <Contactform />
      <Footer />

    </>
  )
}