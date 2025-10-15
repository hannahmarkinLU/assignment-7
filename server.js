const express = require('express');
const { body, validationResult } = require('express-validator');
const { db, Track } = require('./database/setup');

const app = express();
const PORT = process.env.PORT || 3000;

// Format track for API output
function formatTrack(track) {
  // Convert integers to mm:ss format
  const minutes = Math.floor(track.duration / 100);
  const seconds = track.duration % 100;
  const formattedDuration = `${minutes}:${seconds.toString().padStart(2, '0')}`;

  return {
    trackId: track.trackId,
    songTitle: track.songTitle,
    artistName: track.artistName,
    albumName: track.albumName,
    genre: track.genre,
    duration: formattedDuration,
    releaseYear: track.releaseYear
  };
}

// === MIDDLEWARE ====

// Built-in middleware to parse JSON requests
app.use(express.json());

// Validation middleware
const validateTrack = [

    body('songTitle')
        .exists({ checkFalsy: true }).withMessage('Song title is required')
        .isString().withMessage('Song title must be a string'),

    body('artistName')
        .exists({ checkFalsy: true }).withMessage('Artist name is required')
        .isString().withMessage('Artist name must be a string'),

    body('albumName')
        .exists({ checkFalsy: true }).withMessage('Album is required')
        .isString().withMessage('Album must be a string'),

    body('genre')
        .exists({ checkFalsy: true }).withMessage('Genre is required')
        .isString().withMessage('Genre must be a string'),

    body('duration')
        .exists({ checkFalsy: true }).withMessage('Duration is required')
        .isInt().withMessage('Duration must be an integer'),

    body('releaseYear')
        .exists({ checkFalsy: true }).withMessage('Release year is required')
        .isInt().withMessage('Release year must be an integer')
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
  
    if (!errors.isEmpty()) {
        const errorMessages =
    errors.array().map(error => error.msg);
    
        return res.status(400).json({
            error: 'Validation failed',
            messages: errorMessages
        });
    }
  
    next();
};

// === ROUTES ===

// GET /api/tracks - Get all tracks
app.get('/api/tracks', async (req, res) => {
  try {
    const tracks = await Track.findAll();
    res.json(tracks.map(formatTrack));
  } catch (error) {
    console.error('Error fetching tracks:', error); // keep this
    res.status(500).json({ error: 'Failed to fetch tracks' });
  }
});

// GET /api/tracks/:id - Get track by ID
app.get('/api/tracks/:id', async (req, res) => {
    try {
        const track = await
    Track.findByPk(req.params.id);
    
        if (!track) {
            return res.status(404).json({ error: 
        'Track not found' });
        }
    
        res.json(formatTrack(track));
    } catch (error) {
        console.error('Error fetching track:', error.message, error);
        res.status(500).json({ error: 'Failed to fetch track' });
    }
});

// POST /api/tracks - Create new track
app.post('/api/tracks', validateTrack, handleValidationErrors, async (req, res) => {
    try {
        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
    
        const newTrack = await Track.create({
            songTitle,
            artistName,
            albumName,
            genre,
            duration,
            releaseYear
        });
    
        res.status(201).json(newTrack);
    } catch (error) {
        console.error('Error creating track:', error.message, error);
        res.status(500).json({ error: 'Failed to create track' });
    }
});

// PUT /api/tracks/:id - Update existing track
app.put('/api/tracks/:id', validateTrack, handleValidationErrors, async (req, res) => {
    try {
        const { songTitle, artistName, albumName, genre, duration, releaseYear } = req.body;
    
        const [updatedRowsCount] = await Track.update(
            { songTitle, artistName, albumName, genre, duration, releaseYear },
            { where: { trackId: req.params.id } }
        );
    
        if (updatedRowsCount === 0) {
            return res.status(404).json({ error: 'Track not found' });
        }
    
        const updatedTrack = await
    Track.findByPk(req.params.id);
        res.json(updatedTrack);
    } catch (error) {
        console.error('Error updating track:', error.message, error);
        res.status(500).json({ error: 'Failed to update track' });
    }
});

// DELETE /api/tracks/:id - Delete track
app.delete('/api/tracks/:id', validateTrack, handleValidationErrors, async (req, res) => {
    try {
        const deletedRowsCount = await
    Track.destroy({
            where: { trackId: req.params.id }
        });
    
        if (deletedRowsCount === 0) {
            return res.status(404).json({ error: 
        'Track not found' });
        }
    
        res.json({ message: 'Track deleted successfully' });
    } catch (error) {
        console.error('Error deleting track:', error.message, error);
        res.status(500).json({ error: 'Failed to delete track' });
  }
});

// === TEST CONNECTION & START SERVER ===

// Test database connection
async function testConnection() {
  try {
    await db.authenticate();
    console.log('Connection to database established successfully.');

    // Create tables if they don't exist
    await db.sync();
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

testConnection();

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

// Export for testing
module.exports = app;