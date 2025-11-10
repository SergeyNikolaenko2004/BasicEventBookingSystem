const express = require('express');
const pool = require('../config/database');

const router = express.Router();

router.post('/reserve', async (req, res) => {
  const { event_id, user_id } = req.body;

  if (!event_id || !user_id) {
    return res.status(400).json({
      error: 'event_id and user_id are required'
    });
  }

  try {
    const eventCheck = await pool.query(
      'SELECT * FROM events WHERE id = $1',
      [event_id]
    );

    if (eventCheck.rows.length === 0) {
      return res.status(404).json({
        error: 'Event not found'
      });
    }

    const result = await pool.query(
      `INSERT INTO bookings (event_id, user_id) 
       VALUES ($1, $2) 
       RETURNING *`,
      [event_id, user_id]
    );

    res.status(201).json({
      success: true,
      booking: result.rows[0]
    });

  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'User already booked for this event'
      });
    }
    
    console.error('Booking error:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

module.exports = router;