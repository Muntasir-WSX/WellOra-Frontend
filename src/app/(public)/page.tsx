import About from '@/components/home/about';
import Achievements from '@/components/home/achievments';
import Appointment from '@/components/home/appointment';
import Banner from '@/components/home/banner';
import Blog from '@/components/home/blog';
import Departments from '@/components/home/Departments';
import Help from '@/components/home/help';
import OurDoctors from '@/components/home/ourDoctors';
import Partners from '@/components/home/partners';
import Rivew from '@/components/home/rivew';
import Services from '@/components/home/services';
import Subscription from '@/components/home/subscription';
import WhyChooseUs from '@/components/home/whychooseus';
import React from 'react'

function page() {
  return (
 <div>

  <Banner />
  <WhyChooseUs/>
  <About />
  <Services />
  <Departments />
  <OurDoctors />
  <Appointment />
  {/* <AvailableToday /> */}
  <Achievements />
  <Rivew/>
  <Partners />
  <Blog /> 
  <Help />
  <Subscription />
{/* Blog Done */}

 </div>   
    
    
)
}

export default page