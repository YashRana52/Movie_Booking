// @ts-ignore
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react';
import { assets } from '../assets/assets';
import { useClerk, UserButton, useUser } from '@clerk/clerk-react';
import { useAppContext } from '../context/AppContext';

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { user } = useUser();
    const { openSignIn } = useClerk();
    const navigate = useNavigate();
   const { favoriteMovies } = useAppContext();

    return (
     <div className='fixed top-0 left-0 z-50 w-full bg-gray-900 flex items-center justify-between px-4 md:px-12 lg:px-24 py-3'>


    <Link to='/' className='flex items-center'>
        <img src={assets.logo6} alt="Logo" className='w-40 h-20 object-contain' />
    </Link>


            
            
            

            {/* Menu for Desktop */}
            <div className='hidden md:flex items-center gap-8 bg-black/40 px-8 py-2 rounded-full backdrop-blur border border-gray-300/20'>
                <Link to='/' className='text-white'>Home</Link>
                <Link to='/movies' className='text-white'>Movies</Link>
                <Link to='/' className='text-white'>Theaters</Link>
                <Link to='/' className='text-white'>Releases</Link>
                {
                     favoriteMovies.length>0 &&  <Link to='/favorite' className='text-white'>Favorites</Link>
                }
                
              
                
            </div>
            

            {/* Search + Login */}
            <div className='hidden md:flex items-center gap-4'>
                <SearchIcon className='w-5 h-5 text-white cursor-pointer' />
                {
                    !user ? (
                        <button
                            // @ts-ignore
                            onClick={openSignIn}
                            className='px-4 py-1 sm:px-7 sm:py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium text-white cursor-pointer'>
                            Login
                        </button>
                    ) : (
                        <UserButton>
                            <UserButton.MenuItems>
                                <UserButton.Action
                                    label='My Booking'
                                    labelIcon={<TicketPlus width={15} />}
                                    onClick={() => navigate('/my-bookings')}
                                />
                            </UserButton.MenuItems>
                        </UserButton>
                    )
                }
            </div>

            {/* Mobile Menu Icon */}
            <MenuIcon
                className='md:hidden w-8 h-8 text-white cursor-pointer'
                onClick={() => setMenuOpen(true)}
            />

            {/* Mobile Menu Overlay */}
            {menuOpen && (
                <div className='fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 gap-8'>
                    <XIcon
                        className='absolute top-6 right-6 w-6 h-6 text-white cursor-pointer'
                        onClick={() => setMenuOpen(false)}
                    />
                    <Link to='/' className='text-white text-xl' onClick={() => { scrollTo(0, 0); setMenuOpen(false) }}>Home</Link>
                    <Link to='/movies' className='text-white text-xl' onClick={() => { scrollTo(0, 0); setMenuOpen(false) }}>Movies</Link>
                    <Link to='/' className='text-white text-xl' onClick={() => { scrollTo(0, 0); setMenuOpen(false) }}>Theaters</Link>
                    <Link to='/' className='text-white text-xl' onClick={() => { scrollTo(0, 0); setMenuOpen(false) }}>Releases</Link>
                    {
                        favoriteMovies.length>0 &&
                          <Link to='/favorite' className='text-white text-xl' onClick={() => { scrollTo(0, 0); setMenuOpen(false) }}>Favorites</Link>
                    }
                  
                    {
                        !user ? (
                            <button
                                // @ts-ignore
                                onClick={openSignIn}
                                className='px-7 py-2 bg-primary hover:bg-primary-dull transition rounded-full font-medium text-white'>
                                Login
                            </button>
                        ) : (
                            <UserButton afterSignOutUrl='/'>
                                <UserButton.MenuItems>
                                    <UserButton.Action
                                        label='My Booking'
                                        labelIcon={<TicketPlus width={15} />}
                                        onClick={() => { navigate('/my-bookings'); setMenuOpen(false); }}
                                    />
                                </UserButton.MenuItems>
                            </UserButton>
                        )
                    }
                </div>
            )}
        </div>
    )
}

export default Navbar;
