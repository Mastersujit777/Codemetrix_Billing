/* Shared controller for the four IT-project document generators
   (quotation / proposal / scope of work / agreement).
   Each page sets <body data-doctype="QUO|PROP|SOW|AGR"> and supplies its own
   panel markup: simple inputs carry [data-field]; repeatable lists are
   <div class="rep" data-field=".." data-cols=".." data-seed=".." data-add="..">. */
(function () {
  const { ui, store, projectDoc } = CM;
  const $ = id => document.getElementById(id);
  const panel = document.querySelector('.panel');
  if (!panel) return;                 // not a generator page

  const TYPE = document.body.dataset.doctype || 'QUO';
  ui.nav('project.html');

  /* ---- repeatable-list column specs ---- */
  const COLS = {
    text:    [{ k: 'text', ph: 'Type a point…' }],
    named:   [{ k: 'name', ph: 'Name', w: '38%' }, { k: 'desc', ph: 'Description' }],
    mile:    [{ k: 'name', ph: 'Milestone / phase' }, { k: 'when', ph: 'Timeline (e.g. Week 1–2)', w: '42%' }],
    item:    [{ k: 'desc', ph: 'Item / description' }, { k: 'qty', ph: 'Qty', type: 'number', w: '58px' }, { k: 'unit', ph: 'Unit', w: '74px' }, { k: 'rate', ph: 'Rate ₹', type: 'number', w: '92px' }],
    section: [{ k: 'heading', ph: 'Section heading' }, { k: 'body', ph: 'Write the content…', area: true }],
    clause:  [{ k: 'heading', ph: 'Clause heading' }, { k: 'body', ph: 'Clause text…', area: true }]
  };

  /* ---- default content seeds (used when a list starts empty) ---- */
  const SEEDS = {
    quoTerms: [
      { text: 'Prices are in INR and exclusive of GST unless stated otherwise.' },
      { text: 'This quotation is an estimate; a change in scope may change the cost.' },
      { text: '50% advance to commence work, balance due on delivery.' },
      { text: 'Quotation valid for 15 days from the date of issue.' }
    ],
    propTerms: [
      { text: 'Commercials are indicative and subject to a final Scope of Work.' },
      { text: 'Timelines assume timely inputs, approvals and access from the Client.' },
      { text: 'Applicable taxes (GST) will be charged additionally.' }
    ],
    clauses: [
      { heading: 'Services', body: 'The Service Provider shall provide the software development / IT services described in the attached Scope of Work and any mutually agreed change requests.' },
      { heading: 'Fees & Payment', body: 'The Client shall pay the agreed fees per the payment schedule. Invoices are payable within 7 days of receipt. Applicable GST is charged extra.' },
      { heading: 'Timeline', body: 'The Service Provider will use reasonable efforts to meet the agreed milestones. Timelines may shift on account of delays in Client inputs, approvals or third-party dependencies.' },
      { heading: 'Intellectual Property', body: 'Upon full and final payment, the deliverables created specifically for the Client, and their intellectual property rights, transfer to the Client. Pre-existing tools, libraries and frameworks remain the property of the Service Provider.' },
      { heading: 'Confidentiality', body: 'Each party shall keep confidential all non-public information disclosed by the other and use it solely to perform this Agreement.' },
      { heading: 'Warranties & Support', body: 'The Service Provider warrants the deliverables will materially conform to the agreed specification for 30 days after delivery and will remedy reported defects at no charge within this period.' },
      { heading: 'Termination', body: 'Either party may terminate this Agreement on 15 days written notice. The Client shall pay for all work satisfactorily completed up to the date of termination.' },
      { heading: 'Limitation of Liability', body: 'The Service Provider’s total liability under this Agreement shall not exceed the fees paid by the Client for the affected deliverable.' },
      { heading: 'Governing Law', body: 'This Agreement is governed by the laws of India and is subject to the jurisdiction of the courts at Bhubaneswar, Odisha.' }
    ]
  };

  /* ---- repeatable lists ---- */
  const repState = {};                                  // field -> [row,...]
  const reps = [...panel.querySelectorAll('.rep')];

  function blank(spec) { const o = {}; spec.forEach(c => o[c.k] = ''); return o; }

  function repRows(container) {
    const field = container.dataset.field;
    const spec = COLS[container.dataset.cols] || COLS.text;
    const rows = repState[field];
    const stacked = spec.some(c => c.area);
    let host = container.querySelector('.rep-rows');
    if (!host) {
      container.innerHTML = `<div class="rep-rows"></div>
        <button type="button" class="add-link" data-add><i class="fa-solid fa-plus"></i> ${container.dataset.add || 'Add row'}</button>`;
      host = container.querySelector('.rep-rows');
      container.querySelector('[data-add]').onclick = () => { rows.push(blank(spec)); repRows(container); render(); };
    }
    host.innerHTML = rows.map((row, i) => {
      const del = `<button type="button" class="btn-icon del" data-del="${i}" title="Remove"><i class="fa-solid fa-xmark"></i></button>`;
      if (stacked) {
        return `<div class="rep-row stack">
          <div class="rep-top">
            <input class="rep-in" data-i="${i}" data-k="heading" placeholder="${spec[0].ph}" value="${esc(row.heading)}">${del}
          </div>
          <textarea class="rep-in" data-i="${i}" data-k="body" placeholder="${spec[1].ph}" rows="2">${row.body || ''}</textarea>
        </div>`;
      }
      const cells = spec.map(c => {
        const style = c.w ? ` style="flex:0 0 ${c.w}"` : '';
        const mono = (c.type === 'number') ? ' mono' : '';
        return `<input class="rep-in${mono}"${style} type="${c.type || 'text'}" data-i="${i}" data-k="${c.k}" placeholder="${c.ph}" value="${esc(row[c.k])}">`;
      }).join('');
      return `<div class="rep-row">${cells}${del}</div>`;
    }).join('');

    host.querySelectorAll('.rep-in').forEach(inp => inp.oninput = e => {
      rows[+e.target.dataset.i][e.target.dataset.k] = e.target.value; render();
    });
    host.querySelectorAll('[data-del]').forEach(b => b.onclick = e => {
      rows.splice(+e.currentTarget.dataset.del, 1);
      if (!rows.length) rows.push(blank(spec));
      repRows(container); render();
    });
  }

  function initReps() {
    reps.forEach(c => {
      const field = c.dataset.field, spec = COLS[c.dataset.cols] || COLS.text;
      const seed = c.dataset.seed && SEEDS[c.dataset.seed];
      repState[field] = seed ? JSON.parse(JSON.stringify(seed)) : [blank(spec)];
      repRows(c);
    });
  }

  function esc(s) { return (s == null ? '' : String(s)).replace(/"/g, '&quot;'); }

  /* ---- simple fields (everything with [data-field] not inside a .rep) ---- */
  function simpleFields() {
    return [...panel.querySelectorAll('[data-field]')].filter(el => !el.closest('.rep'));
  }

  /* ---- client picker (reuses the Customers store, like Billing) ---- */
  function fillClients() {
    const cs = store.list('customers');
    $('client').innerHTML = `<option value="">— search or select a client —</option>`
      + cs.map(c => `<option value="${c.id}">${c.name}${c.username ? ' · ' + c.username : ''}</option>`).join('');
    $('clientList').innerHTML = cs.map(c =>
      `<option value="${[c.name, c.username, c.phone || c.contact, c.email].filter(Boolean).join(' · ').replace(/"/g, '&quot;')}"></option>`).join('');
  }
  function currentClient() { return store.find('customers', $('client').value) || {}; }
  function lookupClient(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return null;
    const cs = store.list('customers');
    const composite = c => [c.name, c.username, c.phone || c.contact, c.email].filter(Boolean).join(' · ').toLowerCase();
    return cs.find(c => composite(c) === q)
      || cs.find(c => (c.username || '').toLowerCase() === q)
      || cs.find(c => (c.phone || '').toLowerCase() === q)
      || cs.find(c => (c.name || '').toLowerCase() === q)
      || cs.find(c => `${c.name || ''} ${c.username || ''} ${c.phone || ''} ${c.email || ''} ${c.contact || ''}`.toLowerCase().includes(q));
  }
  function renderClientInfo() {
    const c = currentClient(), el = $('clientInfo');
    if (!el) return;
    if (!c.id) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <div class="ci-row"><i class="fa-solid fa-user"></i><span>${c.name}${c.kind ? ` <span class="muted">(${c.kind})</span>` : ''}</span></div>
      <div class="ci-row"><i class="fa-solid fa-phone"></i><span class="mono">${c.phone || c.contact || '—'}</span></div>
      ${c.email ? `<div class="ci-row"><i class="fa-solid fa-envelope"></i><span>${c.email}</span></div>` : ''}
      ${(c.contactPersonName || c.contactPersonPhone) ? `<div class="ci-row"><i class="fa-solid fa-user-tie"></i><span>${[c.contactPersonName, c.contactPersonPhone].filter(Boolean).join(' · ')}</span></div>` : ''}
      <div class="ci-row"><i class="fa-solid fa-location-dot"></i><span>${c.stateName || '—'}${c.gstin ? ` · GSTIN <span class="mono">${c.gstin}</span>` : ''}</span></div>
      ${c.address ? `<div class="ci-row"><i class="fa-solid fa-house"></i><span>${c.address.replace(/\n/g, ', ')}</span></div>` : ''}`;
  }

  /* ---- numbering: CM/<TYPE>/<FY>/<seq>, serial per type + financial year ---- */
  function refreshSeq() {
    if (!$('fy')) return;
    $('fy').value = $('fy').value || ui.fyFromDate($('docDate').value);
    $('seq').value = store.peekSeq('PRJ', TYPE, $('fy').value);
    if ($('docNoShort')) $('docNoShort').value = `${TYPE}/${$('fy').value}/${$('seq').value}`;
  }
  function docNo() { return `CM/${TYPE}/${$('fy').value}/${$('seq').value}`; }

  /* ---- assemble the input record from the whole panel ---- */
  function buildInput() {
    const c = currentClient();
    const input = {
      type: TYPE,
      no: docNo(),
      dateISO: ($('docDate') && $('docDate').value) || new Date().toISOString(),
      validUntil: ($('validUntil') && $('validUntil').value) || '',
      client: {
        name: c.name || '', username: c.username || '', phone: c.phone || c.contact || '',
        email: c.email || '', address: c.address || '', gstin: c.gstin || '',
        contactPersonName: c.contactPersonName || '', contactPersonPhone: c.contactPersonPhone || '',
        stateName: c.stateName || 'Odisha', stateCode: c.stateCode || '21'
      }
    };
    simpleFields().forEach(el => { input[el.dataset.field] = el.value; });
    reps.forEach(c2 => { input[c2.dataset.field] = (repState[c2.dataset.field] || []).map(r => Object.assign({}, r)); });
    return input;
  }

  let savedLocked = false;

  function render() {
    if (savedLocked) { savedLocked = false; refreshSeq(); }
    if ($('btnPrint')) $('btnPrint').style.display = 'none';
    const rec = projectDoc.compute(buildInput());
    $('preview').innerHTML = projectDoc.render(rec);
    return rec;
  }

  /* ---- save / recent ---- */
  function save() {
    if (savedLocked) { ui.toast('Already saved — change something to start a new document'); return; }
    if (!currentClient().id) { ui.toast('Search & select a client first', 'err'); return; }
    const rec = projectDoc.compute(buildInput());
    store.consumeSeq('PRJ', TYPE, $('fy').value, parseInt($('seq').value, 10));
    rec.id = store.id('prj');
    rec.savedISO = new Date().toISOString();
    rec.clientName = currentClient().name;
    store.upsert('projectDocs', rec);
    ui.toast(`Saved ${rec.no}`);
    $('preview').innerHTML = projectDoc.render(rec);
    if ($('btnPrint')) $('btnPrint').style.display = '';
    savedLocked = true;
    // auto-advance the sequence so the next document of this kind is already numbered
    refreshSeq();
    renderRecent();
  }

  function renderRecent() {
    const host = $('recent');
    if (!host) return;
    const docs = store.list('projectDocs')
      .filter(d => d.type === TYPE)
      .sort((a, b) => new Date(b.savedISO || b.dateISO) - new Date(a.savedISO || a.dateISO));
    if (!docs.length) { host.innerHTML = `<p class="hint">No saved documents yet.</p>`; return; }
    host.innerHTML = docs.map(d => `
      <div class="rec-row" data-id="${d.id}">
        <button class="rec-open" data-open="${d.id}" title="Reprint">
          <span class="rec-no mono">${d.no.split('/').slice(-2).join('/')}</span>
          <span class="rec-meta">${d.clientName || (d.client && d.client.name) || '—'} · ${ui.fmtDate(d.dateISO)}</span>
        </button>
        <button class="btn-icon del" data-del="${d.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </div>`).join('');
    host.querySelectorAll('[data-open]').forEach(b => b.onclick = () => {
      const d = store.find('projectDocs', b.dataset.open);
      if (!d) return;
      $('preview').innerHTML = projectDoc.render(d);
      if ($('btnPrint')) $('btnPrint').style.display = '';
      savedLocked = true;
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    host.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
      store.remove('projectDocs', b.dataset.del); renderRecent(); ui.toast('Deleted');
    });
  }

  /* ---- wiring ---- */
  function wire() {
    simpleFields().forEach(el => el.addEventListener('input', render));
    if ($('docDate')) $('docDate').onchange = () => { $('fy').value = ui.fyFromDate($('docDate').value); refreshSeq(); render(); };
    if ($('fy')) $('fy').oninput = () => { refreshSeq(); render(); };
    if ($('seq')) $('seq').oninput = render;
    $('client').onchange = () => { const c = currentClient(); if (c.name) $('clientSearch').value = c.name; renderClientInfo(); render(); };
    $('clientSearch').oninput = () => {
      const c = lookupClient($('clientSearch').value);
      if (c) { $('client').value = c.id; renderClientInfo(); render(); }
    };
    if ($('addClient')) $('addClient').onclick = () => CM.customerForm(null, saved => {
      fillClients(); $('client').value = saved.id; $('clientSearch').value = saved.name;
      renderClientInfo(); render(); ui.toast('Client added & selected');
    });
    $('btnSave').onclick = save;
    if ($('btnPrint')) $('btnPrint').onclick = () => window.print();
  }

  /* ---- init ---- */
  if ($('docDate')) $('docDate').valueAsDate = new Date();
  if ($('fy')) $('fy').value = ui.fyFromDate();
  fillClients();
  initReps();
  wire();
  refreshSeq();
  renderClientInfo();
  renderRecent();
  render();
})();
