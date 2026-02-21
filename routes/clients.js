const express = require('express');
const router = express.Router();
const db = require('../database');

// GET all clients
router.get('/', (req, res) => {
    try {
        const { search } = req.query;
        let clients = db.clients.all();
        if (search) {
            const s = search.toLowerCase();
            clients = clients.filter(c =>
                (c.name || '').toLowerCase().includes(s) ||
                (c.email || '').toLowerCase().includes(s) ||
                (c.company || '').toLowerCase().includes(s)
            );
        }
        res.json(clients);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single client
router.get('/:id', (req, res) => {
    try {
        const client = db.clients.get(req.params.id);
        if (!client) return res.status(404).json({ error: 'Client not found' });
        res.json(client);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create client
router.post('/', (req, res) => {
    try {
        const { name, email, phone, company, address, notes = '' } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const client = db.clients.create({ name, email: email || null, phone: phone || null, company: company || null, address: address || null, notes });
        res.status(201).json(client);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update client
router.put('/:id', (req, res) => {
    try {
        const existing = db.clients.get(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Client not found' });
        const { name, email, phone, company, address, notes } = req.body;
        const updated = db.clients.update(req.params.id, {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(phone !== undefined && { phone }),
            ...(company !== undefined && { company }),
            ...(address !== undefined && { address }),
            ...(notes !== undefined && { notes }),
        });
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE client
router.delete('/:id', (req, res) => {
    try {
        const ok = db.clients.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Client not found' });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
