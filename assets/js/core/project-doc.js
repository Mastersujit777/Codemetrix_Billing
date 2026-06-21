/* CodeMetrix — IT project document model + A4 renderer.
   Covers four business documents:
     QUO  Quotation        priced line items, validity, terms
     PROP Proposal         narrative: summary, approach, deliverables, timeline, investment
     SOW  Scope of Work    objectives, in/out of scope, deliverables, milestones, assumptions
     AGR  Agreement        intro + numbered clauses + dual signatures
   compute(input) -> normalized record;  render(record) -> A4 HTML string.
   Reuses the .doc / .meta / .items / .totals styling from the billing renderer. */
window.CM = window.CM || {};
CM.projectDoc = (function () {
  const { money, inWords, fmtDate, round2 } = CM.ui;

  const TYPES = {
    QUO:  { label: 'Quotation',     mod: 'quo'  },
    PROP: { label: 'Proposal',      mod: 'prop' },
    SOW:  { label: 'Scope of Work', mod: 'sow'  },
    AGR:  { label: 'Agreement',     mod: 'agr'  }
  };

  const br = s => (s == null ? '' : String(s)).replace(/\n/g, '<br>');

  /* ---- compute: only Quotation needs maths; the rest pass straight through ---- */
  function compute(input) {
    const biz = CM.store.business();
    const client = input.client || {};
    const inter = String(client.stateCode || '') !== String(biz.stateCode);
    const rec = Object.assign({}, input, { inter });

    if (input.type === 'QUO') {
      const items = (input.lineItems || [])
        .filter(it => (it.desc || '').trim() || +it.rate || +it.qty)
        .map(it => {
          const qty = +it.qty || 1, rate = +it.rate || 0;
          return Object.assign({}, it, { qty, rate, amount: round2(qty * rate) });
        });
      const subtotal = round2(items.reduce((t, i) => t + i.amount, 0));
      const discount = round2(+input.discount || 0);
      const base = round2(Math.max(subtotal - discount, 0));
      const rate = +input.gstRate || 0;
      const tax = round2(base * rate / 100);
      const sgst = round2(tax / 2), cgst = round2(tax - sgst);
      Object.assign(rec, {
        items, subtotal, discount, base, rate, tax,
        cgst: inter ? 0 : cgst, sgst: inter ? 0 : sgst, igst: inter ? tax : 0,
        grand: round2(base + tax)
      });
    }
    return rec;
  }

  /* ---- shared chrome ---- */
  function head(r, label, mod) {
    const biz = CM.store.business();
    return `<div class="d-head">
      <div class="d-co">
        <div class="d-logo">${CM.ui.logoFull()}</div>
        ${biz.tag ? `<div class="tag">${biz.tag}</div>` : ''}
        <div class="addr">${br(biz.address)}</div>
        <div class="d-ids">
          ${biz.gstin ? `<b>GSTIN</b> ${biz.gstin}<br>` : ''}
          ${biz.pan ? `<b>PAN</b> ${biz.pan}&nbsp;&nbsp;` : ''}${biz.udyam ? `<b>Udyam</b> ${biz.udyam}<br>` : ''}
          ${biz.contact ? biz.contact : ''}
        </div>
      </div>
      <div class="d-title ${mod}">
        <span class="t">${label}</span>
        <div class="num">${r.no || ''}</div>
        <div class="date">${fmtDate(r.dateISO)}</div>
      </div>
    </div>`;
  }

  function parties(r) {
    const biz = CM.store.business();
    const c = r.client || {};
    const centre = r.centreCode ? CM.store.centre(r.centreCode) : null;
    return `<div class="meta">
      <div class="blk">
        <div class="h">Prepared for</div>
        <div class="nm">${c.name || '—'}</div>
        ${c.contactPersonName ? `<div class="ln">Attn: ${c.contactPersonName}${c.contactPersonPhone ? ` · ${c.contactPersonPhone}` : ''}</div>` : ''}
        ${c.phone ? `<div class="ln mono">${c.phone}</div>` : ''}
        ${c.email ? `<div class="ln">${c.email}</div>` : ''}
        ${c.address ? `<div class="ln">${br(c.address)}</div>` : ''}
        ${c.gstin ? `<div class="ln mono">GSTIN ${c.gstin}</div>` : ''}
      </div>
      <div class="blk right">
        <div class="h">Prepared by</div>
        <div class="nm">${biz.name || 'CodeMetrix'}</div>
        ${centre ? `<div class="ln">${centre.name}</div>` : ''}
        ${biz.contact ? `<div class="ln">${biz.contact}</div>` : ''}
        ${r.validUntil ? `<div class="ln">Valid until <b>${fmtDate(r.validUntil)}</b></div>` : ''}
      </div>
    </div>`;
  }

  /* ---- small content helpers ---- */
  function para(t) { return (t || '').trim() ? `<div class="psec-b">${br(t)}</div>` : ''; }
  function section(h, inner) { return inner ? `<div class="psec"><div class="h">${h}</div>${inner}</div>` : ''; }

  function bullets(arr) {
    const items = (arr || []).map(x => typeof x === 'string' ? x : (x.text || '')).filter(s => (s || '').trim());
    return items.length ? `<ul class="plist">${items.map(t => `<li>${br(t)}</li>`).join('')}</ul>` : '';
  }
  function namedList(arr) {
    const items = (arr || []).filter(x => (x.name || '').trim() || (x.desc || '').trim());
    return items.length ? `<ul class="plist named">${items.map(x =>
      `<li><b>${x.name || ''}</b>${(x.desc || '').trim() ? ` — ${br(x.desc)}` : ''}</li>`).join('')}</ul>` : '';
  }
  function mileTable(arr) {
    const items = (arr || []).filter(x => (x.name || '').trim() || (x.when || '').trim());
    return items.length ? `<table class="items mile"><thead><tr><th>Milestone / phase</th><th>Timeline</th></tr></thead>
      <tbody>${items.map(x => `<tr><td>${x.name || ''}</td><td class="num-c">${x.when || ''}</td></tr>`).join('')}</tbody></table>` : '';
  }

  /* ---- per-type bodies ---- */
  function renderQUO(r) {
    const noTax = !(+r.rate > 0);
    const taxLines = noTax ? '' : (r.inter
      ? `<div class="tr"><span>IGST @ ${r.rate}%</span><span class="v">₹${money(r.igst)}</span></div>`
      : `<div class="tr"><span>CGST @ ${r.rate / 2}%</span><span class="v">₹${money(r.cgst)}</span></div>
         <div class="tr"><span>SGST @ ${r.rate / 2}%</span><span class="v">₹${money(r.sgst)}</span></div>`);
    const rows = (r.items || []).length
      ? r.items.map(it => `<tr>
          <td><div class="it-desc">${it.desc || ''}</div>${(it.detail || '').trim() ? `<div class="it-sub">${br(it.detail)}</div>` : ''}</td>
          <td class="num-c">${it.qty}</td>
          <td class="num-c">${it.unit || ''}</td>
          <td class="num-c">₹${money(it.rate)}</td>
          <td class="num-c">₹${money(it.amount)}</td>
        </tr>`).join('')
      : `<tr><td colspan="5" class="empty-row">No line items yet — add items in the panel.</td></tr>`;
    return `
      ${r.projectTitle ? `<div class="proj-title">${r.projectTitle}</div>` : ''}
      ${section('Summary', para(r.summary))}
      <table class="items quo"><thead><tr><th>Description</th><th>Qty</th><th>Unit</th><th>Rate</th><th>Amount</th></tr></thead>
        <tbody>${rows}</tbody></table>
      <div class="totals"><div class="box">
        <div class="tr"><span>Subtotal</span><span class="v">₹${money(r.subtotal)}</span></div>
        ${r.discount > 0 ? `<div class="tr adj"><span>Discount</span><span class="v">– ₹${money(r.discount)}</span></div>` : ''}
        ${noTax ? '' : `<div class="tr sep"><span>Taxable value</span><span class="v">₹${money(r.base)}</span></div>`}
        ${taxLines}
        <div class="grand"><span class="lab">Estimated total</span><span class="v">₹${money(r.grand)}</span></div>
      </div></div>
      <div class="words"><div class="k">Amount in words</div><div class="v">${inWords(r.grand)}</div></div>
      ${section('Terms &amp; notes', bullets(r.terms))}
      ${CM.ui.payQR({ label: 'this quotation' })}`;
  }

  function renderPROP(r) {
    const extra = (r.sections || [])
      .filter(s => (s.heading || '').trim() && (s.body || '').trim())
      .map(s => section(s.heading, para(s.body))).join('');
    const invest = (+r.investment > 0)
      ? section('Investment', `<div class="psec-b">${(r.investmentNote || '').trim() ? br(r.investmentNote) + '<br>' : ''}
          <span class="price">₹${money(r.investment)}</span>${(+r.gstRate > 0) ? ` <span class="muted">+ ${r.gstRate}% GST</span>` : ''}</div>`)
      : '';
    return `
      ${r.projectTitle ? `<div class="proj-title">${r.projectTitle}</div>` : ''}
      ${section('Executive summary', para(r.overview))}
      ${section('Objectives', bullets(r.objectives))}
      ${section('Proposed approach', para(r.approach))}
      ${section('Scope &amp; deliverables', namedList(r.deliverables))}
      ${section('Timeline', mileTable(r.timeline))}
      ${extra}
      ${invest}
      ${section('Terms', bullets(r.terms))}`;
  }

  function renderSOW(r) {
    const scopeBlock = ((r.inScope || []).length || (r.outScope || []).length)
      ? `<div class="psec"><div class="h">Scope</div><div class="pcols">
           <div><div class="ch in">In scope</div>${bullets(r.inScope) || '<div class="psec-b muted">—</div>'}</div>
           <div><div class="ch out">Out of scope</div>${bullets(r.outScope) || '<div class="psec-b muted">—</div>'}</div>
         </div></div>`
      : '';
    return `
      ${r.projectTitle ? `<div class="proj-title">${r.projectTitle}</div>` : ''}
      ${section('Background', para(r.overview))}
      ${section('Objectives', bullets(r.objectives))}
      ${scopeBlock}
      ${section('Deliverables', namedList(r.deliverables))}
      ${section('Milestones &amp; timeline', mileTable(r.milestones))}
      ${section('Assumptions &amp; dependencies', bullets(r.assumptions))}
      ${section('Acceptance criteria', para(r.acceptance))}
      ${(+r.investment > 0) ? section('Commercials', `<div class="psec-b"><span class="price">₹${money(r.investment)}</span>${(r.investmentNote || '').trim() ? ` — ${br(r.investmentNote)}` : ''}</div>`) : ''}`;
  }

  function renderAGR(r) {
    const biz = CM.store.business();
    const c = r.client || {};
    const clauses = (r.clauses || []).filter(x => (x.heading || '').trim() || (x.body || '').trim());
    const intro = `This Services Agreement ("Agreement") is made on <b>${fmtDate(r.dateISO)}</b> by and between
      <b>${biz.name || 'CodeMetrix'}</b>${biz.address ? `, ${biz.address.replace(/\n/g, ', ')}` : ''} (the "Service Provider"),
      and <b>${c.name || 'the Client'}</b>${c.address ? `, ${c.address.replace(/\n/g, ', ')}` : ''} (the "Client").
      ${r.projectTitle ? `This Agreement concerns <b>${r.projectTitle}</b>. ` : ''}The parties agree as follows:`;
    return `
      ${r.projectTitle ? `<div class="proj-title">${r.projectTitle}</div>` : ''}
      <div class="pintro">${intro}</div>
      <ol class="pclauses">${clauses.map(x =>
        `<li>${(x.heading || '').trim() ? `<span class="ch">${x.heading}.</span> ` : ''}${br(x.body)}</li>`).join('')}</ol>`;
  }

  const BODY = { QUO: renderQUO, PROP: renderPROP, SOW: renderSOW, AGR: renderAGR };

  function signSingle(r) {
    return `<div class="d-foot">
      <div class="note"><span class="nh">Note</span>This document is for discussion and planning. It does not by itself create a binding contract unless a separate signed agreement is executed.</div>
      ${CM.ui.signArea(r.signMode)}
    </div>`;
  }
  function signDual(r) {
    const biz = CM.store.business();
    const c = r.client || {};
    const exec = `<div class="agr-exec">In witness whereof, the parties have executed this Agreement as of the date first written above.</div>`;
    if (r.signMode === 'system') return exec + CM.ui.signArea('system', { wide: true });
    return `${exec}
      <div class="psign2">
        <div class="sb"><div class="line"></div><div class="for">For ${biz.name || 'CodeMetrix'}</div><div class="role">Authorised Signatory</div><div class="who">Name / Designation &amp; Date</div></div>
        <div class="sb"><div class="line"></div><div class="for">For ${c.name || 'Client'}</div><div class="role">Authorised Signatory</div><div class="who">Name / Designation &amp; Date</div></div>
      </div>`;
  }

  function render(rec) {
    const t = TYPES[rec.type] || TYPES.QUO;
    const body = (BODY[rec.type] || renderQUO)(rec);
    const sign = rec.type === 'AGR' ? signDual(rec) : signSingle(rec);
    const biz = CM.store.business();
    const year = new Date(rec.dateISO || Date.now()).getFullYear();
    return `<div class="doc proj ${t.mod}">
      ${head(rec, t.label, t.mod)}
      ${parties(rec)}
      ${body}
      ${sign}
      <div class="declare">Computer-generated ${t.label.toLowerCase()}.${biz.gstin ? '' : ' ⚠ Set your business details in Settings.'} © ${year} ${biz.name || 'CodeMetrix'}.</div>
    </div>`;
  }

  return { TYPES, compute, render };
})();
