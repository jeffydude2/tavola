const state = { page: 1, borough: '', cuisine: '' };
const body = document.getElementById('rows');
const dlg = document.getElementById('formDialog');
const form = document.getElementById('restaurantForm');

async function load() {
  body.innerHTML = '<tr><td colspan="5" class="muted">Loading restaurants</td></tr>';
  try {
    const p = new URLSearchParams({ page: state.page, limit: 15 });
    if (state.borough) p.set('borough', state.borough);
    if (state.cuisine) p.set('cuisine', state.cuisine);
    const r = await api('/restaurants?' + p);
    body.innerHTML = r.data.length ? r.data.map((x) => `
      <tr><td><strong>${esc(x.name)}</strong></td><td>${esc(x.cuisine)}</td><td>${esc(x.borough)}</td><td>${esc(addr(x))}</td>
      <td class="actions"><button class="btn sm" data-edit="${x._id}">Edit</button><button class="btn sm danger" data-del="${x._id}" data-name="${esc(x.name)}">Delete</button></td></tr>`).join('')
      : '<tr><td colspan="5" class="empty">No restaurants found. Add one to get started.</td></tr>';
    document.getElementById('count').textContent = `${fmt(r.total)} restaurants`;
    document.getElementById('pageInfo').textContent = `Page ${r.page} of ${fmt(r.pages)}`;
    document.getElementById('prev').disabled = r.page <= 1;
    document.getElementById('next').disabled = r.page >= r.pages;
  } catch (e) { body.innerHTML = `<tr><td colspan="5" class="empty">${esc(e.message)}</td></tr>`; }
}

function openForm(r) {
  form.reset();
  form.elements.id.value = r?._id || '';
  document.getElementById('formError').textContent = '';
  document.getElementById('dlgTitle').textContent = r ? 'Edit restaurant' : 'Add restaurant';
  if (r) {
    form.elements.name.value = r.name; form.elements.cuisine.value = r.cuisine; form.elements.borough.value = r.borough;
    form.elements.building.value = r.address?.building || ''; form.elements.street.value = r.address?.street || ''; form.elements.zipcode.value = r.address?.zipcode || '';
  }
  dlg.showModal();
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  const id = data.id; delete data.id;
  try {
    await api(id ? `/restaurants/${id}` : '/restaurants', { method: id ? 'PUT' : 'POST', body: JSON.stringify(data) });
    dlg.close(); toast(id ? 'Restaurant updated.' : 'Restaurant added.'); load();
  } catch (err) { document.getElementById('formError').textContent = err.message; }
});

body.addEventListener('click', async (e) => {
  const edit = e.target.closest('[data-edit]'), del = e.target.closest('[data-del]');
  if (edit) { try { openForm(await api('/restaurants/' + edit.dataset.edit)); } catch (err) { toast(err.message); } }
  if (del && confirm(`Delete "${del.dataset.name}"? This cannot be undone.`)) {
    try { await api('/restaurants/' + del.dataset.del, { method: 'DELETE' }); toast('Restaurant deleted.'); load(); } catch (err) { toast(err.message); }
  }
});

document.getElementById('addBtn').addEventListener('click', () => openForm());
document.getElementById('cancel').addEventListener('click', () => dlg.close());
document.getElementById('prev').addEventListener('click', () => { state.page--; load(); });
document.getElementById('next').addEventListener('click', () => { state.page++; load(); });
document.getElementById('fBorough').addEventListener('change', (e) => { state.borough = e.target.value; state.page = 1; load(); });
document.getElementById('fCuisine').addEventListener('change', (e) => { state.cuisine = e.target.value; state.page = 1; load(); });

(async () => {
  fillSelect(form.elements.borough, window.APP_CONFIG.BOROUGHS);
  fillSelect(document.getElementById('fBorough'), window.APP_CONFIG.BOROUGHS, 'All boroughs');
  try { fillSelect(document.getElementById('fCuisine'), await api('/meta/cuisines'), 'All cuisines'); } catch (e) {}
  await load();
  if (new URLSearchParams(location.search).get('add')) openForm();
})();
