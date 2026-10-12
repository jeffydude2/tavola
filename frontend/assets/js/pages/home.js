(async () => {
  try {
    const [o, b] = await Promise.all([api('/overview'), api('/stats/boroughs')]);
    document.getElementById('m-total').textContent = fmt(o.total);
    document.getElementById('m-cuisines').textContent = fmt(o.cuisines);
    document.getElementById('m-boroughs').textContent = fmt(o.boroughs);
    const max = Math.max(...b.map((x) => x.total), 1);
    document.getElementById('bars').innerHTML = b.map((x) => `
      <div class="bar-row"><span>${esc(x.borough)}</span><div class="track"><div style="width:${(x.total / max) * 100}%"></div></div><b>${fmt(x.total)}</b></div>`).join('');
  } catch (e) {
    document.getElementById('bars').innerHTML = `<p class="empty">${esc(e.message)}</p>`;
  }
})();
