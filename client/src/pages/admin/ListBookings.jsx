import React, { useEffect, useState } from 'react';
import Loading from '../../components/Loading';
import Title from '../../components/admin/Title';
import { dateFormat } from '../../lib/dateFormate';
import { useAppContext } from '../../context/AppContext';

function ListBookings() {
  const { axios, getToken, user } = useAppContext();
  const currency = import.meta.env.VITE_CURRENCY;

  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const getAllBookings = async () => {
    try {
      const { data } = await axios.get('/api/admin/all-bookings', {
        headers: {
          Authorization: `Bearer ${await getToken()}`
        }
      });
      setBookings(data.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllBookings();
    }
  }, [user]);

  if (loading) return <Loading />;

  return (
    <>
      <Title text1='List' text2='Bookings' />
      <div className='max-w-4xl mt-6 overflow-x-auto'>
        <table className='w-full border-collapse rounded-md overflow-hidden text-nowrap'>
          <thead>
            <tr className="bg-primary/20 text-left text-white">
              <th className="p-2 font-medium pl-5">User Name</th>
              <th className="p-2 font-medium">Movie Name</th>
              <th className="p-2 font-medium">Show Time</th>
              <th className="p-2 font-medium">Seats</th>
              <th className="p-2 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody className="text-sm font-light">
            {bookings.length > 0 ? (
              bookings.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-primary/20 bg-primary/5 even:bg-primary/10"
                >
                  <td className="p-2 min-w-45 pl-5">{item?.user?.name || 'N/A'}</td>
                  <td className="p-2">{item?.show?.movie?.title || 'N/A'}</td>
                  <td className="p-2">{item?.show?.showDateTime ? dateFormat(item.show.showDateTime) : 'N/A'}</td>
                  <td className="p-2">
                    {item?.bookedSeats
                      ? Object.keys(item.bookedSeats)
                          .map(seat => item.bookedSeats[seat])
                          .join(", ")
                      : 'N/A'}
                  </td>
                  <td className="p-2">
                    {currency} {item?.amount || 0}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default ListBookings;
