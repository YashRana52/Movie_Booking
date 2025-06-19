import { Heart, PlayCircle, StarIcon } from 'lucide-react'
import { dummyDateTimeData, dummyShowsData } from '../assets/assets'
import BlurCircle from '../components/BlurCircle'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import timeFormate from '../lib/TimeFormate'
import DataSelect from '../components/DataSelect'
import MovieCard from '../components/MovieCard'
import Loading from '../components/Loading'

function MovieDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [show, setShow] = useState(null)

  const getShow = async () => {
        const show = dummyShowsData.find(show => show._id === id)
    if (show) {
      setShow({
      movie: show,
      dateTime: dummyDateTimeData,
    })
      
    }

    
  }

  useEffect(() => {
    getShow()
  }, [id])

  return show ? (
    <div className='px-6 md:px-16 lg:px-40 pt-28 md:pt-32 pb-16'>
      <div className='flex flex-col md:flex-row gap-10 max-w-6xl mx-auto'>
        {/* Poster */}
        <img
          src={show.movie.poster_path}
          alt={show.movie.title}
          className='max-md:mx-auto rounded-2xl h-[26rem] w-[18rem] object-cover shadow-xl'
        />

        {/* Info Section */}
        <div className='relative flex flex-col gap-5 text-white'>
          <BlurCircle top='-100px' left='-100px' />

          <p className='text-sm text-primary font-semibold uppercase tracking-widest'>English</p>

          <h1 className='text-4xl font-bold max-w-xl leading-tight'>
            {show.movie.title}
          </h1>

          {/* Ratings */}
          <div className='flex items-center gap-2 text-gray-400 text-sm'>
            <StarIcon className='w-5 h-5 text-primary' />
            {show.movie.vote_average.toFixed(1)} <span className='ml-1'>User Rating</span>
          </div>

        
          <p className='text-gray-300 text-base leading-relaxed'>
            {show.movie.overview}
          </p>

          <p className='text-sm text-gray-400'>
            {timeFormate(show.movie.runtime)} • {show.movie.genres.map(genre => genre.name).join(', ')} • {show.movie.release_date.split('-')[0]}
          </p>

          {/* Actions */}
          <div className='flex flex-wrap items-center gap-4 mt-4'>
            <button className='flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full hover:bg-opacity-80 transition'>
              <PlayCircle className='w-5 h-5' />
              Watch Trailer
            </button>

            <a
              href='#dateSelect'
              className='px-4 py-2 border border-primary text-primary rounded-full hover:bg-primary hover:text-white transition'
            >
              Buy Tickets
            </a>

            <button className='p-2 border border-gray-600 rounded-full hover:bg-gray-800 transition'>
              <Heart className='w-5 h-5 text-gray-300' />
            </button>
          </div>
        </div>
      </div>
      <p className='text-lg font-medium mt-20'>
        Your Favorite Cast
      </p>

      <div className='overflow-x-auto no-scrollbar mt-8 pb-4'>
        <div className='flex items-center gap-4 w-max px-4'>
            {
                show.movie.casts.slice(0,12).map((cast,index)=>(
                    <div key={index} className='flex flex-col items-center text-center'>
                        <img src={cast.profile_path} alt="" className='rounded-full h-20 md:h-20 aspect-square object-cover' />
                        <p className='font-medium text-xs mt-3 '>{cast.name}</p>

                    </div>

                ))
            }

        </div>


      </div>
      <DataSelect dateTime={show.dateTime}id={id}/>

      <p className='text-lg font-medium mt-20 mb-8'>You May Also Like</p>
      <div className='flex flex-wrap max-sm:justify-center gap-8'>
        {
          dummyShowsData.slice(0,4).map((movie,index)=>(
            <MovieCard key={index} movie={movie}/>

          )

          )
        }

      </div>
      <div className='flex justify-center mt-20'>
        <button onClick={()=>navigate('/movies')} className='px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-md font-medium cursor-pointer'>
          Show More

        </button>

      </div>
    </div>
  ) : (
   <Loading/>
  )
}

export default MovieDetails
