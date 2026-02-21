const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all activities (with joined names)
router.get('/', (req, res) => {
    try {
        res.json(db.activitiesJoined());
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create activity
router.post('/', (req, res) => {
    try {
        const { type = 'Note', lead_id, client_id, description, date } = req.body;
        if (!description) return res.status(400).json({ error: 'Description is required' });
        const activity = db.activities.create({
            type,
            lead_id: lead_id ? Number(lead_id) : null,
            client_id: client_id ? Number(client_id) : null,
            description,
            date: date || db.today()
        });
        // Return with joined names
        const all = db.activitiesJoined();
        res.status(201).json(all.find(a => a.id === activity.id) || activity);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE activity
router.delete('/:id', (req, res) => {
    try {
        const ok = db.activities.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Activity not found' });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
