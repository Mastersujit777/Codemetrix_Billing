/* Customers page */
(function () {
  const { ui, store } = CM;
  ui.nav('customers.html');
  const $ = id => document.getElementById(id);

  function filtered() {
    const q = $('fSearch').value.trim().toLowerCase();
    const cs = store.list('customers');
    if (!q) return cs;
    return cs.filter(c => {
      const hay = `${c.name || ''} ${c.username || ''} ${c.phone || ''} ${c.email || ''} ${c.contactPersonName || ''} ${c.contactPersonPhone || ''} ${c.contact || ''}`.toLowerCase();
      return hay.includes(q);
    });
  }

  function rows() {
    const cs = filtered();
    $('rows').innerHTML = cs.length ? cs.map(c => {
      const fin = ui.customerFinance(c);
      const sub = [c.phone || c.contact, c.email].filter(Boolean).join(' · ');
      return `
      <tr class="row-click" data-open="${c.id}" title="View transactions & balance">
        <td><div class="cell-main">${c.name}</div>${sub ? `<div class="cell-sub">${sub}</div>` : ''}</td>
        <td><span class="tag-pill ${c.kind === 'student' ? 'g' : 'n'}">${c.kind || 'student'}</span></td>
        <td class="mono">${c.username || '—'}</td>
        <td>${c.stateName || '—'}</td>
        <td class="mono">${c.gstin || '—'}</td>
        <td class="r mono ${fin.balance > 0 ? 'bal-due' : 'bal-clear'}">${ui.money(fin.balance)}</td>
        <td class="r">
          <button class="btn-icon" data-view="${c.id}" title="Transactions & balance"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" data-edit="${c.id}" title="Edit"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon del" data-del="${c.id}" title="Delete"><i class="fa-solid fa-xmark"></i></button>
        </td>
      </tr>`;
    }).join('')
      : `<tr><td colspan="7" class="empty">${store.list('customers').length ? 'No customers match your search.' : 'No customers yet. Add your first student or client.'}</td></tr>`;
    // clicking anywhere on the row (except an action button) opens the ledger
    $('rows').querySelectorAll('[data-open]').forEach(tr => tr.onclick = e => {
      if (e.target.closest('button')) return;
      detail(store.find('customers', tr.dataset.open));
    });
    $('rows').querySelectorAll('[data-view]').forEach(b => b.onclick = () => detail(store.find('customers', b.dataset.view)));
    $('rows').querySelectorAll('[data-edit]').forEach(b => b.onclick = () => CM.customerForm(store.find('customers', b.dataset.edit), rows));
    $('rows').querySelectorAll('[data-del]').forEach(b => b.onclick = () => del(b.dataset.del));
  }

  /* ---- per-customer transactions + balance ---- */
  function detail(c) {
    const fin = ui.customerFinance(c);
    const txns = fin.docs.length ? fin.docs.map(d => `
      <tr>
        <td>${ui.fmtDate(d.dateISO)}</td>
        <td class="mono" style="font-size:12px">${d.no}</td>
        <td><span class="tag-pill ${d.type === 'RV' ? 'g' : 'n'}">${d.type === 'RV' ? 'Receipt' : 'Invoice'}</span></td>
        <td class="r mono">${ui.money(d.taxable)}</td>
        <td class="r mono">${ui.money(ui.taxOf(d))}</td>
        <td class="r mono">${ui.money(d.total)}</td>
        <td class="r mono">${d.type === 'INV' ? ui.money(d.net) : '—'}</td>
      </tr>`).join('')
      : `<tr><td colspan="7" class="empty">No transactions yet for this customer.</td></tr>`;

    const body = `
      <div class="cust-meta">
        <span class="tag-pill">@${c.username || '—'}</span>
        <span class="muted"><i class="fa-solid fa-phone"></i> ${c.phone || c.contact || '—'}</span>
        ${c.email ? `<span class="muted"><i class="fa-solid fa-envelope"></i> ${c.email}</span>` : ''}
        ${(c.contactPersonName || c.contactPersonPhone) ? `<span class="muted"><i class="fa-solid fa-user-tie"></i> ${[c.contactPersonName, c.contactPersonPhone].filter(Boolean).join(' · ')}</span>` : ''}
        <span class="muted"><i class="fa-solid fa-location-dot"></i> ${c.stateName || '—'}</span>
        ${c.gstin ? `<span class="muted mono"><i class="fa-solid fa-receipt"></i> ${c.gstin}</span>` : ''}
      </div>
      <div class="stat-grid stat-grid-sm">
        <div class="stat is-green"><div class="k">Received (advances)</div><div class="v">₹${ui.money(fin.received)}</div></div>
        <div class="stat"><div class="k">Invoiced value</div><div class="v">₹${ui.money(fin.invoicedTotal)}</div></div>
        <div class="stat is-navy"><div class="k">${fin.hasInvoice ? 'Net due' : 'Balance to collect'}</div><div class="v">₹${ui.money(fin.balance)}</div></div>
      </div>
      <div class="lab" style="margin-top:18px">Transactions</div>
      <div class="table-responsive"><table class="grid">
        <thead><tr><th>Date</th><th>Number</th><th>Type</th><th class="r">Taxable</th><th class="r">GST</th><th class="r">Total</th><th class="r">Net</th></tr></thead>
        <tbody>${txns}</tbody>
      </table></div>`;

    ui.modal(c.name, body, `<button class="btn btn-ghost" data-close>Close</button>`, { size: 'lg', scrollable: true });
  }

  function del(id) {
    const c = store.find('customers', id);
    const m = ui.modal('Delete customer', `<p style="font-size:13px;color:var(--muted);padding:10px 0">Delete <b style="color:var(--ink)">${c.name}</b>? Documents already in the register are not affected.</p>`,
      `<button class="btn btn-ghost" data-close>Cancel</button><button class="btn btn-danger" id="m_del"><i class="fa-solid fa-trash"></i> Delete</button>`);
    m.querySelector('#m_del').onclick = () => { store.remove('customers', id); ui.closeModal(); ui.toast('Customer deleted'); rows(); };
  }

  $('add').onclick = () => CM.customerForm(null, rows);
  $('fSearch').oninput = rows;
  rows();
})();
