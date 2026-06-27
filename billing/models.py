"""Relational schema for the CodeMetrix Billing data.

The collections that are live, editable entities (business profile, service
centres, services, customers) get typed columns. Documents and project
documents are immutable *snapshots* in the front-end (a saved invoice keeps the
customer/business details as they were at issue time), so they are stored
faithfully as JSON — that is the correct domain model, not a shortcut.

Every typed model also carries an ``extra`` JSON column so that any unexpected
keys (e.g. from a restored backup) round-trip losslessly — guaranteeing the
front-end sees exactly what it stored.
"""
from django.db import models


class Business(models.Model):
    """Singleton business profile (one row)."""
    name = models.CharField(max_length=255, blank=True, default='')
    tag = models.TextField(blank=True, default='')
    address = models.TextField(blank=True, default='')
    gstin = models.CharField(max_length=32, blank=True, default='')
    pan = models.CharField(max_length=32, blank=True, default='')
    udyam = models.CharField(max_length=64, blank=True, default='')
    stateName = models.CharField(max_length=64, blank=True, default='')
    stateCode = models.CharField(max_length=8, blank=True, default='')
    contact = models.TextField(blank=True, default='')
    upiId = models.CharField(max_length=128, blank=True, default='')
    upiQr = models.TextField(blank=True, default='')          # base64 data-URL
    bankName = models.CharField(max_length=128, blank=True, default='')
    bankAccName = models.CharField(max_length=128, blank=True, default='')
    bankAccNo = models.CharField(max_length=64, blank=True, default='')
    bankIfsc = models.CharField(max_length=32, blank=True, default='')
    extra = models.JSONField(default=dict, blank=True)

    JSON_FIELDS = [
        'name', 'tag', 'address', 'gstin', 'pan', 'udyam', 'stateName',
        'stateCode', 'contact', 'upiId', 'upiQr', 'bankName', 'bankAccName',
        'bankAccNo', 'bankIfsc',
    ]


class Centre(models.Model):
    position = models.IntegerField(default=0)
    code = models.CharField(max_length=16, blank=True, default='')
    name = models.CharField(max_length=255, blank=True, default='')
    address = models.TextField(blank=True, default='')
    extra = models.JSONField(default=dict, blank=True)

    JSON_FIELDS = ['code', 'name', 'address']

    class Meta:
        ordering = ['position', 'id']


class Service(models.Model):
    position = models.IntegerField(default=0)
    sid = models.CharField(max_length=64, blank=True, default='')   # front-end "id"
    name = models.CharField(max_length=255, blank=True, default='')
    prefix = models.CharField(max_length=16, blank=True, default='')
    sac = models.CharField(max_length=32, blank=True, default='')
    rate = models.FloatField(default=0)
    inclusive = models.BooleanField(default=False)
    extra = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ['position', 'id']


class Customer(models.Model):
    position = models.IntegerField(default=0)
    cid = models.CharField(max_length=64, blank=True, default='')   # front-end "id"
    name = models.CharField(max_length=255, blank=True, default='')
    kind = models.CharField(max_length=32, blank=True, default='')
    username = models.CharField(max_length=128, blank=True, default='')
    address = models.TextField(blank=True, default='')
    stateName = models.CharField(max_length=64, blank=True, default='')
    stateCode = models.CharField(max_length=8, blank=True, default='')
    gstin = models.CharField(max_length=32, blank=True, default='')
    phone = models.CharField(max_length=32, blank=True, default='')
    email = models.CharField(max_length=255, blank=True, default='')
    contactPersonName = models.CharField(max_length=255, blank=True, default='')
    contactPersonPhone = models.CharField(max_length=32, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    extra = models.JSONField(default=dict, blank=True)

    JSON_FIELDS = [
        'name', 'kind', 'username', 'address', 'stateName', 'stateCode',
        'gstin', 'phone', 'email', 'contactPersonName', 'contactPersonPhone',
        'notes',
    ]

    class Meta:
        ordering = ['position', 'id']


class Document(models.Model):
    """A saved GST bill (receipt voucher / tax invoice) — stored as a snapshot."""
    position = models.IntegerField(default=0)
    doc_id = models.CharField(max_length=64, db_index=True)   # record.id
    number = models.CharField(max_length=128, blank=True, default='')   # record.no
    kind = models.CharField(max_length=16, blank=True, default='')      # record.type
    date_iso = models.CharField(max_length=64, blank=True, default='')
    data = models.JSONField()

    class Meta:
        ordering = ['position', 'id']


class ProjectDoc(models.Model):
    """A saved project document (quotation / proposal / SoW / agreement)."""
    position = models.IntegerField(default=0)
    doc_id = models.CharField(max_length=64, db_index=True)
    number = models.CharField(max_length=128, blank=True, default='')
    kind = models.CharField(max_length=16, blank=True, default='')
    date_iso = models.CharField(max_length=64, blank=True, default='')
    data = models.JSONField()

    class Meta:
        ordering = ['position', 'id']


class Sequence(models.Model):
    """Document-number counters, keyed "<centre>:<type>:<fy>"."""
    key = models.CharField(max_length=128, unique=True)
    value = models.IntegerField(default=0)
