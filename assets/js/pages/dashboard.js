/* Dashboard page — receipts / invoices / GST with year, month & custom-range filters */
(function () {
  const { ui, store } = CM;
  ui.nav('dashboard.html');
  const $ = id => document.getElementById(id);
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  /* ---- populate filter controls ---- */
  function ensureYear(y) {
    if (![...$('fYear').options].some(o => o.value === String(y)))
      $('fYear').insertAdjacentHTML('beforeend', `<option value="${y}">${y}</option>`);
  }
  (function initFilters() {
    const years = [...new Set(store.list('documents').map(d => new Date(d.dateISO).getFullYear()))]
      .filter(Boolean).sort((a, b) => b - a);
    const cy = new Date().getFullYear();
    if (!years.includes(cy)) years.unshift(cy);
    $('fYear').innerHTML = `<option value="">All years</option>` + years.map(y => `<option value="${y}">${y}</option>`).join('');
    $('fMonth').innerHTML = `<option value="">All months</option>` + MONTHS.map((m, i) => `<option value="${i}">${m}</option>`).join('');
    $('fCentre').innerHTML = `<option value="">All centres</option>` + store.centres().map(c => `<option value="${c.code}">${c.name}</option>`).join('');
  })();

  /* ---- filtering ---- */
  function effective() {
    const centre = $('fCentre').value;
    let docs = store.list('documents');
    if (centre) docs = docs.filter(d => d.centreCode === centre);
    const from = $('fFrom').value, to = $('fTo').value;
    if (from || to) {
      const f = from ? new Date(from + 'T00:00:00') : null;
      const t = to ? new Date(to + 'T23:59:59') : null;
      return docs.filter(d => { const dt = new Date(d.dateISO); if (f && dt < f) return false; if (t && dt > t) return false; return true; });
    }
    const y = $('fYear').value, m = $('fMonth').value;
    return docs.filter(d => {
      const dt = new Date(d.dateISO);
      if (y && String(dt.getFullYear()) !== y) return false;
      if (m !== '' && String(dt.getMonth()) !== m) return false;
      return true;
    });
  }

  /* ---- aggregation ---- */
  function agg(docs) {
    const r = { count: docs.length, rvCount: 0, invCount: 0, received: 0, invoiced: 0, net: 0, taxable: 0, gst: 0 };
    docs.forEach(d => {
      r.taxable += d.taxable || 0; r.gst += ui.taxOf(d);
      if (d.type === 'RV') { r.rvCount++; r.received += d.total || 0; }
      else { r.invCount++; r.invoiced += d.total || 0; r.net += d.net || 0; }
    });
    return r;
  }
  const emptyRow = cols => `<tr><td colspan="${cols}" class="empty">No documents in this period.</td></tr>`;

  /* ---- renderers ---- */
  function renderStats(a) {
    $('stats').innerHTML = `
      <div class="stat"><div class="k"><i class="fa-solid fa-file-lines"></i> Documents</div><div class="v">${a.count}</div><div class="x">${a.rvCount} receipts · ${a.invCount} invoices</div></div>
      <div class="stat is-green"><div class="k"><i class="fa-solid fa-arrow-down-long"></i> Received (advances)</div><div class="v">₹${ui.money(a.received)}</div><div class="x">across receipt vouchers</div></div>
      <div class="stat"><div class="k"><i class="fa-solid fa-file-invoice-dollar"></i> Invoiced value</div><div class="v">₹${ui.money(a.invoiced)}</div><div class="x">tax invoices issued</div></div>
      <div class="stat is-navy"><div class="k"><i class="fa-solid fa-scale-balanced"></i> Net receivable</div><div class="v">₹${ui.money(a.net)}</div><div class="x">net payable on invoices</div></div>
      <div class="stat"><div class="k"><i class="fa-solid fa-coins"></i> Taxable value</div><div class="v">₹${ui.money(a.taxable)}</div><div class="x">across selected documents</div></div>
      <div class="stat"><div class="k"><i class="fa-solid fa-percent"></i> GST in documents</div><div class="v">₹${ui.money(a.gst)}</div><div class="x">CGST + SGST + IGST</div></div>`;
  }

  function renderMonth(docs) {
    const map = {};
    docs.forEach(d => { const dt = new Date(d.dateISO); const k = dt.getFullYear() + '-' + String(dt.getMonth()).padStart(2, '0'); (map[k] = map[k] || []).push(d); });
    const data = Object.keys(map).sort().map(k => { const [y, mi] = k.split('-'); const a = agg(map[k]); return { label: `${MONTHS[+mi]} ${y}`, a, vol: a.received + a.invoiced }; });
    const max = Math.max(1, ...data.map(r => r.vol));
    const head = `<thead><tr><th>Month</th><th class="r">Docs</th><th class="r">Received</th><th class="r">Invoiced</th><th style="width:84px"></th></tr></thead>`;
    const body = data.length ? data.map(r => `
      <tr>
        <td class="cell-main">${r.label}</td>
        <td class="r mono">${r.a.count}</td>
        <td class="r mono">${ui.money(r.a.received)}</td>
        <td class="r mono">${ui.money(r.a.invoiced)}</td>
        <td><div class="bar-wrap"><div class="bar" style="width:${Math.round(r.vol / max * 100)}%"></div></div></td>
      </tr>`).join('') : emptyRow(5);
    $('byMonth').innerHTML = head + `<tbody>${body}</tbody>`;
  }

  function renderCustomer(docs) {
    const map = {};
    docs.forEach(d => { const n = (d.customer && d.customer.name) || '—'; (map[n] = map[n] || []).push(d); });
    const data = Object.keys(map).map(n => { const a = agg(map[n]); return { name: n, a, vol: a.received + a.invoiced }; })
      .sort((x, y) => y.vol - x.vol).slice(0, 10);
    const head = `<thead><tr><th>Customer</th><th class="r">Docs</th><th class="r">Received</th><th class="r">Invoiced</th><th class="r">Net due</th></tr></thead>`;
    const body = data.length ? data.map(r => `
      <tr>
        <td class="cell-main">${r.name}</td>
        <td class="r mono">${r.a.count}</td>
        <td class="r mono">${ui.money(r.a.received)}</td>
        <td class="r mono">${ui.money(r.a.invoiced)}</td>
        <td class="r mono">${ui.money(r.a.net)}</td>
      </tr>`).join('') : emptyRow(5);
    $('byCustomer').innerHTML = head + `<tbody>${body}</tbody>`;
  }

  function renderCentre(docs) {
    const map = {};
    docs.forEach(d => { (map[d.centreCode] = map[d.centreCode] || []).push(d); });
    const head = `<thead><tr><th>Centre</th><th class="r">Docs</th><th class="r">Received</th><th class="r">Invoiced</th><th class="r">GST</th></tr></thead>`;
    const keys = Object.keys(map);
    const body = keys.length ? keys.map(code => {
      const a = agg(map[code]); const c = store.centre(code);
      return `<tr>
        <td class="cell-main">${c ? c.name : code} <span class="cell-sub mono">${code || '—'}</span></td>
        <td class="r mono">${a.count}</td>
        <td class="r mono">${ui.money(a.received)}</td>
        <td class="r mono">${ui.money(a.invoiced)}</td>
        <td class="r mono">${ui.money(a.gst)}</td>
      </tr>`;
    }).join('') : emptyRow(5);
    $('byCentre').innerHTML = head + `<tbody>${body}</tbody>`;
  }

  function renderNote() {
    const centre = $('fCentre').value;
    const centreLabel = centre ? ((store.centre(centre) || {}).name || centre) : 'all centres';
    const from = $('fFrom').value, to = $('fTo').value;
    let when;
    if (from || to) {
      when = `custom range ${from ? ui.fmtDate(from) : 'beginning'} → ${to ? ui.fmtDate(to) : 'today'} (year / month ignored)`;
    } else {
      const y = $('fYear').value, m = $('fMonth').value;
      when = `${m !== '' ? MONTHS[+m] : 'all months'}, ${y || 'all years'}`;
    }
    $('rangeNote').textContent = `Showing ${centreLabel} · ${when}.`;
  }

  function refresh() {
    const docs = effective();
    renderStats(agg(docs));
    renderMonth(docs); renderCustomer(docs); renderCentre(docs);
    renderNote();
  }

  /* ---- wiring ---- */
  const clearRange = () => { $('fFrom').value = ''; $('fTo').value = ''; };
  const clearYM = () => { $('fYear').value = ''; $('fMonth').value = ''; };

  $('fCentre').onchange = () => { refresh(); };
  $('fYear').onchange = () => { clearRange(); refresh(); };
  $('fMonth').onchange = () => { clearRange(); refresh(); };
  $('fFrom').onchange = () => { clearYM(); refresh(); };
  $('fTo').onchange = () => { clearYM(); refresh(); };

  document.querySelectorAll('[data-range]').forEach(b => b.onclick = () => {
    const kind = b.dataset.range;
    const now = new Date(), cy = now.getFullYear(), cm = now.getMonth();
    clearRange();
    if (kind === 'all') { $('fYear').value = ''; $('fMonth').value = ''; }
    else if (kind === 'year') { ensureYear(cy); $('fYear').value = String(cy); $('fMonth').value = ''; }
    else if (kind === 'month') { ensureYear(cy); $('fYear').value = String(cy); $('fMonth').value = String(cm); }
    else if (kind === 'fy') {
      clearYM();
      const start = cm >= 3 ? cy : cy - 1;
      $('fFrom').value = `${start}-04-01`;
      $('fTo').value = `${start + 1}-03-31`;
    }
    refresh();
  });

  $('btnReset').onclick = () => { $('fCentre').value = ''; clearRange(); clearYM(); refresh(); };

  refresh();
})();
