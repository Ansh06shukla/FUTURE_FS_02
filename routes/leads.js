const express = require('express');
const router = express.Router();
const db = require('../database');

const VALID_STATUSES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];

// GET all leads
router.get('/', (req, res) => {
    try {
        const { status, search } = req.query;
        let leads = db.leads.all();
        if (status && VALID_STATUSES.includes(status)) {
            leads = leads.filter(l => l.status === status);
        }
        if (search) {
            const s = search.toLowerCase();
            leads = leads.filter(l =>
                (l.name || '').toLowerCase().includes(s) ||
                (l.email || '').toLowerCase().includes(s) ||
                (l.company || '').toLowerCase().includes(s)
            );
        }
        res.json(leads);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// GET single lead
router.get('/:id', (req, res) => {
    try {
        const lead = db.leads.get(req.params.id);
        if (!lead) return res.status(404).json({ error: 'Lead not found' });
        res.json(lead);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// POST create lead
router.post('/', (req, res) => {
    try {
        const { name, email, phone, company, status = 'New', value = 0, notes = '' } = req.body;
        if (!name) return res.status(400).json({ error: 'Name is required' });
        const lead = db.leads.create({ name, email: email || null, phone: phone || null, company: company || null, status, value: Number(value) || 0, notes });
        res.status(201).json(lead);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// PUT update lead
router.put('/:id', (req, res) => {
    try {
        const existing = db.leads.get(req.params.id);
        if (!existing) return res.status(404).json({ error: 'Lead not found' });
        const { name, email, phone, company, status, value, notes } = req.body;
        const updated = db.leads.update(req.params.id, {
            ...(name !== undefined && { name }),
            ...(email !== undefined && { email }),
            ...(phone !== undefined && { phone }),
            ...(company !== undefined && { company }),
            ...(status !== undefined && { status }),
            ...(value !== undefined && { value: Number(value) || 0 }),
            ...(notes !== undefined && { notes }),
        });
        res.json(updated);
    } catch (err) { res.status(500).json({ error: err.message }); }
});

// DELETE lead
router.delete('/:id', (req, res) => {
    try {
        const ok = db.leads.delete(req.params.id);
        if (!ok) return res.status(404).json({ error: 'Lead not found' });
        res.json({ success: true });
    } catch (err) { res.status(500).json({ error: err.message }); }
});

module.exports = router;
