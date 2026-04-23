// ── Service Worker ──────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('SW registrado:', reg.scope))
      .catch(err => console.error('SW falhou:', err));
  });
}

// ── Install prompt ───────────────────────────────────────────────
let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log('Install outcome:', outcome);
  deferredPrompt = null;
  installBtn.style.display = 'none';
});

window.addEventListener('appinstalled', () => {
  installBtn.style.display = 'none';
  deferredPrompt = null;
});

// ── Storage helpers ──────────────────────────────────────────────
const STORAGE_KEY = 'diario_entradas';

function loadEntries() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveEntries(entries) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

// ── Render ───────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: '2-digit', month: 'long', year: 'numeric'
  });
}

function render() {
  const entries = loadEntries();
  const list = document.getElementById('entriesList');
  const count = document.getElementById('entryCount');

  count.textContent = entries.length;

  if (entries.length === 0) {
    list.innerHTML = `
      <div class="empty-state">
        <span class="empty-icon">🌊</span>
        <p>Nenhuma entrada ainda.<br/>Comece registrando seu dia.</p>
      </div>`;
    return;
  }

  list.innerHTML = entries
    .slice()
    .reverse()
    .map(entry => `
      <div class="entry-card">
        <div class="entry-header">
          <span class="entry-title">${escapeHtml(entry.title)}</span>
          <button class="delete-btn" title="Remover" data-id="${entry.id}">✕</button>
        </div>
        ${entry.date ? `<div class="entry-date">${formatDate(entry.date)}</div>` : ''}
        <div class="entry-desc">${escapeHtml(entry.desc)}</div>
      </div>
    `).join('');

  list.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteEntry(btn.dataset.id));
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ── Add / Delete ─────────────────────────────────────────────────
document.getElementById('addBtn').addEventListener('click', () => {
  const title = document.getElementById('entryTitle').value.trim();
  const date  = document.getElementById('entryDate').value;
  const desc  = document.getElementById('entryDesc').value.trim();

  if (!title && !desc) {
    alert('Preencha ao menos o título ou a descrição.');
    return;
  }

  const entries = loadEntries();
  entries.push({
    id: Date.now().toString(),
    title: title || 'Sem título',
    date,
    desc
  });
  saveEntries(entries);

  document.getElementById('entryTitle').value = '';
  document.getElementById('entryDate').value  = '';
  document.getElementById('entryDesc').value  = '';

  render();
});

function deleteEntry(id) {
  if (!confirm('Remover esta entrada?')) return;
  const entries = loadEntries().filter(e => e.id !== id);
  saveEntries(entries);
  render();
}

// ── Init ─────────────────────────────────────────────────────────
document.getElementById('entryDate').valueAsDate = new Date();
render();