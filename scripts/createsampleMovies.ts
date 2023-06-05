import mongoose from 'mongoose';
require('dotenv').config();

// Connection URL and database name
const url = 'mongodb://localhost:27017';
const dbName = 'your_database_name';

// Define the movie schema
const movieSchema = new mongoose.Schema({
    name: String,
    description: String,
    release_date: Date,
    ticket_price : Number,
    ratingsum: { type: Number, default: 0 },
    ratingcount: { type: Number, default: 0 },
    commentcount: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    country: String,
    genre: String,
});

// Create the Movie model
const Movie = mongoose.model('Movie', movieSchema);

async function insertMovies() {
    try {
      // Connect to the MongoDB server
      await mongoose.connect(process.env.DB_URI);
  
      // Insert the movies into the collection
      const movie = 
        {
            "name":"Terminator444", "description":"Action movie","release_date":"2023-06-03T20:50:18.709Z","ticket_price":15,"country":"America","genre":"Action"
        };
  
      const result = await Movie.create(movie);
      console.log('Movies inserted:', result);
    } catch (error) {
      console.error('Error inserting movies:', error);
    } finally {
      // Close the MongoDB connection
      await mongoose.disconnect();
    }
  }

  // Call the function to insert the movies
insertMovies();