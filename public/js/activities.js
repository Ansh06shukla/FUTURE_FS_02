/* ── Activities Module ─────────────────────────────────────── */
let activitiesData = [];
let leadsForActivity = [];
let clientsForActivity = [];

async function loadActivities() {
    try {
        const list = document.getElementById('activitiesList');
        list.innerHTML = '<li class="empty-state">Loading…</li>';
        activitiesData = await api.getActivities();
        renderActivitiesList(activitiesData);
    } catch (err) {
        showToast(err.message, 'error');
    }
}

function renderActivitiesList(activities) {
    const list = document.getElementById('activitiesList');
    if (!activities.length) {
        list.innerHTML = '<li class="empty-state">No activities yet. Log your first one!</li>';
        return;
    }
    list.innerHTML = activities.map(a => `
    <li>
      <div class="activity-dot" style="background:${activityColor(a.type)}"></div>
      <div class="activity-content">
        <div class="activity-meta">
          <span class="badge badge-${a.type.toLowerCase()}">${a.type}</span>
          ${a.lead_name ? `<span class="activity-link">Lead: ${escHtml(a.lead_name)}</span>` : ''}
          ${a.client_name ? `<span class="activity-link">Client: ${escHtml(a.client_name)}</span>` : ''}
          <span class="activity-date">${formatDate(a.date)}</span>
        </div>
        <div class="activity-desc">${escHtml(a.description)}</div>
      </div>
      <button class="activity-del-btn" onclick="deleteActivity(${a.id})" title="Delete">
        <i data-lucide="trash-2"></i>
      </button>
    </li>
  `).join('');
    lucide.createIcons();
}

async function openAddActivityModal() {
    // Fetch leads & clients for linking
    try {
        [leadsForActivity, clientsForActivity] = await Promise.all([
            api.getLeads(), api.getClients()
        ]);
    } catch (_) {
        leadsForActivity = []; clientsForActivity = [];
    }

    showModal('Log Activity', activityForm());
    document.getElementById('activityForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const data = getActivityFormData();
        try {
            await api.createActivity(data);
            closeModal();
            showToast('Activity logged!', 'success');
            loadActivities();
        } catch (err) { showToast(err.message, 'error'); }
    });
}

async function deleteActivity(id) {
    if (!confirm('Delete this activity?')) return;
    try {
        await api.deleteActivity(id);
        showToast('Activity deleted', 'success');
        loadActivities();
    } catch (err) { showToast(err.message, 'error'); }
}

function activityForm() {
    const leadOptions = leadsForActivity.map(l =>
        `<option value="${l.id}">${escHtml(l.name)} ${l.company ? '(' + escHtml(l.company) + ')' : ''}</option>`
    ).join('');
    const clientOptions = clientsForActivity.map(c =>
        `<option value="${c.id}">${escHtml(c.name)} ${c.company ? '(' + escHtml(c.company) + ')' : ''}</option>`
    ).join('');

    return `
    <form id="activityForm">
      <div class="form-row">
        <div class="form-group">
          <label>Type</label>
          <select name="type">
            <option>Note</option>
            <option>Call</option>
            <option>Email</option>
            <option>Meeting</option>
          </select>
        </div>
        <div class="form-group">
          <label>Date</label>
          <input name="date" type="date" value="${new Date().toISOString().split('T')[0]}" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Link to Lead</label>
          <select name="lead_id">
            <option value="">– None –</option>
            ${leadOptions}
          </select>
        </div>
        <div class="form-group">
          <label>Link to Client</label>
          <select name="client_id">
            <option value="">– None –</option>
            ${clientOptions}
          </select>
        </div>
      </div>
      <div class="form-group">
        <label>Description *</label>
        <textarea name="description" placeholder="What happened?" required></textarea>
      </div>
      <div class="form-actions">
        <button type="button" class="btn btn-ghost" onclick="closeModal()">Cancel</button>
        <button type="submit" class="btn btn-primary">Log Activity</button>
      </div>
    </form>
  `;
}

function getActivityFormData() {
    const f = document.getElementById('activityForm');
    return {
        type: f.type.value,
        lead_id: f.lead_id.value || null,
        client_id: f.client_id.value || null,
        description: f.description.value.trim(),
        date: f.date.value,
    };
}
