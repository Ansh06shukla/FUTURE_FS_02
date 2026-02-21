/* ── Dashboard Module ─────────────────────────────────────── */
let statusChartInstance = null;

const STATUS_COLORS = {
    New: '#64748b',
    Contacted: '#3b82f6',
    Qualified: '#a855f7',
    Proposal: '#f59e0b',
    Won: '#22c55e',
    Lost: '#ef4444',
};

function formatCurrency(val) {
    if (val >= 100000) return '₹' + (val / 100000).toFixed(1) + 'L';
    if (val >= 1000) return '₹' + (val / 1000).toFixed(1) + 'K';
    return '₹' + Number(val).toLocaleString();
}

async function loadDashboard() {
    try {
        const data = await api.getDashboard();

        // Stat cards
        document.getElementById('stat-leads').textContent = data.totalLeads;
        document.getElementById('stat-clients').textContent = data.totalClients;
        document.getElementById('stat-pipeline').textContent = formatCurrency(data.pipelineValue || 0);
        document.getElementById('stat-won').textContent = formatCurrency(data.wonValue || 0);

        // Chart
        renderStatusChart(data.leadsByStatus || []);

        // Recent activities
        renderRecentActivities(data.recentActivities || []);
    } catch (err) {
        console.error('Dashboard load error:', err);
    }
}

function renderStatusChart(leadsByStatus) {
    const canvas = document.getElementById('statusChart');
    const statuses = Object.keys(STATUS_COLORS);
    const counts = statuses.map(s => {
        const found = leadsByStatus.find(r => r.status === s);
        return found ? found.count : 0;
    });

    if (statusChartInstance) statusChartInstance.destroy();

    if (counts.every(c => c === 0)) {
        canvas.parentElement.innerHTML =
            '<p style="color:var(--text-muted);text-align:center;padding:40px">No leads yet</p>';
        return;
    }

    statusChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: statuses,
            datasets: [{
                data: counts,
                backgroundColor: statuses.map(s => STATUS_COLORS[s] + '99'),
                borderColor: statuses.map(s => STATUS_COLORS[s]),
                borderWidth: 2,
                hoverOffset: 8,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'right',
                    labels: { color: '#e2e8f0', font: { family: 'Inter', size: 12 }, padding: 14 }
                },
                tooltip: {
                    callbacks: {
                        label: ctx => ` ${ctx.label}: ${ctx.parsed}`
                    }
                }
            }
        }
    });
}

function renderRecentActivities(activities) {
    const list = document.getElementById('recentActivities');
    if (!activities.length) {
        list.innerHTML = '<li class="empty-state">No activities yet</li>';
        return;
    }
    list.innerHTML = activities.map(a => `
    <li>
      <div class="activity-dot" style="background:${activityColor(a.type)}"></div>
      <div class="activity-content">
        <div class="activity-meta">
          <span class="badge badge-${a.type.toLowerCase()}">${a.type}</span>
          <span class="activity-link">${a.lead_name || a.client_name || '–'}</span>
          <span class="activity-date">${formatDate(a.date)}</span>
        </div>
        <div class="activity-desc">${escHtml(a.description)}</div>
      </div>
    </li>
  `).join('');
}

function activityColor(type) {
    return { Call: '#3b82f6', Email: '#a855f7', Meeting: '#22c55e', Note: '#f59e0b' }[type] || '#3b82f6';
}
