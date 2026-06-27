/* CodeMetrix Billing — shared UI + finance helpers */
window.CM = window.CM || {};
CM.ui = (function () {

  const STATES = [
    ['Andhra Pradesh','37'],['Arunachal Pradesh','12'],['Assam','18'],['Bihar','10'],
    ['Chhattisgarh','22'],['Delhi','07'],['Goa','30'],['Gujarat','24'],['Haryana','06'],
    ['Himachal Pradesh','02'],['Jharkhand','20'],['Karnataka','29'],['Kerala','32'],
    ['Madhya Pradesh','23'],['Maharashtra','27'],['Manipur','14'],['Meghalaya','17'],
    ['Mizoram','15'],['Nagaland','13'],['Odisha','21'],['Punjab','03'],['Rajasthan','08'],
    ['Sikkim','11'],['Tamil Nadu','33'],['Telangana','36'],['Tripura','16'],
    ['Uttar Pradesh','09'],['Uttarakhand','05'],['West Bengal','19'],
    ['Andaman & Nicobar','35'],['Chandigarh','04'],['Jammu & Kashmir','01'],
    ['Ladakh','38'],['Puducherry','34']
  ];

  const round2 = n => Math.round((+n || 0) * 100) / 100;
  const money = n => Number(n || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  function fyFromDate(d) {
    d = d ? new Date(d) : new Date();
    let y = d.getFullYear(); const m = d.getMonth(); // Jan=0
    const start = m >= 3 ? y : y - 1;          // FY starts in April
    return String(start).slice(2) + '-' + String(start + 1).slice(2);
  }

  function fmtDate(d) {
    d = d ? new Date(d) : new Date();
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  /* GST split. rate is %, inclusive bool, inter bool (inter-state => IGST) */
  function splitTax(amount, rate, inclusive, inter) {
    amount = +amount || 0; const r = (+rate || 0) / 100;
    let taxable, tax;
    if (inclusive) { taxable = round2(amount / (1 + r)); tax = round2(amount - taxable); }
    else { taxable = round2(amount); tax = round2(amount * r); }
    const total = round2(taxable + tax);
    if (inter) return { taxable, cgst: 0, sgst: 0, igst: tax, total };
    const sgst = round2(tax / 2), cgst = round2(tax - sgst);
    return { taxable, cgst, sgst, igst: 0, total };
  }

  function inWords(num) {
    num = round2(num); const r = Math.floor(num), p = Math.round((num - r) * 100);
    const a = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const two = n => n < 20 ? a[n] : b[Math.floor(n / 10)] + (n % 10 ? ' ' + a[n % 10] : '');
    const three = n => (Math.floor(n / 100) ? a[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' : '') : '') + (n % 100 ? two(n % 100) : '');
    function conv(n) {
      if (n === 0) return 'Zero'; let s = '';
      s += Math.floor(n / 10000000) ? conv(Math.floor(n / 10000000)) + ' Crore ' : ''; n %= 10000000;
      s += Math.floor(n / 100000) ? three(Math.floor(n / 100000)) + ' Lakh ' : ''; n %= 100000;
      s += Math.floor(n / 1000) ? three(Math.floor(n / 1000)) + ' Thousand ' : ''; n %= 1000;
      s += n ? three(n) : ''; return s.trim();
    }
    let w = conv(r) + ' Rupees';
    if (p) w += ' and ' + conv(p) + ' Paise';
    return w + ' Only';
  }

  /* CodeMetrix logo — uses the raster PNG in assets/img/ (single place to swap) */
  const LOGO_SRC = 'assets/img/Codemetrix-Horizontal-logo.png';
  function logoMark(cls) {
    return `<img class="${cls || ''}" src="${LOGO_SRC}" alt="CodeMetrix">`;
  }
  function logoFull(cls) {
    return `<img class="${cls || 'cm-logo'}" src="${LOGO_SRC}" alt="CodeMetrix">`;
  }

  /* top navigation — Bootstrap navbar markup, injected into #nav on each page */
  function nav(active) {
    const links = [
      ['dashboard.html', 'Dashboard', 'fa-chart-line'],
      ['index.html', 'Billing', 'fa-file-invoice-dollar'],
      ['customers.html', 'Customers', 'fa-users'],
      ['project.html', 'Projects', 'fa-file-signature'],
      ['services.html', 'Services', 'fa-list-check'],
      ['documents.html', 'Register', 'fa-book'],
      ['settings.html', 'Settings', 'fa-gear']
    ];
    const co = CM.store.business();
    const el = document.getElementById('nav');
    if (!el) return;
    el.className = 'cm-navbar';
    el.innerHTML = `
      <div class="nav-in">
        <a class="brand" href="index.html"><span class="brand-logo">${logoMark()}</span><small>Billing</small></a>
        <nav class="cm-links">${links.map(([h, t, icon]) =>
          `<a href="${h}" class="${h === active ? 'active' : ''}"><i class="fa-solid ${icon}"></i>${t}</a>`).join('')}<a href="/logout/" class="nav-logout" title="Sign out"><i class="fa-solid fa-right-from-bracket"></i>Logout</a></nav>
      </div>`;
  }

  /* toast — Bootstrap Toast shown bottom-centre */
  function toast(msg, kind = 'ok') {
    let host = document.querySelector('.cm-toast-container');
    if (!host) { host = document.createElement('div'); host.className = 'cm-toast-container'; document.body.appendChild(host); }
    const icon = kind === 'err' ? 'fa-circle-exclamation' : 'fa-circle-check';
    const t = document.createElement('div');
    t.className = 'cm-toast toast' + (kind === 'err' ? ' err' : '');
    t.setAttribute('role', 'status');
    t.innerHTML = `<i class="fa-solid ${icon}"></i><span>${msg}</span>`;
    host.appendChild(t);
    const inst = bootstrap.Toast.getOrCreateInstance(t, { delay: 2600 });
    t.addEventListener('hidden.bs.toast', () => t.remove());
    inst.show();
  }

  /* modal: Bootstrap modal. Returns the modal root element so callers can wire
     buttons via m.querySelector('#id'). Footer buttons with [data-close] dismiss it.
     opts: { size: 'lg'|'xl', scrollable: true } */
  function modal(title, innerHTML, footerHTML, opts = {}) {
    closeModal();
    const size = opts.size ? ' modal-' + opts.size : '';
    const scrollable = opts.scrollable ? ' modal-dialog-scrollable' : '';
    const wrap = document.createElement('div');
    wrap.className = 'modal fade'; wrap.id = 'modal'; wrap.tabIndex = -1;
    wrap.innerHTML = `<div class="modal-dialog modal-dialog-centered${size}${scrollable}">
        <div class="modal-content">
          <div class="modal-header">
            <h3 class="modal-title">${title}</h3>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">${innerHTML}</div>
          <div class="modal-footer">${footerHTML || ''}</div>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    const inst = new bootstrap.Modal(wrap);
    wrap._cm = inst;
    wrap.querySelectorAll('[data-close]').forEach(b => b.addEventListener('click', () => inst.hide()));
    wrap.addEventListener('hidden.bs.modal', () => wrap.remove());
    inst.show();
    return wrap;
  }
  function closeModal() {
    const m = document.getElementById('modal');
    if (!m) return;
    if (m._cm) m._cm.hide(); else m.remove();
  }

  function stateOptions(selectedCode) {
    return STATES.map(([n, c]) =>
      `<option value="${n}|${c}" ${c === selectedCode ? 'selected' : ''}>${n}</option>`).join('');
  }

  /* Payment block printed on bills & quotations — the UPI QR / ID and the bank
     (NEFT) details from the business profile. Returns '' when nothing is set.
     opts.label personalises the sub-line (e.g. "this invoice"). */
  function payQR(opts = {}) {
    const biz = CM.store.business();
    const id = (biz.upiId || '').trim(), qr = biz.upiQr || '';
    const hasBank = (biz.bankAccNo || '').trim() || (biz.bankName || '').trim();
    if (!id && !qr && !hasBank) return '';

    const upi = (id || qr) ? `<div class="pq-info">
        <div class="pq-h"><i class="fa-solid fa-indian-rupee-sign"></i> Scan &amp; pay via UPI</div>
        <div class="pq-sub">Pay${opts.label ? ` for ${opts.label}` : ''} using any BHIM / UPI app — Google Pay, PhonePe, Paytm, etc.</div>
        ${id ? `<div class="pq-id"><span class="k">UPI ID</span> <span class="mono">${id}</span></div>` : ''}
      </div>` : '';

    const bank = hasBank ? `<div class="pq-bank">
        <div class="pq-h"><i class="fa-solid fa-building-columns"></i> Bank transfer / NEFT</div>
        ${biz.bankName ? `<div class="bk"><span class="k">Bank</span> <span>${biz.bankName}</span></div>` : ''}
        ${biz.bankAccName ? `<div class="bk"><span class="k">A/c name</span> <span>${biz.bankAccName}</span></div>` : ''}
        ${biz.bankAccNo ? `<div class="bk"><span class="k">A/c no.</span> <span class="mono">${biz.bankAccNo}</span></div>` : ''}
        ${biz.bankIfsc ? `<div class="bk"><span class="k">IFSC</span> <span class="mono">${biz.bankIfsc}</span></div>` : ''}
      </div>` : '';

    return `<div class="paybox">
      ${qr ? `<img class="pq" src="${qr}" alt="UPI QR — scan to pay">` : ''}
      ${upi}${bank}
    </div>`;
  }

  /* Signature area for a document. mode 'system' prints a no-signature notice;
     anything else (default) prints a signature space. opts.for / opts.role
     customise the label; opts.wide stretches the system notice full-width. */
  const SYSGEN_TEXT = 'This is a system-generated document and does not require a signature.';
  function signArea(mode, opts = {}) {
    if (mode === 'system') {
      return `<div class="sysgen${opts.wide ? ' wide' : ''}"><i class="fa-solid fa-circle-check"></i> ${SYSGEN_TEXT}</div>`;
    }
    const biz = CM.store.business();
    return `<div class="sign"><div class="line"></div><div class="for">For ${opts.for || biz.name || 'CodeMetrix'}</div><div class="role">${opts.role || 'Authorised Signatory'}</div></div>`;
  }

  /* total GST on a document (CGST + SGST + IGST) */
  function taxOf(d) { return round2((d.cgst || 0) + (d.sgst || 0) + (d.igst || 0)); }

  /* documents belonging to a customer record — matched on name and/or enrollment ref
     (saved documents store a snapshot of the customer, not its id) */
  function docsForCustomer(c) {
    return CM.store.list('documents')
      .filter(d => {
        const dc = d.customer || {};
        return (c.username && dc.username === c.username) || (c.phone && dc.phone === c.phone) || dc.name === c.name;
      })
      .sort((a, b) => new Date(b.dateISO) - new Date(a.dateISO));
  }

  /* roll a customer's documents into received / invoiced / balance figures */
  function customerFinance(c) {
    const docs = docsForCustomer(c);
    let received = 0, invoicedTotal = 0, invoicedNet = 0, tax = 0;
    docs.forEach(d => {
      tax += taxOf(d);
      if (d.type === 'RV') received += d.total || 0;
      else { invoicedTotal += d.total || 0; invoicedNet += d.net || 0; }
    });
    received = round2(received); invoicedTotal = round2(invoicedTotal);
    invoicedNet = round2(invoicedNet); tax = round2(tax);
    const fee = +c.fee || 0;
    const hasInvoice = docs.some(d => d.type === 'INV');
    const balance = hasInvoice ? round2(invoicedNet) : round2(Math.max(fee - received, 0));
    return { docs, received, invoicedTotal, invoicedNet, tax, fee, hasInvoice, balance };
  }

  /* Environmental impact of NOT printing.  Per A4 sheet (≈5 g), widely-cited estimates:
     ~10 L water, ~0.05 kWh energy, ~4.6 g CO2; ~8,333 sheets per tree; a tree yields
     ~8.4 L oxygen/yr per sheet's share. These are approximations for awareness only. */
  const PER_SHEET = { water: 10, energy: 0.05, tree: 1 / 8333, oxygen: 8.4, co2: 0.0046 };
  function greenImpact(pages) {
    pages = +pages || 0;
    return {
      pages,
      water: round2(pages * PER_SHEET.water),
      energy: round2(pages * PER_SHEET.energy),
      trees: pages * PER_SHEET.tree,
      oxygen: round2(pages * PER_SHEET.oxygen),
      co2: round2(pages * PER_SHEET.co2)
    };
  }

  return {
    STATES, round2, money, fyFromDate, fmtDate, splitTax, inWords,
    nav, toast, modal, closeModal, stateOptions, payQR, signArea,
    taxOf, docsForCustomer, customerFinance, logoMark, logoFull, greenImpact
  };
})();
