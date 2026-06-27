# CodeMetrix Billing

A self-contained, static GST billing app for CodeMetrix — generate **receipt vouchers** (for advances/installments) and **tax invoices** (on completion, adjusting advances), with customers, services, and an issued-document register all managed in one place. No backend, no build step.

## Running it (Django + PostgreSQL)

Data is now persisted in **PostgreSQL** through a thin Django backend instead of the browser's `localStorage`. The entire front-end (HTML, GST maths, numbering, rendering, printing) is unchanged — only the storage layer in `assets/js/core/store.js` was swapped to talk to a `/api/state/` endpoint.

**One-time setup:**
```bash
# 1. create the database in PostgreSQL (if not already done)
#    e.g.  createdb codemetrix_billing

# 2. create a virtualenv and install dependencies
python -m venv .venv
.venv\Scripts\activate            # Windows
# source .venv/bin/activate       # macOS / Linux
pip install -r requirements.txt

# 3. configure the DB connection in .env (already present for local dev):
#    DB_NAME / DB_USER / DB_PASSWORD / DB_HOST / DB_PORT

# 4. create the tables and seed the default data
python manage.py migrate
python manage.py seed              # writes default business/centres/services/customer

# 5. create the login account
python manage.py createlogin       # default: admin / codemetrix (change it!)
```

### Authentication

The app is gated behind a login. Every page and the `/api/state/` API require an
authenticated session; visiting any page while logged out redirects to `/login/`
and back once you sign in. A **Logout** link sits at the end of the top nav.

The default account is **`admin` / `codemetrix`** — change it immediately:

```bash
python manage.py createlogin --username admin --password "your-strong-password"
# (re-running createlogin on an existing username just resets the password)
```

There is no public sign-up; accounts are created from the command line. All
logins share the same single business dataset.

**Run the app:**
```bash
python manage.py runserver
# open http://127.0.0.1:8000
```

Database connection settings come from `.env` (see `config/settings.py`). The seed data matches the old first-run defaults; if the database is empty, the first request seeds it automatically. `python manage.py seed --force` re-seeds from scratch.

### Team workflow — sharing data via Git (one user at a time)

When the app isn't on a server and is used by a few people **one at a time**, the
database is passed between them through Git as a SQL snapshot at
`db/snapshot.sql` (a `pg_dump`, tracked in the repo). It carries the full
database — billing data **and** the shared login accounts.

**One-time setup per machine:** install PostgreSQL **17** (the snapshot must be
restored with a matching major version), create the venv + `.env` as above. You
don't need to `seed` — you'll restore the shared snapshot instead.

**Each session — pass the baton (pull → work → push).** The two `.bat` files in
the project root wrap the whole routine; just double-click them:

- **`pull-load.bat`** (at the **start**) — runs `git pull`, then restores
  `db/snapshot.sql` into your local database and applies migrations.
- **`save-commit-push.bat`** (when you **finish**) — saves your local database to
  `db/snapshot.sql`, then `git add` + `git commit` (the message is stamped with
  the current date-time, e.g. `db snapshot: 2026-06-27 13:08:01`, so the last DB
  commit is easy to spot) + `git push`.

Equivalent manual commands if you prefer the terminal:
```bash
git pull                                   # get latest code + db/snapshot.sql
powershell -ExecutionPolicy Bypass -File scripts\db-load.ps1    # restore snapshot + migrate
#   ... use the app ...
powershell -ExecutionPolicy Bypass -File scripts\db-save.ps1    # write db/snapshot.sql
git add db/snapshot.sql
git commit -m "db snapshot: <date time>"
git push
```

Both scripts read credentials from `.env` and auto-locate `pg_dump`/`psql` under
`C:\Program Files\PostgreSQL\*\bin`. `db-load.ps1` **replaces** your local data
with the snapshot, so only run it at the start of your turn.

**Rules that keep this safe (the snapshot can't be auto-merged):**
- Strictly take turns: always `git pull` + `db-load` *before* working, and
  `db-save` + `git push` *after*. Don't start until the previous person has pushed.
- Agree on an explicit hand-off signal ("pushed — you're up").
- If two people ever diverge, Git can't merge two snapshots; one set of changes
  must be redone by hand. The turn-taking discipline above prevents this.

`.gitattributes` pins `db/snapshot.sql` to LF so Windows line-ending conversion
can't corrupt it; `.gitignore` tracks that one file while ignoring all other
ad-hoc dumps (`backups/`, `*.dump`, `*.sql`).

**Backend layout**
```
manage.py                 Django entry point
config/                   project settings + URL routing
  settings.py             DB config (reads .env), middleware
  urls.py                 /api/state/, /assets/*, and the .html pages
billing/                  the app
  models.py               Business / Centre / Service / Customer (typed columns)
                          + Document / ProjectDoc (JSON snapshots) + Sequence
  state.py                DB <-> JSON state translation (mirrors store.js shape)
  views.py                GET/POST /api/state/  +  serves the front-end pages
  defaults.py             seed data (mirror of store.js DEFAULTS)
  management/commands/seed.py
```

Documents and project documents are stored as JSON snapshots because the front-end deliberately freezes the customer/business details onto each saved bill at issue time — so an edit to a customer never alters a previously issued invoice.

To deploy for real, point `.env` at your production PostgreSQL, set `DJANGO_DEBUG=0`, a real `DJANGO_SECRET_KEY`, and serve via a WSGI server (gunicorn/uwsgi) behind nginx.

## First-time setup

1. Open **Settings** → fill in GSTIN, PAN, Udyam number and confirm the registered address and home state. These print on every document; the app flags documents until GSTIN is set.
2. Check **Settings → Service centres**. The centre *code* (BAL, KES) becomes the invoice-number prefix. Declare each centre as an *additional place of business* on your GST registration.
3. Add your students/clients on **Customers**, and confirm **Services** (Internship / Training → SAC 999293, Software Development → SAC 998314, all 18%).
4. (Optional) In **Settings → Payment details**, set your UPI ID, upload your BHIM/UPI QR image, and enter your bank (NEFT) details. They print together in a payment panel on every bill and quotation. The QR image is stored in the browser and included in backups.

## Tech stack

Static HTML + vanilla JS, styled with **Bootstrap 5** and **Font Awesome 6** (both vendored locally under `assets/vendor/`, so the app works fully offline) plus a custom brand layer authored in **SCSS** (`src/scss/`) and compiled to `assets/css/main.css`.

### Styling / SCSS

All custom styling lives in modular SCSS partials under `src/scss/`, driven by design tokens in `abstracts/_variables.scss` (also emitted as CSS custom properties so inline styles and the JS renderer keep working). The compiled `assets/css/main.css` is committed, so **no build step is needed to run the app**. If you change the SCSS, recompile:

```bash
# one-off
sass src/scss/main.scss assets/css/main.css
# or watch while editing
sass --watch src/scss/main.scss:assets/css/main.css
```

Load order matters: `bootstrap.min.css` → `fontawesome/all.min.css` → `main.css` (the brand layer loads last so it wins at single-class specificity).

## Folder structure

```
codemetrix-billing/
├── templates/          front-end pages, served by Django (URLs unchanged)
│   ├── index.html          Billing — generate RV / Tax Invoice (live A4 preview)
│   ├── dashboard.html      Receipts / invoices / GST overview, filterable by date
│   ├── customers.html      Manage students & clients (search + per-customer ledger)
│   ├── project.html        Project documents hub (quotation / proposal / SoW / agreement)
│   ├── quotation.html      Quotation generator (line items, GST, validity)
│   ├── proposal.html       Proposal generator (summary, approach, timeline, investment)
│   ├── scope.html          Scope of Work generator (objectives, in/out scope, milestones)
│   ├── agreement.html      Service Agreement generator (clauses + dual signatures)
│   ├── services.html       Manage services, SAC codes, GST rates
│   ├── documents.html      Register of every issued document + CSV export
│   └── settings.html       Business profile, centres, data backup
├── assets/
│   ├── css/
│   │   └── main.css        compiled stylesheet (generated from src/scss/)
│   ├── js/
│   │   ├── core/
│   │   │   ├── store.js        localStorage data layer (single source of truth)
│   │   │   ├── ui.js           nav, money, number-to-words, GST split, FY, modal, toast
│   │   │   ├── doc.js          document model + A4 renderer (billing & register)
│   │   │   ├── customer-form.js shared add/edit-customer modal
│   │   │   └── project-doc.js  project-document model + A4 renderer (quotation/proposal/SoW/agreement)
│   │   └── pages/
│   │       ├── dashboard.js
│   │       ├── billing.js
│   │       ├── customers.js
│   │       ├── project.js      shared controller for the four project-doc generators
│   │       ├── services.js
│   │       ├── documents.js
│   │       └── settings.js
│   └── vendor/
│       ├── bootstrap/          bootstrap.min.css + bootstrap.bundle.min.js
│       └── fontawesome/        all.min.css + webfonts/
├── src/
│   └── scss/                   SCSS source (compiles to assets/css/main.css)
│       ├── abstracts/          _variables.scss (tokens), _mixins.scss
│       ├── base/               _root, _reset, _typography, _print
│       ├── layout/             _page, _billing, _dashboard
│       ├── components/         _navbar, _cards, _tables, _pills, _buttons,
│       │                       _forms, _segmented, _modal, _toast, _stats
│       ├── document/           _document.scss (A4 invoice / receipt)
│       └── main.scss           entry point (@imports all partials)
└── README.md
```

## How billing works (Model A)

1. **Receipt voucher per installment.** Pick the customer, enter the amount received → GST is backed out (advances are treated GST-inclusive by default) and the voucher discharges tax on that advance. Save it to the register.
2. **Tax invoice on completion.** Switch to *Tax Invoice*, hit **⟳ pull receipts** to load every receipt voucher already issued for that customer + service, and the invoice charges GST on the full fee then subtracts the advances to show **net payable**.

Document numbers look like `CM/BAL/RV/SWD/26-27/1` — `CM` / branch code / type (`RV`/`INV`) / service prefix (`INT`/`TRN`/`SWD`) / financial year / serial. The trailing serial runs **continuously per branch + type + financial year**, shared across all services. Customers are identified by a unique **username** (firstname_secondname), phone and email — there is no separate enrollment reference number.

## Project documents

Beyond billing, the **Projects** tab generates four client-facing documents for IT project work, each on the same branded A4 sheet with a live preview and Print/PDF:

- **Quotation** — priced line items with GST split (CGST+SGST / IGST by client state), discount, validity date and editable terms.
- **Proposal** — narrative pitch: executive summary, objectives, approach, deliverables, timeline and an investment figure.
- **Scope of Work** — objectives, in-scope / out-of-scope lists, deliverables, milestones, assumptions and acceptance criteria.
- **Agreement** — a service contract with an auto-built parties clause, numbered standard clauses (pre-filled, fully editable) and dual signature blocks.

All four reuse the existing **Customers** store as the client and the **Settings** business profile as the provider. Numbers run `CM/<TYPE>/<FY>/<serial>` (e.g. `CM/QUO/26-27/1`), serial per type per financial year. Saved documents live under a `projectDocs` collection in `localStorage` and can be reprinted or deleted from each generator's **Recent** panel. The shared renderer is `assets/js/core/project-doc.js`; the shared page controller is `assets/js/pages/project.js` (driven by `<body data-doctype>` plus `[data-field]` / `.rep` markup in each page).

## Register & GST returns

The **Register** lists **every saved document** — GST bills (receipt vouchers, tax invoices) *and* project documents (quotations, proposals, scopes of work, agreements) — filterable by type, with a **CSV export** (number, date, type, customer/client, ref, GSTIN, state, SAC/project, taxable, CGST, SGST, IGST, total, net). View, reprint or delete any document inline; the correct renderer is used per type. The money totals in the footer cover **GST bills only**, so GSTR-1 reconciliation stays accurate even when project documents are listed.

## Notes

- Every bill and project document has a **Signature line** option — choose a signature space, or a "This is a system-generated document and does not require a signature" notice. The choice is saved with the document and used on reprints.
- Intra-state (customer in your home state) → CGST + SGST; other state → IGST. Driven by the customer's state vs. your home state.
- e-invoicing (IRN/QR) is only mandatory above ₹5 crore aggregate turnover — not handled here by design.
- This is a record-keeping aid, not tax advice; confirm classification of internship fees and advance timing with your CA.
- Data lives only in the browser. Use **Settings → Download backup** regularly.
