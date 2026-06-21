/* Billing page */
(function () {
  const { ui, store, doc } = CM;
  ui.nav('index.html');

  const $ = id => document.getElementById(id);
  const state = { type: 'RV', incl: 'incl', advances: [] };

  /* ---- populate selects ---- */
  function fillCentres() {
    $('centre').innerHTML = store.centres().map(c => `<option value="${c.code}">${c.name}</option>`).join('');
  }
  function fillServices() {
    $('service').innerHTML = store.list('services').map(s => `<option value="${s.id}">${s.name} · SAC ${s.sac}</option>`).join('');
  }
  function fillCustomers() {
    const cs = store.list('customers');
    $('customer').innerHTML = `<option value="">— search or select a customer —</option>`
      + cs.map(c => `<option value="${c.id}">${c.name}${c.username ? ' · ' + c.username : ''}</option>`).join('');
    // searchable suggestions: name · username · phone · email
    $('custList').innerHTML = cs.map(c =>
      `<option value="${[c.name, c.username, c.phone || c.contact, c.email].filter(Boolean).join(' · ').replace(/"/g, '&quot;')}"></option>`).join('');
  }

  function currentCustomer() { return store.find('customers', $('customer').value) || {}; }
  function currentService() { return store.find('services', $('service').value) || {}; }

  /* find a customer by typed phone, username, email or name */
  function lookupCustomer(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return null;
    const cs = store.list('customers');
    const composite = c => [c.name, c.username, c.phone || c.contact, c.email].filter(Boolean).join(' · ').toLowerCase();
    return cs.find(c => composite(c) === q)                                   // exact datalist pick
      || cs.find(c => (c.username || '').toLowerCase() === q)                  // exact username
      || cs.find(c => (c.phone || '').toLowerCase() === q)                    // exact phone
      || cs.find(c => (c.name || '').toLowerCase() === q)                     // exact name
      || cs.find(c => `${c.name || ''} ${c.username || ''} ${c.phone || ''} ${c.email || ''} ${c.contact || ''}`.toLowerCase().includes(q)); // partial
  }

  /* show the matched customer's full details below the selector */
  function renderCustInfo() {
    const c = currentCustomer();
    const el = $('custInfo');
    if (!c.id) { el.innerHTML = ''; return; }
    el.innerHTML = `
      <div class="ci-row"><i class="fa-solid fa-user"></i><span>${c.name}${c.kind ? ` <span class="muted">(${c.kind})</span>` : ''}</span></div>
      <div class="ci-row"><i class="fa-solid fa-phone"></i><span class="mono">${c.phone || c.contact || '—'}</span></div>
      ${c.email ? `<div class="ci-row"><i class="fa-solid fa-envelope"></i><span>${c.email}</span></div>` : ''}
      ${c.username ? `<div class="ci-row"><i class="fa-solid fa-at"></i><span class="mono">${c.username}</span></div>` : ''}
      ${(c.contactPersonName || c.contactPersonPhone) ? `<div class="ci-row"><i class="fa-solid fa-user-tie"></i><span>${[c.contactPersonName, c.contactPersonPhone].filter(Boolean).join(' · ')}</span></div>` : ''}
      <div class="ci-row"><i class="fa-solid fa-location-dot"></i><span>${c.stateName || '—'}${c.gstin ? ` · GSTIN <span class="mono">${c.gstin}</span>` : ''}</span></div>
      ${c.address ? `<div class="ci-row"><i class="fa-solid fa-house"></i><span>${c.address.replace(/\n/g, ', ')}</span></div>` : ''}`;
  }

  /* apply customer/service defaults when chosen */
  function onCustomer() {
    renderCustInfo();
    render();
  }
  function onService() {
    const s = currentService();
    if (s) { setIncl(s.inclusive ? 'incl' : 'excl'); if (s.rate !== undefined) setRate(s.rate); }
    render();
  }

  /* service prefix used inside the bill number (INT / TRN / SWD …) */
  function servicePrefix() {
    const s = currentService();
    if (s.prefix) return String(s.prefix).toUpperCase();
    const map = { internship: 'INT', training: 'TRN', software: 'SWD' };
    const n = (s.name || '').toLowerCase();
    for (const k in map) if (n.includes(k)) return map[k];
    return ((s.name || 'GEN').replace(/[^a-z]/gi, '').slice(0, 3) || 'GEN').toUpperCase();
  }
  function setIncl(v) {
    state.incl = v;
    $('segIncl').querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.v === v));
  }
  /* set the GST-rate selector, adding the option if the service uses a non-standard rate */
  function setRate(rate) {
    const sel = $('gstRate'), v = String(+rate || 0);
    if (![...sel.options].some(o => o.value === v)) sel.insertAdjacentHTML('beforeend', `<option value="${v}">${v}%</option>`);
    sel.value = v;
  }

  /* payment mode — Cash needs no reference; other modes require a transaction ID */
  const REFLABEL = { UPI: 'UPI transaction ID', Card: 'Card / approval reference', 'Bank transfer': 'UTR / reference no.', Cheque: 'Cheque no.' };
  function onPayMode() {
    const pm = $('payMode').value, isCash = pm === 'Cash';
    $('payRefWrap').style.display = isCash ? 'none' : 'block';
    $('payRefLab').textContent = REFLABEL[pm] || 'Transaction ID';
    if (!isCash) $('payRef').placeholder = REFLABEL[pm] || 'Transaction / reference no.';
    render();
  }

  function refreshSeq() {
    $('fy').value = $('fy').value || ui.fyFromDate($('docDate').value);
    $('seq').value = store.peekSeq($('centre').value, state.type, $('fy').value);
  }

  function docNo() {
    return `CM/${$('centre').value}/${state.type}/${servicePrefix()}/${$('fy').value}/${$('seq').value}`;
  }

  function buildInput() {
    const c = currentCustomer(), s = currentService();
    const base = {
      type: state.type, no: docNo(), dateISO: $('docDate').value || new Date().toISOString(),
      centreCode: $('centre').value,
      customer: { name: c.name || '—', username: c.username || '', phone: c.phone || c.contact || '', address: c.address || '', gstin: c.gstin || '', stateName: c.stateName || 'Odisha', stateCode: c.stateCode || '21' },
      service: { name: s.name || '—', sac: s.sac || '', prefix: servicePrefix() },
      rate: +$('gstRate').value || 0, inclusive: state.incl === 'incl',
      fee: +$('fee').value || 0,
      payMode: $('payMode').value,
      payRef: $('payMode').value === 'Cash' ? '' : $('payRef').value.trim(),
      signMode: $('signMode').value
    };
    if (state.type === 'RV') { base.basis = +$('instAmt').value || 0; base.instLabel = $('instLabel').value; }
    else { base.advances = state.advances.slice(); base.lastPaid = +$('invLastAmt').value || 0; }
    return base;
  }

  let savedLocked = false;   // true right after a save; the next edit starts a fresh number

  function render() {
    // any live edit means an unsaved bill — hide Print until (re)saved
    if (savedLocked) { savedLocked = false; refreshSeq(); }
    $('btnPrint').style.display = 'none';

    // nothing happens until a customer is chosen
    if (!currentCustomer().id) {
      $('preview').innerHTML = `<div class="doc-empty"><i class="fa-solid fa-magnifying-glass"></i><div>Search and select a customer above to start the bill.</div></div>`;
      $('docNoShort').value = '';
      return null;
    }
    const rec = doc.computeDoc(buildInput());
    $('preview').innerHTML = doc.renderDoc(rec);
    $('docNoShort').value = rec.no.split('/').slice(-2).join('/');
    return rec;
  }

  /* ---- advances UI (INV) ---- */
  function renderAdv() {
    if (!state.advances.length) state.advances = [{ no: '', amt: '' }];
    $('advList').innerHTML = state.advances.map((a, i) => `
      <div class="adv-row">
        <input class="mono" placeholder="RV no." value="${a.no || ''}" data-i="${i}" data-k="no">
        <input class="mono" placeholder="amount" type="number" value="${a.amt || ''}" data-i="${i}" data-k="amt">
        <button class="btn-icon del" data-del="${i}" title="Remove"><i class="fa-solid fa-xmark"></i></button>
      </div>`).join('');
    $('advList').querySelectorAll('input').forEach(inp => inp.oninput = e => {
      state.advances[e.target.dataset.i][e.target.dataset.k] = e.target.value; render();
    });
    $('advList').querySelectorAll('[data-del]').forEach(b => b.onclick = e => {
      state.advances.splice(+e.target.dataset.del, 1); renderAdv(); render();
    });
  }

  function pullReceipts() {
    const c = currentCustomer(), svc = currentService();
    if (!c.id) { ui.toast('Choose a customer first', 'err'); return; }
    const rvs = store.list('documents').filter(d => d.type === 'RV' && d.customer
      && ((c.username && d.customer.username === c.username) || (c.phone && d.customer.phone === c.phone) || d.customer.name === c.name)
      && d.service && d.service.name === svc.name);
    if (!rvs.length) { ui.toast('No receipt vouchers found for this customer & service', 'err'); return; }
    state.advances = rvs.map(d => ({ no: d.no, amt: d.total }));
    renderAdv(); render(); ui.toast(`Loaded ${rvs.length} receipt voucher(s)`);
  }

  /* ---- save to register ---- */
  function save() {
    if (savedLocked) { ui.toast('Already saved — change something to start a new bill'); return; }
    if (!currentCustomer().id) { ui.toast('Search & select a customer first', 'err'); return; }
    const pm = $('payMode').value;
    if (pm !== 'Cash' && !$('payRef').value.trim()) { ui.toast(`Enter the ${REFLABEL[pm] || 'transaction ID'}`, 'err'); return; }
    const rec = doc.computeDoc(buildInput());
    const n = parseInt($('seq').value, 10);
    store.consumeSeq($('centre').value, state.type, $('fy').value, n);
    rec.id = store.id('doc');
    store.upsert('documents', rec);
    ui.toast(`Saved ${rec.no} to register`);
    // keep the saved bill on screen and reveal Print
    $('preview').innerHTML = doc.renderDoc(rec);
    $('docNoShort').value = rec.no.split('/').slice(-2).join('/');
    $('btnPrint').style.display = '';
    savedLocked = true;
    // auto-advance the sequence so the next bill of this kind is already numbered
    refreshSeq();
    $('docNoShort').value = `${$('fy').value}/${$('seq').value}`;
  }

  /* ---- wiring ---- */
  $('segType').querySelectorAll('button').forEach(b => b.onclick = () => {
    $('segType').querySelectorAll('button').forEach(x => x.classList.remove('on'));
    b.classList.add('on'); state.type = b.dataset.v;
    $('rvFields').style.display = state.type === 'RV' ? 'block' : 'none';
    $('invFields').style.display = state.type === 'INV' ? 'block' : 'none';
    $('typeHint').textContent = state.type === 'RV'
      ? 'For an advance / installment received before the programme is delivered.'
      : 'Issued on completion — charges GST on the full fee and adjusts advances.';
    if (state.type === 'INV') renderAdv();
    refreshSeq(); render();
  });
  $('segIncl').querySelectorAll('button').forEach(b => b.onclick = () => { setIncl(b.dataset.v); render(); });
  $('gstRate').onchange = render;
  $('payMode').onchange = onPayMode;
  $('payRef').oninput = render;
  $('signMode').onchange = render;
  $('centre').onchange = () => { refreshSeq(); render(); };
  $('fy').oninput = () => { refreshSeq(); render(); };
  $('seq').oninput = render;
  $('docDate').onchange = () => { $('fy').value = ui.fyFromDate($('docDate').value); refreshSeq(); render(); };
  $('customer').onchange = () => { const c = currentCustomer(); if (c.name) $('custSearch').value = c.name; onCustomer(); };
  $('custSearch').oninput = () => {
    const c = lookupCustomer($('custSearch').value);
    if (c) { $('customer').value = c.id; onCustomer(); }
  };
  $('addCust').onclick = () => CM.customerForm(null, saved => {
    fillCustomers();
    $('customer').value = saved.id;
    $('custSearch').value = saved.name;
    onCustomer();
    ui.toast('Customer added & selected');
  });
  $('service').onchange = onService;
  $('addAdv').onclick = () => { state.advances.push({ no: '', amt: '' }); renderAdv(); render(); };
  $('pullAdv').onclick = pullReceipts;
  $('btnSave').onclick = save;
  $('btnPrint').onclick = () => window.print();
  ['fee', 'instAmt', 'instLabel', 'invLastAmt'].forEach(id => $(id).addEventListener('input', render));

  /* init */
  $('docDate').valueAsDate = new Date();
  $('fy').value = ui.fyFromDate();
  fillCentres(); fillServices(); fillCustomers();
  onService();        // sets inclusive + GST rate from the default service
  onPayMode();        // sets payment-reference visibility
  renderCustInfo();   // empty until a customer is chosen
  refreshSeq();
  render();           // shows the "search a customer" placeholder
})();
