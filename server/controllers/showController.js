import axios from 'axios';
import Movie from '../models/Movie.js';
import Show from '../models/Show.js';

// Get Now Playing Movies
export const getNowPlayingMovies = async (req, res) => {
  try {
    const { data } = await axios.get('https://api.themoviedb.org/3/discover/movie', {
      headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` },
      params: {
        with_original_language: 'hi', 
        sort_by: 'popularity.desc',   
        page: 1
      }
    });

    res.json({ success: true, movies: data.results });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// Add Show
export const addShow = async (req, res) => {
  try {
    const { movieId, showsInput, showPrice } = req.body;

    if (!movieId || !showPrice || !Array.isArray(showsInput)) {
      return res.status(400).json({ success: false, message: 'movieId, showPrice, and showsInput[] are required.' });
    }

    let movie = await Movie.findById(String(movieId));
    if (!movie) {
      const [detailsRes, creditRes] = await Promise.all([
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } }),
        axios.get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, { headers: { Authorization: `Bearer ${process.env.TMDB_API_KEY}` } })
      ]);

      const movieApiData = detailsRes.data;
      const movieCreditsData = creditRes.data;

      movie = await Movie.create({
        _id: String(movieId),
        title: movieApiData.title,
        overview: movieApiData.overview,
        poster_path: movieApiData.poster_path,
        backdrop_path: movieApiData.backdrop_path,
        genres: movieApiData.genres,
        casts: movieCreditsData.cast,
        release_date: movieApiData.release_date,
        original_language: movieApiData.original_language,
        tagline: movieApiData.tagline || "",
        vote_average: movieApiData.vote_average,
        runtime: movieApiData.runtime
      });
    }

    const showsToCreate = [];
    showsInput.forEach(show => {
      if (!show.date || !Array.isArray(show.time)) return;
      show.time.forEach(time => {
        const dateTimeString = `${show.date}T${time}`;
        showsToCreate.push({
          movie: movie._id,
          showDateTime: new Date(dateTimeString),
          showPrice,
          occupiedSeats: {}
        });
      });
    });

    if (showsToCreate.length > 0) {
      await Show.insertMany(showsToCreate);
      return res.json({ success: true, message: 'Show added successfully!' });
    } else {
      return res.json({ success: false, message: 'No shows to add.' });
    }

  } catch (error) {
    console.error('addShow error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Shows
export const getShows = async (req, res) => {
  try {
    const shows = await Show.find({ showDateTime: { $gte: new Date() } })
      .populate('movie')
      .sort({ showDateTime: 1 });

    const uniqueShows = new Set(shows.map(show => show.movie));
    res.json({ success: true, shows: Array.from(uniqueShows) });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Corrected Get Single Show — for SeatLayout and Timings:
export const getShow = async (req, res) => {
  try {
    const { movieId } = req.params;
    const shows = await Show.find({ movie: movieId, showDateTime: { $gte: new Date() } });
    const movie = await Movie.findById(movieId);

    const dateTime = {}; // Final data structure for front-end

    shows.forEach((show) => {
      const showTime = new Date(show.showDateTime);

      if (isNaN(showTime.getTime())) {
        console.warn(`Invalid showDateTime in show: ${show._id}`);
        return;
      }

      const dateStr = showTime.toISOString().split('T')[0]; 
      const timeStr = showTime.toISOString().split('T')[1]; 
      const timeOnly = timeStr.split('.')[0]; 

      if (!dateTime[dateStr]) {
        dateTime[dateStr] = [];
      }

      dateTime[dateStr].push({
        time: timeOnly,
        showId: show._id
      });
    });

    res.json({ success: true, movie, dateTime });

  } catch (error) {
    console.error("Error in getShow:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
