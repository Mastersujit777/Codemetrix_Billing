/* Services page */
(function () {
  const { ui, store } = CM;
  ui.nav('services.html');
  const $ = id => document.getElementById(id);

  function rows() {
    const ss = store.list('services');
    $('rows').innerHTML = ss.length ? ss.map(s => `
      <tr>
        <td class="cell-main">${s.name}</td>
        <td class="mono">${s.prefix || '—'}</td>
        <td class="mono">${s.sac}</td>
        <td class="r mono">${s.rate}%</td>
        <td><span class="tag-pill n">${s.inclusive ? 'GST-inclusive' : 'GST extra'}</span></td>
        <td class="r">
          <button class="btn-icon" data-edit="${s.id}" title="Edit"><i class="fa-solid fa-pen"></i> edit</button>
          <button class="btn-icon del" data-del="${s.id}" title="Delete"><i class="fa-solid fa-xmark"></i></button>
        </td>
      </tr>`).join('')
      : `<tr><td colspan="6" class="empty">No services yet.</td></tr>`;
    $('rows').querySelectorAll('[data-edit]').forEach(b => b.onclick = () => form(store.find('services', b.dataset.edit)));
    $('rows').querySelectorAll('[data-del]').forEach(b => b.onclick = () => del(b.dataset.del));
  }

  function form(s) {
    s = s || { rate: 18, inclusive: true };
    const m = ui.modal(s.id ? 'Edit service' : 'Add service', `
      <label class="f"><span class="lab">Service name</span><input id="m_name" value="${s.name || ''}"></label>
      <div class="row3">
        <label class="f"><span class="lab">Ref prefix</span><input id="m_prefix" class="mono" placeholder="INT / TRN / SWD" maxlength="6" value="${s.prefix || ''}"></label>
        <label class="f"><span class="lab">SAC code</span><input id="m_sac" class="mono" value="${s.sac || ''}"></label>
        <label class="f"><span class="lab">GST rate (%)</span><input id="m_rate" class="mono" type="number" value="${s.rate}"></label>
      </div>
      <label class="check"><input type="checkbox" id="m_incl" ${s.inclusive ? 'checked' : ''}> Quoted fee is GST-inclusive by default</label>
      <p class="hint">The ref prefix builds enrollment numbers on the bill, e.g. <b>INT</b>-2026-001. Each prefix gets its own yearly series.</p>`,
      `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-primary" id="m_save">Save</button>`);
    m.querySelector('#m_save').onclick = () => {
      const name = m.querySelector('#m_name').value.trim();
      if (!name) { ui.toast('Name is required', 'err'); return; }
      store.upsert('services', {
        id: s.id, name, prefix: m.querySelector('#m_prefix').value.trim().toUpperCase(),
        sac: m.querySelector('#m_sac').value.trim(),
        rate: +m.querySelector('#m_rate').value || 0, inclusive: m.querySelector('#m_incl').checked
      });
      ui.closeModal(); ui.toast('Service saved'); rows();
    };
  }

  function del(id) {
    const s = store.find('services', id);
    const m = ui.modal('Delete service', `<p style="font-size:13px;color:var(--muted);padding:10px 0">Delete <b style="color:var(--ink)">${s.name}</b>?</p>`,
      `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" id="m_del"><i class="fa-solid fa-trash"></i> Delete</button>`);
    m.querySelector('#m_del').onclick = () => { store.remove('services', id); ui.closeModal(); ui.toast('Service deleted'); rows(); };
  }

  $('add').onclick = () => form();
  rows();
})();
