/* ── Leads Module ─────────────────────────────────────────── */
let leadsData = [];

async function loadLeads(params = {}) {
    try {
        const tbody = document.getElementById('leadsBody');
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Loading…</td></tr>';
        leadsData = await api.getLeads(params);
        renderLeadsTable(leadsData);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function renderLeadsTable(leads) {
    const tbody = document.getElementById('leadsBody');
    if (!leads.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No leads found. Click "Add Lead" to start!</td></tr>';
        return;
    }
    tbody.innerHTML = leads.map(l => `
    <tr>
      <td><strong>${escHtml(l.name)}</strong></td>
      <td>${escHtml(l.company || '–')}</td>
      <td>${escHtml(l.email || '–')}</td>
      <td><span class="badge badge-${l.status.toLowerCase()}">${l.status}</span></td>
      <td>${l.value ? '₹' + Number(l.value).toLocaleString() : '–'}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-ghost btn-sm" onclick="openEditLeadModal(${l.id})" title="Edit">
            <i data-lucide="pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteLead(${l.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
    lucide.createIcons();
}

function openAddLeadModal() {
    showModal('Add Lead', leadForm());
    document.getElementById('leadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = getLeadFormData();
        try {
            await api.createLead(data);
            closeModal();
            showToast('Lead added!', 'success');
            loadLeads(getCurrentLeadFilters());
        } catch (err) { showToast(err.message, 'error'); }
    });
}

async function openEditLeadModal(id) {
    const lead = leadsData.find(l => l.id === id);
    if (!lead) return;
    showModal('Edit Lead', leadForm(lead));
    document.getElementById('leadForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = getLeadFormData();
        try {
            await api.updateLead(id, data);
            closeModal();
            showToast('Lead updated!', 'success');
            loadLeads(getCurrentLeadFilters());
        } catch (err) { showToast(err.message, 'error'); }
    });
}

async function deleteLead(id) {
    if (!confirm('Delete this lead? This cannot be undone.')) return;
    try {
        await api.deleteLead(id);
        showToast('Lead deleted', 'success');
        loadLeads(getCurrentLeadFilters());
    } catch (err) { showToast(err.message, 'error'); }
}

function leadForm(lead = {}) {
    return `
    <form id="leadForm">
      <div class="form-row">
        <div class="form-group">
          <label>Name *</label>
          <input name="name" value="${escAttr(lead.name || '')}" placeholder="John Doe" required />
        </div>
        <div class="form-group">
          <label>Company</label>
          <input name="company" value="${escAttr(lead.company || '')}" placeholder="Acme Corp" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Email</label>
          <input name="email" type="email" value="${escAttr(lead.email || '')}" placeholder="john@example.com" />
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input name="phone" value="${escAttr(lead.phone || '')}" placeholder="+91 98765 43210" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Status</label>
          <select name="status">
            ${['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'].map(s =>
        `<option ${(lead.status || 'New') === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label>Deal Value (₹)</label>
          <input name="value" type="number" min="0" value="${lead.value || ''}" placeholder="0" />
        </div>
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea name="notes" placeholder="Any relevant notes…">${escHtml(lead.notes || '')}</textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">${lead.id ? 'Save Changes' : 'Add Lead'}</button>
      </div>
    </form>
  `;
}

function getLeadFormData() {
    const f = document.getElementById('leadForm');
    return {
        name: f.name.value.trim(),
        company: f.company.value.trim() || null,
        email: f.email.value.trim() || null,
        phone: f.phone.value.trim() || null,
        status: f.status.value,
        value: parseFloat(f.value.value) || 0,
        notes: f.notes.value.trim(),
    };
}

function getCurrentLeadFilters() {
    const params = {};
    const search = document.getElementById('leadSearch')?.value?.trim();
    const status = document.getElementById('statusFilter')?.value;
    if (search) params.search = search;
    if (status) params.status = status;
    return params;
}

// Wire up search & filter
document.addEventListener('DOMContentLoaded', () => {
    let debounce;
    document.getElementById('leadSearch')?.addEventListener('input', (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => loadLeads(getCurrentLeadFilters()), 350);
    });
    document.getElementById('statusFilter')?.addEventListener('change', () => {
        loadLeads(getCurrentLeadFilters());
    });
});
