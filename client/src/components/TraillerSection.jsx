import ReactPlayer from 'react-player'
import { dummyTrailers } from '../assets/assets'
import React, { useState } from 'react'
import BlurCircle from './BlurCircle'
import { PlayCircle } from 'lucide-react'

function TraillerSection() {
    const [currentTrailler,setCurrentTrailler] = useState(dummyTrailers[0])
  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-44 py-20 overflow-hidden'>
        <p className='text-gray-300 font-medium text-lg max-w-[960px] mx-auto'>
            Trailers

        </p>
        <div className='relative mt-6'>
            <BlurCircle top='-100px' right='-100px'/>
            <ReactPlayer url={currentTrailler.videoUrl} controls={false}
            className='mx-auto max-w-full' width="960px" height="540px"/>

           
        </div>

        <div className='group grid grid-cols-4 gap-4 md:gap-8 mt-8 max-w-3xl mx-auto'>

            {
                dummyTrailers.map((trailer)=>(
<div onClick={()=>setCurrentTrailler(trailer)} key={trailer.image} className='
  relative
  group-hover:not-hover:opacity-50 
  hover:-translate-y-1 
  duration-300 
  transition 
  max-md:h-60 
  md:max-h-60 
  cursor-pointer
'>

                        <img src={trailer.image} alt="trailer" className='rounded-lg w-full h-full object-cover brightness-75' />
                        <PlayCircle strokeWidth={1.6} className='absolute top-1/2 left-1/2 w-5 md:w-8  h-5 md:h-12 transform -translate-x-1/2 -translate-1/2'/>
                    </div>

                )

                )
            }

        </div>



    </div>
  )
}

export default TraillerSection