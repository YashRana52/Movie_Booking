import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import { ArrowRight, ClockIcon } from 'lucide-react';
import BlurCircle from '../components/BlurCircle';
import toast from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import { useClerk } from '@clerk/clerk-react'; // ✅ Same as Navbar

function SeatLayout() {
  const groupRows = [["A", "B"], ["C", "D"], ["E", "F"], ["G", "H"], ["I", "J"]];
  const { id, date } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const [show, setShow] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);

  const { axios, getToken, user } = useAppContext();
  const { openSignIn } = useClerk(); // ✅ Correct, as per your Navbar logic

  const formatDate = (dateStr) => {
    const parts = dateStr.split('-');
    return parts.length === 3 ? `${parts[0]}-${parts[1]}-${parts[2]}` : dateStr;
  };

  const formattedDate = formatDate(date);

  const getShow = async () => {
    try {
      const { data } = await axios.get(`/api/show/${id}`);
      if (data.success) {
        setShow(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOccupiedSeats = async () => {
    try {
      if (!selectedTime?.showId) return;
      const { data } = await axios.get(`/api/booking/seats/${selectedTime.showId}`);
      if (data.success) {
        setOccupiedSeats(data.occupiedSeats);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSeatClick = (seatId) => {
    if (!selectedTime) return toast('Please select time first');

    if (!selectedSeats.includes(seatId) && selectedSeats.length >= 5)
      return toast("You can only select up to 5 seats");

    if (occupiedSeats.includes(seatId)) return toast('This seat is already booked');

    setSelectedSeats(prev =>
      prev.includes(seatId)
        ? prev.filter(seat => seat !== seatId)
        : [...prev, seatId]
    );
  };

  const renderSeats = (row, count = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      <div className="flex flex-wrap items-center justify-center gap-2">
        {Array.from({ length: count }, (_, i) => {
          const seatId = `${row}${i + 1}`;
          return (
            <button
              key={seatId}
              onClick={() => handleSeatClick(seatId)}
              className={`h-8 w-8 rounded border border-primary/60 cursor-pointer
                ${selectedSeats.includes(seatId) ? "bg-primary text-white" : ""}
                ${occupiedSeats.includes(seatId) ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={occupiedSeats.includes(seatId)}
            >
              {seatId}
            </button>
          );
        })}
      </div>
    </div>
  );

  const bookTicket = async () => {
    try {
      if (!user) {
        toast.error('Please login to proceed');
        return openSignIn(); // ✅ Same login logic as Navbar
      }

      if (!selectedTime || !selectedSeats.length)
        return toast.error('Please select a time and seats');

      const { data } = await axios.post('/api/booking/create', {
        showId: selectedTime.showId,
        selectedSeats
      }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const formatTo12Hour = (timeStr) => {
    if (!timeStr) return "";
    const [hourStr, minuteStr] = timeStr.split(':');
    let hour = parseInt(hourStr, 10);
    const minute = minuteStr.padStart(2, '0');
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  useEffect(() => {
    getShow();
  }, []);

  useEffect(() => {
    getOccupiedSeats();
  }, [selectedTime]);

  return show ? (
    <div className='flex flex-col md:flex-row px-6 md:px-16 lg:px-40 py-30 md:pt-50'>
      {/* Available timings */}
      <div className='w-60 bg-primary/10 border border-primary/20 rounded-lg py-10 h-max md:sticky md:top-30'>
        <p className='text-lg font-semibold px-6'>Available Timings</p>
        <div className='mt-5 space-y-1'>
          {show.dateTime && show.dateTime[formattedDate]?.length > 0 ? (
            show.dateTime[formattedDate].map((item) => (
              <div
                key={item.time}
                onClick={() => setSelectedTime(item)}
                className={`flex items-center gap-2 px-6 py-2 w-max rounded-r-md cursor-pointer transition ${
                  selectedTime?.time === item.time
                    ? "bg-primary text-white"
                    : "hover:bg-primary/20"
                }`}
              >
                <ClockIcon className='w-4 h-4' />
                <p className='text-sm'>{formatTo12Hour(item.time)}</p>
              </div>
            ))
          ) : (
            <p className='px-6 text-sm text-red-500'>No timings available for this date.</p>
          )}
        </div>
      </div>

      {/* Seat Layout */}
      <div className='relative flex-1 flex flex-col items-center max-md:mt-16'>
        <BlurCircle top='-100px' left='-100px' />
        <BlurCircle bottom='0px' right='0' />
        <h1 className='text-2xl font-semibold mb-4'>Select Your Seat</h1>
        <img src={assets.screenImage} alt="screen" />
        <p className='text-gray-400 text-sm mb-6'>SCREEN SIDE</p>
        <div className='flex flex-col items-center mt-10 text-xs text-gray-300'>
          <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-2 mb-6'>
            {groupRows[0].map(row => renderSeats(row))}
          </div>
          <div className='grid grid-cols-2 gap-11'>
            {groupRows.slice(1).map((group, idx) => (
              <div key={idx}>
                {group.map(row => renderSeats(row))}
              </div>
            ))}
          </div>
        </div>

        {selectedSeats.length > 0 && selectedTime && (
          <button onClick={bookTicket}
            className='flex items-center gap-1 mt-20 px-10 py-3 text-sm bg-primary hover:bg-primary-dull transition rounded-full font-medium cursor-pointer active:scale-95'>
            Proceed to CheckOut
            <ArrowRight strokeWidth={3} className='h-4 w-4' />
          </button>
        )}
      </div>
    </div>
  ) : (
    <Loading />
  );
}

export default SeatLayout;
