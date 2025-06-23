import React, { useState } from 'react';
import BlurCircle from './BlurCircle';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function DataSelect({ dateTime, id }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const onBookHandler = () => {
    if (!selected) return toast.error('Please select a date');
    navigate(`/movies/${id}/${selected}`);
    scrollTo(0, 0);
  };

  // dateTime keys: ["2025-06-27", "2025-06-28", ...]
  const availableDates = dateTime ? Object.keys(dateTime) : [];

  return (
    <div id='dateSelect' className='pt-28 md:pt-36 px-4'>
      <div className='relative flex flex-col md:flex-row items-center justify-between gap-10 p-8 text-white border border-primary/30 rounded-2xl overflow-hidden'>
        <BlurCircle top='-100px' left='-100px' />
        <BlurCircle top='100px' right='0px' />
        <div>
          <p className='text-lg font-semibold mb-4'>Choose Date</p>
          <div className='flex items-center gap-6'>
            <button><ChevronLeft className='w-6 h-6 hover:scale-110 transition-all' /></button>
            <div className='grid grid-cols-3 md:flex flex-wrap gap-4'>
              {availableDates.map((dateStr) => {
                const [year, month, day] = dateStr.split('-');
                const dateObj = new Date(year, month - 1, day);
                const isSelected = selected === dateStr;

                return (
                  <button
                    key={dateStr}
                    onClick={() => setSelected(dateStr)}
                    className={`flex flex-col items-center justify-center h-14 w-14 rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-white text-primary border-white'
                        : 'bg-white/10 text-white hover:bg-white/20 border-white/20'
                    }`}
                  >
                    <span className='text-lg font-bold'>{dateObj.getDate()}</span>
                    <span className='text-xs'>
                      {dateObj.toLocaleDateString('en-US', { month: 'short' })}
                    </span>
                  </button>
                );
              })}
            </div>
            <button><ChevronRight className='w-6 h-6 hover:scale-110 transition-all' /></button>
          </div>
        </div>
        <button
          onClick={onBookHandler}
          className='text-white bg-primary px-8 py-2 mt-6 rounded-full hover:bg-primary/90 hover:text-white transition-all cursor-pointer'
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default DataSelect;
