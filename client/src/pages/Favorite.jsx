import React from 'react'

import MovieCard from '../components/MovieCard'
import BlurCircle from '../components/BlurCircle'
import { useAppContext } from '../context/AppContext'

function Favorite() {
    const { favoriteMovies } = useAppContext();

    if (!favoriteMovies || favoriteMovies.length === 0) {
        return (
            <div className='min-h-[80vh] flex items-center justify-center'>
                <h1 className='text-3xl font-bold text-center'>No Movies Available</h1>
            </div>
        );
    }

    return (
        <div className='relative my-40 mb-60 px-6 md:px-16 lg:px-40 xl:px-44 overflow-hidden min-h-[80vh]'>
            <BlurCircle top='150px' left='0px' />
            <BlurCircle bottom='150px' right='0px' />
            <h1 className='text-lg font-medium my-4'>Your Favorite Movies</h1>
            <div className='flex flex-wrap max-sm:justify-center gap-8'>
                {favoriteMovies.map((movie) => (
                    <MovieCard movie={movie} key={movie._id} />
                ))}
            </div>
        </div>
    );
}


export default Favorite