/* ── API wrapper ──────────────────────────────────────────── */
const API_BASE = '/api';

async function request(method, path, body) {
    const opts = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(API_BASE + path, opts);
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        throw new Error(err.error || 'Request failed');
    }
    return res.json();
}

// ── Leads ─────────────────────────────────────────────────
const api = {
    // Dashboard
    getDashboard: () => request('GET', '/dashboard'),

    // Leads
    getLeads: (params = {}) => request('GET', '/leads?' + new URLSearchParams(params)),
    createLead: (data) => request('POST', '/leads', data),
    updateLead: (id, data) => request('PUT', `/leads/${id}`, data),
    deleteLead: (id) => request('DELETE', `/leads/${id}`),

    // Clients
    getClients: (params = {}) => request('GET', '/clients?' + new URLSearchParams(params)),
    createClient: (data) => request('POST', '/clients', data),
    updateClient: (id, data) => request('PUT', `/clients/${id}`, data),
    deleteClient: (id) => request('DELETE', `/clients/${id}`),

    // Activities
    getActivities: () => request('GET', '/activities'),
    createActivity: (data) => request('POST', '/activities', data),
    deleteActivity: (id) => request('DELETE', `/activities/${id}`),
};
