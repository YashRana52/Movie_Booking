import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import Stripe from 'stripe'

// Check seat availability for selected show
export const checkSeatAvailability = async (showId, selectedSeats) => {
  try {
    const showData = await Show.findById(showId);
    if (!showData) return false;

    const occupiedSeats = showData.occupiedSeats;
    const isAnySeatTaken = selectedSeats.some(seat => occupiedSeats[seat]);
    return !isAnySeatTaken;

  } catch (error) {
    console.log(error.message);
    return false;
  }
};

export const createBooking = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { showId, selectedSeats } = req.body;
    const {origin} = req.headers

    // Check seat availability
    const isAvailable = await checkSeatAvailability(showId, selectedSeats);
    if (!isAvailable) {
      return res.json({
        success: false,
        message: "Selected Seats are not available."
      });
    }

    const showData = await Show.findById(showId).populate('movie');

    // Create booking
    const booking = await Booking.create({
      user: userId,
      show: showId,
      amount: showData.showPrice * selectedSeats.length,
      bookedSeats: selectedSeats
    });

    // Mark these seats as occupied by this user
    selectedSeats.forEach(seat => {
      showData.occupiedSeats[seat] = userId;
    });

    showData.markModified('occupiedSeats');
    await showData.save();
//stripe Gateway initialize

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
// Creating line items for stripe
const line_items= [{
  price_data:{
    currency:'INR',
    product_data:{
      name:showData.movie.title
    },
    unit_amount:Math.floor(booking.amount)*100

  },
  quantity:1
}]

const session = await stripeInstance.checkout.sessions.create({
  success_url:`${origin}/loading/my-bookings`,
  cancel_url:`${origin}/my-bookings`,
  line_items:line_items,
  mode:"payment",
  metadata:{
    bookingId:booking._id.toString()

  },
expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
})
booking.paymentLink = session.url
await booking.save()






    res.json({
      success: true,
     url:session.url
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get occupied seats for a show
export const getOccupiedSeats = async (req, res) => {
  try {
    const { showId } = req.params;
    const showData = await Show.findById(showId);

    const occupiedSeats = Object.keys(showData.occupiedSeats);
    res.status(200).json({ success: true, occupiedSeats });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
