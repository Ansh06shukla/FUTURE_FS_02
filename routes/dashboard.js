const express = require('express');
const router = express.Router();
const db = require('../database');

// GET dashboard summary stats
router.get('/', (req, res) => {
    try {
        res.json(db.dashboard());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
