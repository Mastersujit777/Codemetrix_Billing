/* Settings page */
(function () {
  const { ui, store } = CM;
  ui.nav('settings.html');
  const $ = id => document.getElementById(id);

  /* business profile */
  function loadBiz() {
    const b = store.business();
    $('b_name').value = b.name || ''; $('b_tag').value = b.tag || ''; $('b_addr').value = b.address || '';
    $('b_gstin').value = b.gstin || ''; $('b_pan').value = b.pan || ''; $('b_udyam').value = b.udyam || '';
    $('b_contact').value = b.contact || '';
    $('b_state').innerHTML = ui.stateOptions(b.stateCode || '21');
  }
  $('saveBiz').onclick = () => {
    const [stateName, stateCode] = $('b_state').value.split('|');
    // merge so UPI / QR details (saved separately) are preserved
    store.setBusiness(Object.assign({}, store.business(), {
      name: $('b_name').value.trim(), tag: $('b_tag').value.trim(), address: $('b_addr').value.trim(),
      gstin: $('b_gstin').value.trim(), pan: $('b_pan').value.trim(), udyam: $('b_udyam').value.trim(),
      stateName, stateCode, contact: $('b_contact').value.trim()
    }));
    ui.toast('Profile saved'); ui.nav('settings.html');
  };

  /* payment / UPI */
  let upiQr = '';
  function loadPay() {
    const b = store.business();
    $('b_upi').value = b.upiId || 'codemetrix1@ucobank';
    $('b_bankName').value = b.bankName || 'UCO Bank';
    $('b_bankAccName').value = b.bankAccName || 'Codemetrix';
    $('b_bankAccNo').value = b.bankAccNo || '25430210003343';
    $('b_bankIfsc').value = b.bankIfsc || 'UCBA0002543';
    upiQr = b.upiQr || '';
    renderUpiPrev();
  }
  function renderUpiPrev() {
    $('upiPrev').innerHTML = upiQr
      ? `<img src="${upiQr}" alt="UPI QR">`
      : `<span class="ph"><i class="fa-solid fa-qrcode"></i></span>`;
  }
  $('upiPick').onclick = () => $('upiFile').click();
  $('upiFile').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    if (!/^image\//.test(f.type)) { ui.toast('Choose an image file', 'err'); return; }
    const r = new FileReader();
    r.onload = () => { upiQr = r.result; renderUpiPrev(); ui.toast('QR loaded — click Save payment details'); };
    r.readAsDataURL(f);
    e.target.value = '';
  };
  $('upiClear').onclick = () => { upiQr = ''; renderUpiPrev(); };
  $('savePay').onclick = () => {
    store.setBusiness(Object.assign({}, store.business(), {
      upiId: $('b_upi').value.trim(), upiQr,
      bankName: $('b_bankName').value.trim(),
      bankAccName: $('b_bankAccName').value.trim(),
      bankAccNo: $('b_bankAccNo').value.trim(),
      bankIfsc: $('b_bankIfsc').value.trim().toUpperCase()
    }));
    ui.toast('Payment details saved');
  };

  /* centres */
  let centres = JSON.parse(JSON.stringify(store.centres()));
  function renderCentres() {
    $('centres').innerHTML = centres.map((c, i) => `
      <div class="row3" style="margin-top:10px;align-items:end">
        <label class="f" style="margin:0"><span class="lab">Code</span><input class="mono" value="${c.code}" data-i="${i}" data-k="code" maxlength="6"></label>
        <label class="f" style="margin:0"><span class="lab">Centre name</span><input value="${c.name}" data-i="${i}" data-k="name"></label>
        <div style="display:flex;gap:8px;align-items:end">
          <label class="f" style="margin:0;flex:1"><span class="lab">Address</span><input value="${c.address}" data-i="${i}" data-k="address"></label>
          <button class="btn-icon del" data-del="${i}" style="margin-bottom:8px" title="Remove"><i class="fa-solid fa-xmark"></i></button>
        </div>
      </div>`).join('');
    $('centres').querySelectorAll('input').forEach(inp => inp.oninput = e => { centres[e.target.dataset.i][e.target.dataset.k] = e.target.value; });
    $('centres').querySelectorAll('[data-del]').forEach(b => b.onclick = e => { centres.splice(+e.target.dataset.del, 1); renderCentres(); });
  }
  $('addCentre').onclick = () => { centres.push({ code: '', name: '', address: '' }); renderCentres(); };
  $('saveCentres').onclick = () => {
    centres = centres.filter(c => c.code.trim() && c.name.trim()).map(c => ({ code: c.code.trim().toUpperCase(), name: c.name.trim(), address: c.address.trim() }));
    if (!centres.length) { ui.toast('Keep at least one centre', 'err'); return; }
    store.setCentres(centres); ui.toast('Centres saved'); renderCentres();
  };

  /* data backup */
  $('backup').onclick = () => {
    const blob = new Blob([store.exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `codemetrix-backup-${new Date().toISOString().slice(0, 10)}.json`; a.click();
    ui.toast('Backup downloaded');
  };
  $('restoreBtn').onclick = () => $('restoreFile').click();
  $('restoreFile').onchange = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = () => { try { store.importJSON(r.result); ui.toast('Data restored'); loadBiz(); loadPay(); centres = JSON.parse(JSON.stringify(store.centres())); renderCentres(); } catch (err) { ui.toast('Invalid backup file', 'err'); } };
    r.readAsText(f);
  };
  $('reset').onclick = () => {
    const m = ui.modal('Reset all data', `<p style="font-size:13px;color:var(--muted);padding:10px 0">This erases all customers, services and saved documents in this browser and restores the seed data. Back up first if unsure.</p>`,
      `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" id="m_reset"><i class="fa-solid fa-trash-can"></i> Reset everything</button>`);
    m.querySelector('#m_reset').onclick = () => { store.reset(); ui.closeModal(); ui.toast('Data reset'); loadBiz(); loadPay(); centres = JSON.parse(JSON.stringify(store.centres())); renderCentres(); ui.nav('settings.html'); };
  };

  loadBiz(); loadPay(); renderCentres();
})();
