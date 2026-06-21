/* CodeMetrix Billing — document model + A4 renderer.
   computeDoc(input) -> normalized record;  renderDoc(record) -> A4 HTML string. */
window.CM = window.CM || {};
CM.doc = (function () {
  const { money, inWords, splitTax, fmtDate } = CM.ui;

  /* input: {type, no, dateISO, centreCode, customer{name,ref,address,gstin,stateName,stateCode},
             service{name,sac}, rate, inclusive, fee, basis, instLabel, advances[]} */
  function computeDoc(input) {
    const biz = CM.store.business();
    const inter = String(input.customer.stateCode) !== String(biz.stateCode);
    const rec = Object.assign({}, input, { inter });

    if (input.type === 'RV') {
      const s = splitTax(input.basis, input.rate, input.inclusive, inter);
      Object.assign(rec, s, { net: s.total });
    } else { // INV
      const s = splitTax(input.fee, input.rate, input.inclusive, inter);
      const advTotal = (input.advances || []).reduce((t, a) => t + (+a.amt || 0), 0);
      const lastPaid = +input.lastPaid || 0;          // final installment collected now
      Object.assign(rec, s, { advTotal, lastPaid, net: CM.ui.round2(s.total - advTotal - lastPaid) });
    }
    return rec;
  }

  function renderDoc(r) {
    const biz = CM.store.business();
    const centre = CM.store.centre(r.centreCode) || { name: r.centreCode, address: '' };
    const isRV = r.type === 'RV';
    const noTax = !(+r.rate > 0);   // 0% / exempt — no GST on this document
    const taxCols = noTax ? '' : (r.inter ? `<th>IGST</th>` : `<th>CGST</th><th>SGST</th>`);
    const taxCells = noTax ? '' : (r.inter
      ? `<td class="num-c">₹${money(r.igst)}</td>`
      : `<td class="num-c">₹${money(r.cgst)}</td><td class="num-c">₹${money(r.sgst)}</td>`);
    const taxLines = noTax ? '' : (r.inter
      ? `<div class="tr"><span>IGST @ ${r.rate}%</span><span class="v">₹${money(r.igst)}</span></div>`
      : `<div class="tr"><span>CGST @ ${r.rate / 2}%</span><span class="v">₹${money(r.cgst)}</span></div>
         <div class="tr"><span>SGST @ ${r.rate / 2}%</span><span class="v">₹${money(r.sgst)}</span></div>`);
    const valueLabel = noTax ? 'Amount' : 'Taxable value';

    let descSub, totalsHTML, grandLabel, grandVal, words, noteHTML;

    if (isRV) {
      descSub = `${r.instLabel || 'Advance'} · ${r.service.name} · programme fee ₹${money(r.fee)}`;
      totalsHTML =
        `<div class="tr"><span>${valueLabel}</span><span class="v">₹${money(r.taxable)}</span></div>` +
        taxLines;
      grandLabel = 'Advance received'; grandVal = r.total; words = inWords(r.total);
      noteHTML = `<span class="nh">Note</span>${noTax
        ? 'Advance received against the above programme. A final bill adjusting all advances will follow on completion.'
        : 'Advance received against the above programme. GST is discharged on this advance. A tax invoice adjusting all advances will follow on completion.'}`;
    } else {
      descSub = `Full programme fee · ${r.service.name}`;
      const advLines = (r.advances || []).filter(a => +a.amt > 0)
        .map(a => `<div class="tr adj"><span>Less: advance ${a.no || '(RV)'}</span><span class="v">– ₹${money(a.amt)}</span></div>`).join('');
      const paidNow = (+r.lastPaid > 0)
        ? `<div class="tr adj"><span>Less: payment received now</span><span class="v">– ₹${money(r.lastPaid)}</span></div>` : '';
      totalsHTML =
        `<div class="tr"><span>${valueLabel}</span><span class="v">₹${money(r.taxable)}</span></div>` +
        taxLines +
        (noTax ? '' : `<div class="tr sep"><span>Invoice value</span><span class="v">₹${money(r.total)}</span></div>`) + advLines + paidNow;
      grandLabel = (r.advTotal > 0 || +r.lastPaid > 0) ? 'Net payable' : 'Total payable';
      grandVal = r.net < 0 ? 0 : r.net; words = inWords(grandVal);
      noteHTML = `<span class="nh">Note</span>${noTax
        ? 'This bill covers the full programme fee. Advances already receipted are adjusted above; only the net amount remains payable.'
        : 'This tax invoice covers the full programme fee with GST discharged on the total. Advances already receipted are adjusted above; only the net amount remains payable.'}`;
    }

    const placeOfSupply = r.inter ? `${r.customer.stateName} (inter-state)` : `${biz.stateName} (intra-state)`;

    return `
    <div class="doc ${isRV ? 'is-rv' : ''}">
      <div class="d-head">
        <div class="d-co">
          <div class="d-logo">${CM.ui.logoFull()}</div>
          ${biz.tag ? `<div class="tag">${biz.tag}</div>` : ''}
          <div class="addr">${(biz.address || '').replace(/\n/g, '<br>')}</div>
          <div class="d-ids">
            ${biz.gstin ? `<b>GSTIN</b> ${biz.gstin}<br>` : ''}
            ${biz.pan ? `<b>PAN</b> ${biz.pan}&nbsp;&nbsp;` : ''}${biz.udyam ? `<b>Udyam</b> ${biz.udyam}<br>` : ''}
            ${biz.contact ? biz.contact : ''}
          </div>
        </div>
        <div class="d-title ${isRV ? 'rv' : ''}">
          <span class="t">${isRV ? 'Receipt Voucher' : 'Tax Invoice'}</span>
          <div class="num">${r.no}</div>
          <div class="date">${fmtDate(r.dateISO)}</div>
        </div>
      </div>

      <div class="meta">
        <div class="blk">
          <div class="h">Billed to</div>
          <div class="nm">${r.customer.name || '—'}</div>
          ${r.customer.phone ? `<div class="ln mono">${r.customer.phone}</div>` : ''}
          ${r.customer.address ? `<div class="ln">${r.customer.address.replace(/\n/g, '<br>')}</div>` : ''}
          ${r.customer.gstin ? `<div class="ln mono">GSTIN ${r.customer.gstin}</div>` : ''}
        </div>
        <div class="blk right">
          <div class="h">Branch details</div>
          <div class="ln">Service centre: <b>${centre.name}</b></div>
          <div class="ln">${centre.address}</div>
          <div class="ln">Place of supply: ${placeOfSupply}</div>
          <div class="ln">Reverse charge: No</div>
        </div>
      </div>

      <table class="items">
        <thead><tr><th>Description</th><th>SAC</th>${noTax ? '' : `<th>Taxable</th>`}${taxCols}<th>Amount</th></tr></thead>
        <tbody><tr>
          <td><div class="it-desc">${r.service.name}${isRV ? ' — advance' : ''}</div><div class="it-sub">${descSub}</div></td>
          <td class="num-c">${r.service.sac}</td>
          ${noTax ? '' : `<td class="num-c">₹${money(r.taxable)}</td>`}
          ${taxCells}
          <td class="num-c">₹${money(r.total)}</td>
        </tr></tbody>
      </table>

      <div class="totals"><div class="box">
        ${totalsHTML}
        <div class="grand ${isRV ? 'rv' : ''}"><span class="lab">${grandLabel}</span><span class="v">₹${money(grandVal)}</span></div>
      </div></div>

      <div class="words"><div class="k">Amount in words</div><div class="v">${words}</div></div>

      ${r.payMode ? `<div class="payln"><span class="k">Payment mode</span> <b>${r.payMode}</b>${r.payRef ? ` &nbsp;·&nbsp; <span class="k">Ref</span> <span class="mono">${r.payRef}</span>` : ''}</div>` : ''}

      ${CM.ui.payQR({ label: isRV ? 'this advance' : 'this invoice' })}

      <div class="d-foot">
        <div class="note">${noteHTML}</div>
        ${CM.ui.signArea(r.signMode)}
      </div>
      ${(() => {
        const g = CM.ui.greenImpact(CM.store.list('documents').length);
        const num = (n, d = 0) => Number(n).toLocaleString('en-IN', { minimumFractionDigits: d, maximumFractionDigits: d });
        const trees = g.trees >= 1 ? num(g.trees, 1) : g.trees.toFixed(g.trees >= 0.01 ? 2 : 3);
        return `<div class="eco">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#059669" aria-hidden="true"><path d="M6.05 8.05c-2.73 2.73-2.73 7.15-.02 9.88 1.47-3.4 4.09-6.24 7.36-7.93-2.77 2.34-4.71 5.61-5.39 9.32 2.6 1.23 5.8.78 7.95-1.37C19.43 14.47 20 4 20 4S9.53 4.57 6.05 8.05z"/></svg>
          <span>${biz.name || 'CodeMetrix'} promotes green initiatives — please print only if necessary. By billing digitally we have avoided printing <b>${g.pages}</b> sheet(s) of paper so far, saving about <b>${num(g.water)} L</b> of water, <b>${num(g.energy, 2)} kWh</b> of electricity and <b>${trees}</b> trees, and preserving roughly <b>${num(g.oxygen)} L</b> of oxygen.</span>
        </div>`;
      })()}
      <div class="declare">Computer-generated document.${biz.gstin ? '' : ' ⚠ Set your GSTIN in Settings before issuing.'} E-invoice (IRN/QR) applies only if aggregate turnover exceeds ₹5 crore.</div>
    </div>`;
  }

  return { computeDoc, renderDoc };
})();
