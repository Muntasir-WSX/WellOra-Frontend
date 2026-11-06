import About from '@/components/home/about';
import Achievments from '@/components/home/achievments';
import Appointment from '@/components/home/appointment';
import Banner from '@/components/home/banner';
import Blog from '@/components/home/blog';
import Help from '@/components/home/help';
import OurDoctors from '@/components/home/ourDoctors';
import Partners from '@/components/home/partners';
import Rivew from '@/components/home/rivew';
import Services from '@/components/home/services';
import Subscription from '@/components/home/subscription';
import Whychooseus from '@/components/home/whychooseus';
import React from 'react'

function page() {
  return (
 <div>

    <Banner></Banner>
    <Whychooseus></Whychooseus>
    <About></About>
    <Services></Services>
    <OurDoctors></OurDoctors>
    <Appointment></Appointment>
    <Rivew></Rivew>
    <Achievments></Achievments>
    <Help></Help>
    <Partners></Partners>
    <Blog></Blog>
    <Subscription></Subscription>

 </div>   
    
    
)
}

export default page