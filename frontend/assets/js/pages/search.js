const f = document.getElementById('searchForm');
const out = document.getElementById('out');

async function run() {
  const p = new URLSearchParams({ limit: 30 });
  if (f.elements.q.value.trim()) p.set('q', f.elements.q.value.trim());
  if (f.elements.cuisine.value) p.set('cuisine', f.elements.cuisine.value);
  out.innerHTML = '<p class="muted">Searching</p>';
  try {
    const r = await api('/restaurants?' + p);
    document.getElementById('summary').textContent = `${fmt(r.total)} result${r.total === 1 ? '' : 's'}${r.total > 30 ? ', showing the first 30' : ''}`;
    out.innerHTML = resultCards(r.data);
  } catch (e) { out.innerHTML = `<p class="empty">${esc(e.message)}</p>`; }
}

f.addEventListener('submit', (e) => { e.preventDefault(); run(); });
f.elements.cuisine.addEventListener('change', run);
document.getElementById('clear').addEventListener('click', () => { f.reset(); run(); });
(async () => {
  try { fillSelect(f.elements.cuisine, await api('/meta/cuisines'), 'Any cuisine'); } catch (e) {}
  run();
})();
