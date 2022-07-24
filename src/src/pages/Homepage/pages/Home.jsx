import React from 'react'
import Navbar from '../components/Navbar'
import FixedHeader from '../components/FixedHeader'
import Ourservices from '../components/Ourservices'
import Footer from '../components/Footer'
import About from '../components/About'
import Owlslider from '../components/Owlslider'

export default function Home() {
  return (
    <>
        <Navbar />
        <FixedHeader />
        <Ourservices />
        <About />
        <Owlslider />
        <Footer />

    </>
  )
}
