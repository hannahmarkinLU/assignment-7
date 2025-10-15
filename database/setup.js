const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config({ path: '../.env' });

// Database connection
const path = require('path');
const dbPath = path.resolve(__dirname, 'music_library.db');

const db = new Sequelize({
  dialect: 'sqlite',
  storage: dbPath,
  logging: console.log
});

async function setupDatabase() { 
    try { 
        await db.authenticate(); 
        console.log('Connection to database established successfully.'); 

        await db.sync();
        console.log('Database file created at: ./database/music_library.db');

        await db.close(); 
    } catch (error) { 
         console.error('Unable to connect to the database:', error); 
    } 
}

// Define Track model
const Track = db.define('Track', {
  trackId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  songTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  artistName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  albumName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  releaseYear: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});

// Export the model and the connection to use in other files 
module.exports = { db, Track };