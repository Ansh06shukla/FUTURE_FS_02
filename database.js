/**
 * Pure JavaScript JSON-based data store.
 * No native modules required — works on all systems.
 * Data is persisted to crm.json in the project root.
 */
const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, 'crm.json');

// ── Helpers ──────────────────────────────────────────────────
function load() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = {
      _seq: { leads: 0, clients: 0, activities: 0 },
      leads: [],
      clients: [],
      activities: []
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
    return initial;
  }
  return JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
}

function save(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function nextId(data, table) {
  data._seq[table] = (data._seq[table] || 0) + 1;
  return data._seq[table];
}

function now() {
  return new Date().toISOString().replace('T', ' ').slice(0, 19);
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

// ── Generic CRUD factory ─────────────────────────────────────
function makeStore(table) {
  return {
    all(filter) {
      const data = load();
      let rows = [...data[table]].reverse(); // newest first
      if (filter) rows = rows.filter(filter);
      return rows;
    },
    get(id) {
      id = Number(id);
      return load()[table].find(r => r.id === id) || null;
    },
    create(fields) {
      const data = load();
      const record = { id: nextId(data, table), ...fields, created_at: now() };
      data[table].push(record);
      save(data);
      return record;
    },
    update(id, fields) {
      id = Number(id);
      const data = load();
      const idx = data[table].findIndex(r => r.id === id);
      if (idx === -1) return null;
      // Merge: only overwrite fields that are not undefined/null passed intentionally
      Object.keys(fields).forEach(k => {
        if (fields[k] !== undefined) data[table][idx][k] = fields[k];
      });
      save(data);
      return data[table][idx];
    },
    delete(id) {
      id = Number(id);
      const data = load();
      const before = data[table].length;
      data[table] = data[table].filter(r => r.id !== id);
      if (data[table].length === before) return false;
      // Nullify FKs in activities when a lead/client is deleted
      if (table === 'leads') {
        data.activities = data.activities.map(a =>
          a.lead_id === id ? { ...a, lead_id: null } : a
        );
      }
      if (table === 'clients') {
        data.activities = data.activities.map(a =>
          a.client_id === id ? { ...a, client_id: null } : a
        );
      }
      save(data);
      return true;
    }
  };
}

// ── Stores ────────────────────────────────────────────────────
const db = {
  leads: makeStore('leads'),
  clients: makeStore('clients'),
  activities: makeStore('activities'),

  // Return activities joined with lead/client names
  activitiesJoined() {
    const data = load();
    return [...data.activities].reverse().slice(0, 200).map(a => ({
      ...a,
      lead_name: data.leads.find(l => l.id === a.lead_id)?.name || null,
      client_name: data.clients.find(c => c.id === a.client_id)?.name || null,
    }));
  },

  // Dashboard stats
  dashboard() {
    const data = load();
    const leads = data.leads;
    const clients = data.clients;
    const acts = data.activities;

    const pipelineValue = leads
      .filter(l => !['Won', 'Lost'].includes(l.status))
      .reduce((s, l) => s + (Number(l.value) || 0), 0);

    const wonValue = leads
      .filter(l => l.status === 'Won')
      .reduce((s, l) => s + (Number(l.value) || 0), 0);

    const statusCounts = {};
    leads.forEach(l => {
      statusCounts[l.status] = (statusCounts[l.status] || 0) + 1;
    });
    const leadsByStatus = Object.entries(statusCounts)
      .map(([status, count]) => ({ status, count }));

    const recentActivities = [...acts].reverse().slice(0, 10).map(a => ({
      ...a,
      lead_name: leads.find(l => l.id === a.lead_id)?.name || null,
      client_name: clients.find(c => c.id === a.client_id)?.name || null,
    }));

    return {
      totalLeads: leads.length,
      totalClients: clients.length,
      pipelineValue,
      wonValue,
      leadsByStatus,
      recentActivities
    };
  },

  now,
  today
};

module.exports = db;
