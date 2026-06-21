/* CodeMetrix Billing — shared Add/Edit customer modal.
   Used by the Customers page and the Billing page. Enforces unique phone,
   email and username (firstname_secondname). onSaved(savedCustomer) fires on success. */
window.CM = window.CM || {};
(function () {
  // username = first + middle name only (first two words), e.g. "John Michael Doe" -> john_michael
  function slugUser(name) {
    return (name || '').toLowerCase()
      .replace(/[^a-z0-9\s]+/g, '')
      .split(/\s+/).filter(Boolean)
      .slice(0, 2)
      .join('_');
  }

  CM.customerForm = function (existing, onSaved) {
    const { ui, store } = CM;
    const c = existing || {};
    const m = ui.modal(c.id ? 'Edit customer' : 'Add customer', `
      <div class="row2">
        <label class="f"><span class="lab">Name</span><input id="m_name" value="${c.name || ''}"></label>
        <label class="f"><span class="lab">Type</span><select id="m_kind">
          <option value="student" ${c.kind === 'student' ? 'selected' : ''}>Student</option>
          <option value="client" ${c.kind === 'client' ? 'selected' : ''}>Business client (B2B)</option>
        </select></label>
      </div>
      <div class="row2">
        <label class="f"><span class="lab">Username *</span><input id="m_username" class="mono" placeholder="firstname_secondname" value="${c.username || ''}"></label>
        <label class="f"><span class="lab">Phone number *</span><input id="m_phone" class="mono" placeholder="Unique, required" value="${c.phone || c.contact || ''}"></label>
      </div>
      <div class="row2">
        <label class="f"><span class="lab">Email (optional)</span><input id="m_email" type="email" placeholder="Unique if provided" value="${c.email || ''}"></label>
        <label class="f"><span class="lab">State (CGST+SGST vs IGST)</span><select id="m_state" class="mono">${ui.stateOptions(c.stateCode || '21')}</select></label>
      </div>
      <div class="row2">
        <label class="f"><span class="lab">Contact person (optional)</span><input id="m_cpname" placeholder="optional" value="${c.contactPersonName || ''}"></label>
        <label class="f"><span class="lab">Contact person phone (optional)</span><input id="m_cpphone" class="mono" placeholder="optional" value="${c.contactPersonPhone || ''}"></label>
      </div>
      <label class="f" id="m_gstinWrap"><span class="lab">GSTIN (B2B)</span><input id="m_gstin" class="mono" placeholder="optional" value="${c.gstin || ''}"></label>
      <label class="f"><span class="lab">Address (optional)</span><textarea id="m_addr" placeholder="Required only if a single invoice exceeds ₹50,000">${c.address || ''}</textarea></label>`,
      `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="m_save">Save</button>`);

    const $ = s => m.querySelector(s);

    // GSTIN applies to business clients only — students don't have one
    const toggleGst = () => { $('#m_gstinWrap').style.display = $('#m_kind').value === 'client' ? 'block' : 'none'; };
    $('#m_kind').onchange = toggleGst; toggleGst();

    // auto-fill username as firstname_secondname while it hasn't been edited by hand
    let userEdited = !!c.username;
    $('#m_username').oninput = () => { userEdited = true; };
    $('#m_name').oninput = () => { if (!userEdited) $('#m_username').value = slugUser($('#m_name').value); };

    $('#m_save').onclick = () => {
      const name = $('#m_name').value.trim();
      if (!name) { ui.toast('Name is required', 'err'); return; }
      const phone = $('#m_phone').value.trim();
      if (!phone) { ui.toast('Phone number is required', 'err'); return; }
      const username = ($('#m_username').value.trim() || slugUser(name));
      if (!username) { ui.toast('Username is required', 'err'); return; }
      const email = $('#m_email').value.trim();
      const kind = $('#m_kind').value;

      const others = store.list('customers').filter(x => x.id !== c.id);
      const norm = s => (s || '').trim().toLowerCase();
      if (others.some(x => norm(x.phone) === norm(phone))) { ui.toast('A customer with this phone number already exists', 'err'); return; }
      if (email && others.some(x => norm(x.email) === norm(email))) { ui.toast('A customer with this email already exists', 'err'); return; }
      if (others.some(x => norm(x.username) === norm(username))) { ui.toast('That username is already taken', 'err'); return; }

      const [stateName, stateCode] = $('#m_state').value.split('|');
      const saved = store.upsert('customers', {
        id: c.id, name, kind, username, phone, email,
        contactPersonName: $('#m_cpname').value.trim(),
        contactPersonPhone: $('#m_cpphone').value.trim(),
        stateName, stateCode,
        gstin: kind === 'client' ? $('#m_gstin').value.trim() : '',
        address: $('#m_addr').value.trim(),
        notes: c.notes || ''
      });
      ui.closeModal(); ui.toast('Customer saved');
      if (onSaved) onSaved(saved);
    };
    return m;
  };
})();
