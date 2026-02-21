/* ── Clients Module ────────────────────────────────────────── */
let clientsData = [];

async function loadClients(params = {}) {
    try {
        const tbody = document.getElementById('clientsBody');
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">Loading…</td></tr>';
        clientsData = await api.getClients(params);
        renderClientsTable(clientsData);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function renderClientsTable(clients) {
    const tbody = document.getElementById('clientsBody');
    if (!clients.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="empty-state">No clients yet. Click "Add Client"!</td></tr>';
        return;
    }
    tbody.innerHTML = clients.map(c => `
    <tr>
      <td><strong>${escHtml(c.name)}</strong></td>
      <td>${escHtml(c.company || '–')}</td>
      <td>${escHtml(c.email || '–')}</td>
      <td>${escHtml(c.phone || '–')}</td>
      <td>${formatDate(c.created_at)}</td>
      <td>
        <div class="action-btns">
          <button class="btn btn-ghost btn-sm" onclick="openEditClientModal(${c.id})" title="Edit">
            <i data-lucide="pencil"></i>
          </button>
          <button class="btn btn-danger btn-sm" onclick="deleteClient(${c.id})" title="Delete">
            <i data-lucide="trash-2"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
    lucide.createIcons();
}

function openAddClientModal() {
    showModal('Add Client', clientForm());
    document.getElementById('clientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.createClient(getClientFormData());
            closeModal();
            showToast('Client added!', 'success');
            loadClients();
        } catch (err) { showToast(err.message, 'error'); }
    });
}

async function openEditClientModal(id) {
    const client = clientsData.find(c => c.id === id);
    if (!client) return;
    showModal('Edit Client', clientForm(client));
    document.getElementById('clientForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            await api.updateClient(id, getClientFormData());
            closeModal();
            showToast('Client updated!', 'success');
            loadClients();
        } catch (err) { showToast(err.message, 'error'); }
    });
}

async function deleteClient(id) {
    if (!confirm('Delete this client?')) return;
    try {
        await api.deleteClient(id);
        showToast('Client deleted', 'success');
        loadClients();
    } catch (err) { showToast(err.message, 'error'); }
}

function clientForm(c = {}) {
    return `
    <form id="clientForm">
      <div class="form-row">
        <div class="form-group">
          <label>Name *</label>
          <input name="name" value="${escAttr(c.name || '')}" placeholder="Jane Smith" required />
        </div>
        <div class="form-group">
          <label>Company</label>
          <input name="company" value="${escAttr(c.company || '')}" placeholder="Tech Corp" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Email</label>
          <input name="email" type="email" value="${escAttr(c.email || '')}" placeholder="jane@example.com" />
        </div>
        <div class="form-group">
          <label>Phone</label>
          <input name="phone" value="${escAttr(c.phone || '')}" placeholder="+91 98765 43210" />
        </div>
      </div>
      <div class="form-group">
        <label>Address</label>
        <input name="address" value="${escAttr(c.address || '')}" placeholder="123 Main St, City" />
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea name="notes" placeholder="Any notes about this client…">${escHtml(c.notes || '')}</textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">${c.id ? 'Save Changes' : 'Add Client'}</button>
      </div>
    </form>
  `;
}

function getClientFormData() {
    const f = document.getElementById('clientForm');
    return {
        name: f.name.value.trim(),
        company: f.company.value.trim() || null,
        email: f.email.value.trim() || null,
        phone: f.phone.value.trim() || null,
        address: f.address.value.trim() || null,
        notes: f.notes.value.trim(),
    };
}

// Search
document.addEventListener('DOMContentLoaded', () => {
    let debounce;
    document.getElementById('clientSearch')?.addEventListener('input', () => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
            const q = document.getElementById('clientSearch').value.trim();
            loadClients(q ? { search: q } : {});
        }, 350);
    });
});
