import mongoose from "mongoose";

 const connectDB = async()=>{
    try {

  mongoose.connection.on('connected', () => console.log('DataBase connected successfully'));

     

        await mongoose.connect(`${process.env.MONGODB_URI}/MOVIE_BOOKING`)
        
    } catch (error) {
        console.log(error.message);
        
        
    }
 }

 export default connectDB;