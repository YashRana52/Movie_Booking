import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function Loading() {
  const { nextUrl } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (nextUrl) {
      const timer = setTimeout(() => {
        navigate('/' + nextUrl);
      }, 5000);

      return () => clearTimeout(timer); 
    } else {
      console.warn('nextUrl is undefined'); 
    }
  }, [nextUrl, navigate]); 

  return (
    <div className="flex items-center justify-center h-[80vh] bg-transparent">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing circle */}
        <div className="absolute h-20 w-20 rounded-full bg-primary opacity-30 animate-ping"></div>

        {/* Spinner */}
        <div className="h-14 w-14 border-4 border-t-primary border-b-primary border-l-transparent border-r-transparent rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export default Loading;
