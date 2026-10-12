const sel = document.getElementById('borough');
const body = document.getElementById('rows');

async function load() {
  body.innerHTML = '<tr><td colspan="5" class="muted">Calculating rankings</td></tr>';
  try {
    const rows = await api('/stats/top-rated?limit=10' + (sel.value ? '&borough=' + encodeURIComponent(sel.value) : ''));
    body.innerHTML = rows.length ? rows.map((r, i) => `
      <tr><td>${i + 1}</td><td><strong>${esc(r.name)}</strong></td><td>${esc(r.cuisine)}</td><td>${esc(r.borough)}</td>
      <td><b>${r.avgScore}</b> <span class="muted">from ${r.gradeCount} inspections</span></td></tr>`).join('')
      : '<tr><td colspan="5" class="empty">No ranked restaurants here yet.</td></tr>';
  } catch (e) { body.innerHTML = `<tr><td colspan="5" class="empty">${esc(e.message)}</td></tr>`; }
}

sel.addEventListener('change', load);
fillSelect(sel, window.APP_CONFIG.BOROUGHS, 'All boroughs');
load();
