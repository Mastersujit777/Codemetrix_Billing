/* Register page — lists GST bills (RV / INV) and project documents
   (quotation / proposal / scope of work / agreement) together. */
(function () {
  const { ui, store, doc, projectDoc } = CM;
  ui.nav('documents.html');
  const $ = id => document.getElementById(id);

  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const TYPE_META = {
    RV:   { label: 'Receipt',       pill: 'g' },
    INV:  { label: 'Invoice',       pill: 'n' },
    QUO:  { label: 'Quotation',     pill: '' },
    PROP: { label: 'Proposal',      pill: '' },
    SOW:  { label: 'Scope of Work', pill: '' },
    AGR:  { label: 'Agreement',     pill: '' }
  };
  const isBill = d => d.type === 'RV' || d.type === 'INV';

  /* every saved document, tagged with the collection it came from */
  function allDocs() {
    return store.list('documents').map(d => Object.assign({ _src: 'documents' }, d))
      .concat(store.list('projectDocs').map(d => Object.assign({ _src: 'projectDocs' }, d)));
  }
  function findAny(id) {
    const b = store.find('documents', id);
    if (b) return Object.assign({ _src: 'documents' }, b);
    const p = store.find('projectDocs', id);
    if (p) return Object.assign({ _src: 'projectDocs' }, p);
    return null;
  }
  const renderOf = d => d._src === 'projectDocs' ? projectDoc.render(d) : doc.renderDoc(d);

  /* unified field access across the two document shapes */
  const partyName = d => d.customer?.name || d.client?.name || d.clientName || '';
  const svcCol = d => d.service?.name || d.projectTitle || '—';
  function amounts(d) {
    if (isBill(d)) return { taxable: d.taxable || 0, tax: tax(d), total: d.total || 0, net: d.type === 'INV' ? (d.net || 0) : null };
    if (d.type === 'QUO') return { taxable: d.base || 0, tax: d.tax || 0, total: d.grand || 0, net: null };
    const inv = +d.investment || 0;                       // proposal / scope: optional figure
    return { taxable: null, tax: null, total: inv || null, net: null };
  }

  /* populate filter dropdowns */
  store.centres().forEach(c => $('fCentre').insertAdjacentHTML('beforeend', `<option value="${c.code}">${c.name}</option>`));
  store.list('services').forEach(s => $('fService').insertAdjacentHTML('beforeend', `<option value="${s.name}">${s.name}</option>`));
  (function initDates() {
    const years = [...new Set(allDocs().map(d => new Date(d.dateISO).getFullYear()))].filter(Boolean).sort((a, b) => b - a);
    $('fYear').innerHTML = `<option value="">All years</option>` + years.map(y => `<option value="${y}">${y}</option>`).join('');
    $('fMonth').innerHTML = `<option value="">All months</option>` + MONTHS.map((m, i) => `<option value="${i}">${m}</option>`).join('');
  })();

  function filtered() {
    const fc = $('fCentre').value, fs = $('fService').value, ft = $('fType').value;
    const fy = $('fYear').value, fm = $('fMonth').value, from = $('fFrom').value, to = $('fTo').value;
    const q = $('fSearch').value.trim().toLowerCase();
    const f = from ? new Date(from + 'T00:00:00') : null, t = to ? new Date(to + 'T23:59:59') : null;
    return allDocs().filter(d => {
      if (fc && d.centreCode !== fc) return false;        // project docs have no centre
      if (fs && (d.service?.name || '') !== fs) return false; // and no service
      if (ft && d.type !== ft) return false;
      const dt = new Date(d.dateISO);
      if (f || t) {                       // custom range overrides year/month
        if (f && dt < f) return false;
        if (t && dt > t) return false;
      } else {
        if (fy && String(dt.getFullYear()) !== fy) return false;
        if (fm !== '' && String(dt.getMonth()) !== fm) return false;
      }
      if (q) {
        const hay = `${d.no} ${partyName(d)} ${d.customer?.username || ''} ${d.projectTitle || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    }).sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
  }

  function tax(d) { return ui.round2((d.cgst || 0) + (d.sgst || 0) + (d.igst || 0)); }

  function rows() {
    const ds = filtered();
    const cell = v => v == null ? '—' : ui.money(v);
    $('rows').innerHTML = ds.length ? ds.map(d => {
      const a = amounts(d), tm = TYPE_META[d.type] || { label: d.type, pill: '' };
      const sub = d.customer?.username ? `<div class="cell-sub mono">${d.customer.username}</div>` : '';
      const sac = d.service?.sac ? `<div class="cell-sub mono">SAC ${d.service.sac}</div>` : '';
      return `<tr>
        <td class="mono cell-main" style="font-size:12px">${d.no}</td>
        <td>${ui.fmtDate(d.dateISO)}</td>
        <td><span class="tag-pill ${tm.pill}">${tm.label}</span></td>
        <td>${partyName(d) || '—'}${sub}</td>
        <td>${svcCol(d)}${sac}</td>
        <td class="r mono">${cell(a.taxable)}</td>
        <td class="r mono">${cell(a.tax)}</td>
        <td class="r mono">${cell(a.total)}</td>
        <td class="r mono">${cell(a.net)}</td>
        <td class="r"><button class="btn-icon" data-view="${d.id}" title="View &amp; print"><i class="fa-solid fa-eye"></i></button><button class="btn-icon del" data-del="${d.id}" title="Delete"><i class="fa-solid fa-xmark"></i></button></td>
      </tr>`;
    }).join('')
      : `<tr><td colspan="10" class="empty">No documents yet. Generate one on the Billing or Projects page and save it.</td></tr>`;

    // money totals reflect GST bills only, so GSTR-1 reconciliation stays accurate
    const bills = ds.filter(isBill);
    const t = bills.reduce((o, d) => { o.taxable += d.taxable || 0; o.tax += tax(d); o.total += d.total || 0; return o; }, { taxable: 0, tax: 0, total: 0 });
    const nonBill = ds.length - bills.length;
    $('foot').innerHTML = ds.length ? `<tr style="font-weight:700;background:#f5f8fb">
      <td colspan="5" style="padding:12px 16px">${ds.length} document(s)${nonBill ? ` · GST totals cover ${bills.length} bill(s)` : ''}</td>
      <td class="r mono">${ui.money(t.taxable)}</td><td class="r mono">${ui.money(t.tax)}</td>
      <td class="r mono">${ui.money(t.total)}</td><td></td><td></td></tr>` : '';

    $('rows').querySelectorAll('[data-view]').forEach(b => b.onclick = () => preview(b.dataset.view));
    $('rows').querySelectorAll('[data-del]').forEach(b => b.onclick = () => del(b.dataset.del));
  }

  /* preview the document on screen before printing */
  function preview(id) {
    const d = findAny(id);
    if (!d) return;
    const m = ui.modal(d.no,
      `<div class="doc-preview">${renderOf(d)}</div>`,
      `<button class="btn btn-ghost" data-close>Close</button>
       <button class="btn btn-primary" id="m_print"><i class="fa-solid fa-print"></i> Print / PDF</button>`,
      { size: 'xl', scrollable: true });
    m.querySelector('#m_print').onclick = () => { ui.closeModal(); reprint(id); };
  }

  function reprint(id) {
    const d = findAny(id);
    if (!d) return;
    const w = window.open('', '_blank');
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${d.no}</title>
      <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
      <link rel="stylesheet" href="assets/css/main.css">
      <style>body{background:#fff;padding:18px}@media print{@page{size:A4;margin:12mm}.doc{box-shadow:none;padding:0}.doc::before{display:none}}</style>
      </head><body>${renderOf(d)}
      <script>window.onload=function(){setTimeout(function(){window.print()},400)}<\/script></body></html>`);
    w.document.close();
  }

  function del(id) {
    const d = findAny(id);
    if (!d) return;
    const seqNote = isBill(d) ? ' This breaks the gap-free sequence — only do this for a genuine error.' : '';
    const m = ui.modal('Delete document', `<p style="font-size:13px;color:var(--muted);padding:10px 0">Delete <b class="mono" style="color:var(--ink)">${d.no}</b> from the register?${seqNote}</p>`,
      `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" id="m_del"><i class="fa-solid fa-trash"></i> Delete</button>`);
    m.querySelector('#m_del').onclick = () => { store.remove(d._src, id); ui.closeModal(); ui.toast('Document removed'); rows(); };
  }

  function csv() {
    const ds = filtered();
    if (!ds.length) { ui.toast('Nothing to export', 'err'); return; }
    const head = ['Number', 'Date', 'Type', 'Centre', 'Customer / client', 'Username', 'Phone', 'GSTIN', 'State', 'Service / project', 'SAC', 'Payment mode', 'Payment ref', 'Taxable', 'CGST', 'SGST', 'IGST', 'Total', 'Net'];
    const esc = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const val = v => v == null ? '' : v;
    const lines = ds.map(d => {
      const a = amounts(d), c = d.customer || d.client || {};
      return [d.no, ui.fmtDate(d.dateISO), d.type, d.centreCode || '', partyName(d), c.username || '', c.phone || '',
        c.gstin || '', c.stateName || '', d.service?.name || d.projectTitle || '', d.service?.sac || '',
        d.payMode || '', d.payRef || '', val(a.taxable), val(d.cgst), val(d.sgst), val(d.igst), val(a.total), val(a.net)].map(esc).join(',');
    });
    const blob = new Blob([head.join(',') + '\n' + lines.join('\n')], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `codemetrix-register-${ui.fyFromDate()}.csv`; a.click();
    ui.toast('CSV exported');
  }

  const clearRange = () => { $('fFrom').value = ''; $('fTo').value = ''; };
  const clearYM = () => { $('fYear').value = ''; $('fMonth').value = ''; };
  ['fCentre', 'fService', 'fType'].forEach(id => $(id).onchange = rows);
  ['fYear', 'fMonth'].forEach(id => $(id).onchange = () => { clearRange(); rows(); });
  ['fFrom', 'fTo'].forEach(id => $(id).onchange = () => { clearYM(); rows(); });
  $('fSearch').oninput = rows;
  $('fReset').onclick = () => { $('fCentre').value = ''; $('fService').value = ''; $('fType').value = ''; clearYM(); clearRange(); $('fSearch').value = ''; rows(); };
  $('csv').onclick = csv;
  rows();
})();
