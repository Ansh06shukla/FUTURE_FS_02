/* ── App Router & Utilities ────────────────────────────────── */

// ── State ─────────────────────────────────────────────────────
let currentView = 'dashboard';

// ── View Routing ──────────────────────────────────────────────
const viewConfig = {
    dashboard: { title: 'Dashboard', label: null, load: loadDashboard },
    leads: { title: 'Leads', label: 'Add Lead', load: () => loadLeads() },
    clients: { title: 'Clients', label: 'Add Client', load: () => loadClients() },
    activities: { title: 'Activities', label: 'Log Activity', load: loadActivities },
};

function showView(view) {
    if (!viewConfig[view]) return;
    currentView = view;
    const cfg = viewConfig[view];

    // Update nav active state
    document.querySelectorAll('.nav-item').forEach(el => {
        el.classList.toggle('active', el.dataset.view === view);
    });

    // Show/hide view sections
    document.querySelectorAll('.view').forEach(el => {
        el.classList.toggle('hidden', el.id !== `view-${view}`);
    });

    // Update topbar
    document.getElementById('topbarTitle').textContent = cfg.title;
    const addBtn = document.getElementById('addBtn');
    const addBtnLabel = document.getElementById('addBtnLabel');
    if (cfg.label) {
        addBtn.style.display = '';
        addBtnLabel.textContent = cfg.label;
    } else {
        addBtn.style.display = 'none';
    }

    // Load data
    cfg.load();
}

// ── Add Button ────────────────────────────────────────────────
document.getElementById('addBtn').addEventListener('click', () => {
    if (currentView === 'leads') openAddLeadModal();
    if (currentView === 'clients') openAddClientModal();
    if (currentView === 'activities') openAddActivityModal();
});

// ── Nav Links ─────────────────────────────────────────────────
document.querySelectorAll('.nav-item').forEach(el => {
    el.addEventListener('click', (e) => {
        e.preventDefault();
        showView(el.dataset.view);
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            document.getElementById('sidebar').classList.remove('mobile-open');
        }
    });
});

// ── Sidebar Toggle ─────────────────────────────────────────────
document.getElementById('sidebarToggle')?.addEventListener('click', () => {
    const sidebar = document.getElementById('sidebar');
    const main = document.getElementById('main');
    sidebar.classList.toggle('collapsed');
    main.classList.toggle('expanded');
});

document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('sidebar').classList.toggle('mobile-open');
});

// ── Modal Helpers ─────────────────────────────────────────────
function showModal(title, bodyHtml) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalBody').innerHTML = bodyHtml;
    document.getElementById('modalOverlay').classList.remove('hidden');
    lucide.createIcons();
}

function closeModal() {
    document.getElementById('modalOverlay').classList.add('hidden');
    document.getElementById('modalBody').innerHTML = '';
}

document.getElementById('modalClose').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
});

// ── Toast ─────────────────────────────────────────────────────
let toastTimer;
function showToast(msg, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.add('hidden'), 3000);
}

// ── Utility Functions ─────────────────────────────────────────
function escHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function escAttr(str) {
    return escHtml(str).replace(/'/g, '&#39;');
}

function formatDate(str) {
    if (!str) return '–';
    try {
        return new Date(str).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch {
        return str;
    }
}

// ── Bootstrap ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    showView('dashboard');
});
