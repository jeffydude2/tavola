const groups = document.getElementById('groups');
const list = document.getElementById('list');

async function showBorough(name) {
  document.getElementById('listTitle').textContent = `Restaurants in ${name}`;
  list.innerHTML = '<p class="muted">Loading</p>';
  try { list.innerHTML = resultCards((await api('/restaurants?limit=30&borough=' + encodeURIComponent(name))).data); }
  catch (e) { list.innerHTML = `<p class="empty">${esc(e.message)}</p>`; }
}

(async () => {
  try {
    const rows = await api('/stats/boroughs');
    groups.innerHTML = rows.map((r) => `
      <button class="card group" data-b="${esc(r.borough)}"><span class="tag">${fmt(r.cuisineCount)} cuisines</span>
      <h3>${esc(r.borough)}</h3><p class="big">${fmt(r.total)}</p><p class="muted">restaurants</p></button>`).join('');
    groups.addEventListener('click', (e) => {
      const b = e.target.closest('[data-b]'); if (!b) return;
      groups.querySelectorAll('.group').forEach((g) => g.classList.toggle('active', g === b));
      showBorough(b.dataset.b);
    });
    if (rows[0]) groups.firstElementChild.click();
  } catch (e) { groups.innerHTML = `<p class="empty">${esc(e.message)}</p>`; }
})();
