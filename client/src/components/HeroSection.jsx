import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { CalendarIcon, ClockIcon, ArrowRight } from 'lucide-react'





function HeroSection() {
  const navigate = useNavigate()
 

  return (
    <div className='flex flex-col items-start justify-center gap-4 px-6 md:px-16 lg:px-36 bg-[url("/thumb-1920-674685.jpg")] bg-cover bg-center h-screen'>

    
<h1 className='text-5xl md:text-[70px] font-bold drop-shadow-xl animate-pulse'>
  <span className='text-orange-500'>Game </span>
  <br />
  <span className='text-gray-300'>of Thrones</span>
</h1>




      <div className='flex items-center gap-4 text-gray-300'>
        <div className='flex items-center gap-1'>
          <CalendarIcon className='w-4.5 h-4.5' />2015



        </div>



        <div className='flex items-center gap-1'>
          <ClockIcon className='w-4.5 h-4.5' />5h 8m




        </div>
        

      </div>
      <p className='max-w-md text-gray-300'>
       In the ruthless battle for the Iron Throne, noble families clash in a world where loyalty is rare and survival is everything.
      </p>
      <button onClick={()=>navigate('/movies')} className='flex items-center gap-1 px-6 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer'>
        Explore Movies
      <ArrowRight className="w-5 h-5 "  />


      </button>


    </div>


  )
}

export default HeroSection