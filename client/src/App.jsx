import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetails from './pages/MovieDetails';
import SeatLayout from './pages/SeatLayout';
import MyBookings from './pages/MyBookings';
import Favorite from './pages/Favorite';
import Layout from './pages/admin/Layout';
import DashBoard from './pages/admin/DashBoard';
import AddShows from './pages/admin/AddShows';
import ListShows from './pages/admin/ListShows';
import ListBookings from './pages/admin/ListBookings';
import { useAppContext } from './context/AppContext'; 
import { SignIn } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import Loading from './components/Loading';

function App() {
  const isAdminRoute = useLocation().pathname.startsWith('/admin');
  const { user } = useAppContext();

  return (
    <>
      <Toaster />
      <div className="min-h-screen flex flex-col">
        {!isAdminRoute && <Navbar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/movies/:id/:date" element={<SeatLayout />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/loading/:nextUrl" element={<Loading />} />
            <Route path="/favorite" element={<Favorite />} />
            <Route
              path="/admin/*"
              element={
                user ? (
                  <Layout />
                ) : (
                  <div className="min-h-screen flex justify-center items-center">
                    <SignIn fallbackRedirectUrl="/admin" />
                  </div>
                )
              }
            >
              <Route index element={<DashBoard />} />
              <Route path="add-shows" element={<AddShows />} />
              <Route path="list-shows" element={<ListShows />} />
              <Route path="list-bookings" element={<ListBookings />} />
            </Route>
          </Routes>
        </div>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  );
}

export default App;
