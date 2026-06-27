"""Translation between the database rows and the single JSON "state" object
that the front-end (assets/js/core/store.js) reads and writes.

The state shape mirrors the old localStorage blob exactly:

    {
      "business": {...},
      "centres":  [...],
      "services": [...],
      "customers":[...],
      "documents":[...],     # full snapshot records
      "projectDocs":[...],   # full snapshot records
      "seq": {"<centre>:<type>:<fy>": <int>, ...}
    }
"""
from django.db import transaction

from .defaults import fresh_defaults
from .models import (
    Business, Centre, Service, Customer, Document, ProjectDoc, Sequence,
)


def _num(value):
    """Keep whole numbers as ints (so 18 serialises as 18, not 18.0)."""
    try:
        f = float(value)
    except (TypeError, ValueError):
        return value
    return int(f) if f.is_integer() else f


# ---------------------------------------------------------------------------
# DB  ->  JSON
# ---------------------------------------------------------------------------
def _business_to_json(b):
    out = {f: getattr(b, f) for f in Business.JSON_FIELDS}
    out.update(b.extra or {})
    return out


def _centre_to_json(c):
    out = {f: getattr(c, f) for f in Centre.JSON_FIELDS}
    out.update(c.extra or {})
    return out


def _service_to_json(s):
    out = {
        'id': s.sid,
        'name': s.name,
        'prefix': s.prefix,
        'sac': s.sac,
        'rate': _num(s.rate),
        'inclusive': s.inclusive,
    }
    out.update(s.extra or {})
    return out


def _customer_to_json(c):
    out = {'id': c.cid}
    out.update({f: getattr(c, f) for f in Customer.JSON_FIELDS})
    out.update(c.extra or {})
    return out


def serialize_state():
    """Build the full state dict from the database, seeding defaults if empty."""
    if _is_empty():
        seed_defaults()

    biz = Business.objects.first()
    return {
        'business': _business_to_json(biz) if biz else fresh_defaults()['business'],
        'centres': [_centre_to_json(c) for c in Centre.objects.all()],
        'services': [_service_to_json(s) for s in Service.objects.all()],
        'customers': [_customer_to_json(c) for c in Customer.objects.all()],
        'documents': [d.data for d in Document.objects.all()],
        'projectDocs': [d.data for d in ProjectDoc.objects.all()],
        'seq': {s.key: s.value for s in Sequence.objects.all()},
    }


# ---------------------------------------------------------------------------
# JSON  ->  DB
# ---------------------------------------------------------------------------
def _split_extra(record, known_keys):
    """Return (known dict, extra dict) for the given record."""
    known, extra = {}, {}
    for k, v in (record or {}).items():
        (known if k in known_keys else extra)[k] = v
    return known, extra


@transaction.atomic
def replace_state(state):
    """Replace the entire database contents with the posted state."""
    state = state or {}

    # --- business (singleton) ---
    Business.objects.all().delete()
    biz = state.get('business') or {}
    known, extra = _split_extra(biz, set(Business.JSON_FIELDS))
    Business.objects.create(extra=extra, **known)

    # --- centres ---
    Centre.objects.all().delete()
    centres = []
    for i, c in enumerate(state.get('centres') or []):
        known, extra = _split_extra(c, set(Centre.JSON_FIELDS))
        centres.append(Centre(position=i, extra=extra, **known))
    Centre.objects.bulk_create(centres)

    # --- services ---
    Service.objects.all().delete()
    services = []
    svc_known = {'name', 'prefix', 'sac', 'rate', 'inclusive'}
    for i, s in enumerate(state.get('services') or []):
        record = dict(s or {})
        sid = record.pop('id', '')
        known, extra = _split_extra(record, svc_known)
        known.setdefault('rate', 0)
        services.append(Service(position=i, sid=sid, extra=extra, **known))
    Service.objects.bulk_create(services)

    # --- customers ---
    Customer.objects.all().delete()
    customers = []
    for i, c in enumerate(state.get('customers') or []):
        record = dict(c or {})
        cid = record.pop('id', '')
        known, extra = _split_extra(record, set(Customer.JSON_FIELDS))
        customers.append(Customer(position=i, cid=cid, extra=extra, **known))
    Customer.objects.bulk_create(customers)

    # --- documents (snapshots) ---
    Document.objects.all().delete()
    docs = []
    for i, d in enumerate(state.get('documents') or []):
        docs.append(Document(
            position=i, doc_id=str(d.get('id', '')),
            number=str(d.get('no', '')), kind=str(d.get('type', '')),
            date_iso=str(d.get('dateISO', '')), data=d,
        ))
    Document.objects.bulk_create(docs)

    # --- project documents (snapshots) ---
    ProjectDoc.objects.all().delete()
    pdocs = []
    for i, d in enumerate(state.get('projectDocs') or []):
        pdocs.append(ProjectDoc(
            position=i, doc_id=str(d.get('id', '')),
            number=str(d.get('no', '')), kind=str(d.get('type', '')),
            date_iso=str(d.get('dateISO', '')), data=d,
        ))
    ProjectDoc.objects.bulk_create(pdocs)

    # --- sequence counters ---
    Sequence.objects.all().delete()
    seqs = [Sequence(key=k, value=int(v or 0))
            for k, v in (state.get('seq') or {}).items()]
    Sequence.objects.bulk_create(seqs)


# ---------------------------------------------------------------------------
# seeding
# ---------------------------------------------------------------------------
def _is_empty():
    return not (
        Business.objects.exists()
        or Centre.objects.exists()
        or Service.objects.exists()
        or Customer.objects.exists()
        or Document.objects.exists()
        or ProjectDoc.objects.exists()
    )


def seed_defaults(force=False):
    """Write the default seed data if the database is empty."""
    if force or _is_empty():
        replace_state(fresh_defaults())
        return True
    return False
