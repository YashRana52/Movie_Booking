import React, { useEffect, useState } from 'react';

import Loading from '../components/Loading';
import BlurCircle from '../components/BlurCircle';
import timeFormate from '../lib/TimeFormate';
import { dateFormat } from '../lib/dateFormate';
import { useAppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

function MyBookings() {
  const currency = import.meta.env.VITE_CURRENCY;
  const { axios, getToken, user, image_base_url } = useAppContext();
  const [bookings, setBookings] = useState([]);

  const [isLoading, setIsLoading] = useState(true);

  const getMyBookings = async () => {
    try {
      const { data } = await axios.get('/api/user/bookings', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      if (data.success) {
        setBookings(data.bookings);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); 
    }
  };

  useEffect(() => {
    if (user) {
      getMyBookings();
    } else {
      setIsLoading(false); 
    }
  }, [user]);

  return !isLoading ? (
    <div className='relative px-4 md:px-16 lg:px-32 pt-28 min-h-[80vh]'>
      <BlurCircle top='100px' left='100px' />
      <BlurCircle bottom='0px' left='600px' />

      <h1 className='text-2xl font-bold mb-8 md:text-left text-center'>My Bookings</h1>

      {bookings.length > 0 ? bookings.map((item, index) => (
        <div
          key={index}
          className='flex flex-col md:flex-row justify-between bg-white/10 border border-primary/20 backdrop-blur-md rounded-xl shadow-md p-4 mr-4 mb-6 max-w-4xl mx-auto md:ml-0 md:mr-auto hover:scale-[1.01] transition-all duration-200'
        >
          {/* Left: Movie Info */}
          <div className='flex flex-col sm:flex-row gap-4 w-full md:w-auto'>
            <img
              src={image_base_url + item.show.movie.poster_path}
              alt={item.show.movie.title}
              className='w-full sm:w-40 aspect-video object-cover rounded-lg shadow-sm'
            />
            <div className='flex flex-col justify-between'>
              <div>
                <p className='text-lg sm:text-xl font-semibold mb-1'>{item.show.movie.title}</p>
                <p className='text-gray-400 text-sm mb-1'>Duration: {timeFormate(item.show.movie.runtime)}</p>
                <p className='text-gray-400 text-sm'>Date: {dateFormat(item.show.showDateTime)}</p>
              </div>
            </div>
          </div>

          {/* Right: Booking Info */}
          <div className='flex flex-col justify-between mt-4 md:mt-0 md:items-end text-left md:text-right w-full md:w-auto'>
            <div className='flex items-center gap-3 justify-between md:justify-end'>
              <p className='text-xl sm:text-2xl font-semibold text-primary'>
                {currency}{item.amount}
              </p>
              {
                !item.isPaid &&
                <Link to={item.paymentLink} className='bg-primary text-white px-4 py-1.5 text-sm rounded-full font-medium hover:bg-primary/90 transition'>
                  Pay Now
                </Link>
              }
            </div>

            <div className='text-gray-400 text-sm mt-3'>
              <p>Total Tickets: <span className='font-medium text-white'>{item.bookedSeats.length}</span></p>
              <p>Seat Number: <span className='font-medium text-white'>{item.bookedSeats.join(', ')}</span></p>
            </div>
          </div>
        </div>
      )) : (
        <p className='text-center text-gray-400'>No bookings found.</p>
      )}
    </div>
  ) : <Loading />;
}

export default MyBookings;
