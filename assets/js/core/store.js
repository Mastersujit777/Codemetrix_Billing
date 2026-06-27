/* CodeMetrix Billing — data layer.
   Previously persisted to localStorage; now persists to the Django backend
   (PostgreSQL) via a single /api/state endpoint. The in-memory `db` object and
   the public CM.store API are unchanged, so every page behaves exactly as
   before — only where the data lives has changed. */
window.CM = window.CM || {};
CM.store = (function () {
  const API = '/api/state/';

  /* Kept as a fallback so the app still works in-memory if the backend is
     unreachable — same seed data the old localStorage build started from. */
  const DEFAULTS = {
    business: {
      name: 'CodeMetrix',
      tag: 'Proprietorship · IT Training, Internships & Software Development',
      address: 'Kesura, Bhubaneswar, Khordha, Odisha – 752057',
      gstin: '', pan: '', udyam: '',
      stateName: 'Odisha', stateCode: '21',
      contact: '',
      upiId: 'codemetrix1@ucobank', // prints on bills & quotations
      upiQr: '',                     // data-URL of the UPI QR image (set in Settings)
      bankName: 'UCO Bank',          // NEFT / bank-transfer details
      bankAccName: 'Codemetrix',
      bankAccNo: '25430210003343',
      bankIfsc: 'UCBA0002543'
    },
    centres: [
      { code: 'BAL', name: 'Balipatna', address: 'Balipatna, Khordha, Odisha' },
      { code: 'KES', name: 'Kesura–Bhubaneswar', address: 'Kesura, Bhubaneswar, Odisha' }
    ],
    services: [
      { id: 'svc_int', name: 'Internship Programme', prefix: 'INT', sac: '999293', rate: 18, inclusive: true },
      { id: 'svc_trn', name: 'Training Programme', prefix: 'TRN', sac: '999293', rate: 18, inclusive: true },
      { id: 'svc_sw', name: 'Software Development', prefix: 'SWD', sac: '998314', rate: 18, inclusive: false }
    ],
    customers: [
      { id: 'cus_demo', name: 'Demo Student', kind: 'student', username: 'demo_student',
        address: '', stateName: 'Odisha', stateCode: '21', gstin: '',
        phone: '9000000000', email: '', contactPersonName: '', contactPersonPhone: '', notes: '' }
    ],
    documents: [],
    projectDocs: [], // quotations, proposals, scopes of work, agreements
    seq: {} // `${centre}:${type}:${fy}` -> last consumed number
  };

  /* read a cookie value (used for the Django CSRF token) */
  function cookie(name) {
    const m = document.cookie.match('(?:^|; )' + name + '=([^;]*)');
    return m ? decodeURIComponent(m[1]) : '';
  }

  /* Synchronous request to the backend. Keeping it synchronous preserves the
     original localStorage semantics (load before pages run; writes complete
     before the next read), so no page code needed to change. */
  function apiRequest(method, body) {
    const xhr = new XMLHttpRequest();
    xhr.open(method, API, false);
    if (body != null) {
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.setRequestHeader('X-CSRFToken', cookie('csrftoken')); // Django CSRF
    }
    xhr.send(body != null ? body : null);
    if (xhr.status < 200 || xhr.status >= 300) throw new Error('HTTP ' + xhr.status);
    return xhr.responseText;
  }

  function load() {
    let raw = null;
    try { raw = JSON.parse(apiRequest('GET')); } catch (e) { /* backend unavailable */ }
    const base = JSON.parse(JSON.stringify(DEFAULTS));
    if (raw && typeof raw === 'object') {
      for (const k in base) if (raw[k] !== undefined) base[k] = raw[k];
    }
    return base;
  }

  let db = load();
  function save() {
    try { apiRequest('POST', JSON.stringify(db)); }
    catch (e) { console.error('CodeMetrix: failed to save to server', e); }
  }
  function get() { return db; }
  function id(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 8); }

  /* generic collection helpers (collections: services, customers, documents) */
  function list(coll) { return db[coll] || []; }
  function find(coll, recId) { return (db[coll] || []).find(r => r.id === recId); }
  function upsert(coll, obj) {
    if (!obj.id) obj.id = id(coll.slice(0, 3));
    const arr = db[coll];
    const i = arr.findIndex(r => r.id === obj.id);
    if (i >= 0) arr[i] = obj; else arr.push(obj);
    save(); return obj;
  }
  function remove(coll, recId) {
    db[coll] = db[coll].filter(r => r.id !== recId); save();
  }

  /* business + centres */
  function business() { return db.business; }
  function setBusiness(b) { db.business = b; save(); }
  function centres() { return db.centres; }
  function setCentres(c) { db.centres = c; save(); }
  function centre(code) { return db.centres.find(c => c.code === code); }

  /* sequence numbers per centre + type + financial year */
  function seqKey(centreCode, type, fy) { return `${centreCode}:${type}:${fy}`; }
  function peekSeq(centreCode, type, fy) { return (db.seq[seqKey(centreCode, type, fy)] || 0) + 1; }
  function consumeSeq(centreCode, type, fy, n) {
    const k = seqKey(centreCode, type, fy);
    db.seq[k] = Math.max(db.seq[k] || 0, n);
    save(); return db.seq[k];
  }

  /* backup / restore */
  function exportJSON() { return JSON.stringify(db, null, 2); }
  function importJSON(str) {
    const parsed = JSON.parse(str);
    db = parsed; save(); return true;
  }
  function reset() { db = JSON.parse(JSON.stringify(DEFAULTS)); save(); }

  return {
    get, save, id, list, find, upsert, remove,
    business, setBusiness, centres, setCentres, centre,
    peekSeq, consumeSeq, exportJSON, importJSON, reset
  };
})();
