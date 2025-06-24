import timeFormate from '../lib/TimeFormate'
import { StarIcon } from 'lucide-react'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'

function MovieCard({ movie }) {
  const navigate = useNavigate()
  const { image_base_url } = useAppContext()

  return (
    <div className='flex flex-col justify-between p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-full max-w-xs md:max-w-md lg:max-w-66 mx-auto'>
      <img
        onClick={() => {
          navigate(`/movies/${movie._id}`)
          window.scrollTo(0, 0)
        }}
        src={image_base_url + movie.backdrop_path}
        alt=""
        className='rounded-lg h-48 md:h-56 w-full object-cover object-center cursor-pointer'
      />

      <p className='mt-2 text-base md:text-lg font-semibold text-white'>{movie.title}</p>

      <p className='text-sm md:text-base text-gray-300 mt-1'>
        {new Date(movie.release_date).getFullYear()} ·{' '}
        {movie.genres.slice(0, 2).map(genre => genre.name).join(' | ')} · {timeFormate(movie.runtime)} min
      </p>

      <div className='flex justify-between items-center mt-3'>
        <button className='bg-primary text-white py-1 px-3 rounded text-sm md:text-base'>Buy Tickets</button>
        <p className='flex items-center gap-1 text-yellow-400 text-sm md:text-base'>
          <StarIcon size={16} /> {movie.vote_average.toFixed(1)}
        </p>
      </div>
    </div>
  )
}

export default MovieCard
