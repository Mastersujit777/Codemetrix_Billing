"""Seed data — an exact mirror of the DEFAULTS object in assets/js/core/store.js.

When the database is empty this is written in, so a fresh install behaves
identically to the old localStorage app on first run.
"""
import copy

DEFAULTS = {
    "business": {
        "name": "CodeMetrix",
        "tag": "Proprietorship · IT Training, Internships & Software Development",
        "address": "Kesura, Bhubaneswar, Khordha, Odisha – 752057",
        "gstin": "", "pan": "", "udyam": "",
        "stateName": "Odisha", "stateCode": "21",
        "contact": "",
        "upiId": "codemetrix1@ucobank",
        "upiQr": "",
        "bankName": "UCO Bank",
        "bankAccName": "Codemetrix",
        "bankAccNo": "25430210003343",
        "bankIfsc": "UCBA0002543",
    },
    "centres": [
        {"code": "BAL", "name": "Balipatna", "address": "Balipatna, Khordha, Odisha"},
        {"code": "KES", "name": "Kesura–Bhubaneswar", "address": "Kesura, Bhubaneswar, Odisha"},
    ],
    "services": [
        {"id": "svc_int", "name": "Internship Programme", "prefix": "INT", "sac": "999293", "rate": 18, "inclusive": True},
        {"id": "svc_trn", "name": "Training Programme", "prefix": "TRN", "sac": "999293", "rate": 18, "inclusive": True},
        {"id": "svc_sw", "name": "Software Development", "prefix": "SWD", "sac": "998314", "rate": 18, "inclusive": False},
    ],
    "customers": [
        {"id": "cus_demo", "name": "Demo Student", "kind": "student", "username": "demo_student",
         "address": "", "stateName": "Odisha", "stateCode": "21", "gstin": "",
         "phone": "9000000000", "email": "", "contactPersonName": "", "contactPersonPhone": "", "notes": ""},
    ],
    "documents": [],
    "projectDocs": [],
    "seq": {},
}


def fresh_defaults():
    """A deep copy so callers can mutate freely."""
    return copy.deepcopy(DEFAULTS)
