# CodeMetrix Billing

A self-contained, static GST billing app for CodeMetrix — generate **receipt vouchers** (for advances/installments) and **tax invoices** (on completion, adjusting advances), with customers, services, and an issued-document register all managed in one place. No backend, no build step.

## Running it

The app stores data in the browser's `localStorage`, which needs a stable origin. Two options:

**Recommended — serve it locally:**
```bash
cd codemetrix-billing
python3 -m http.server 8000
# open http://localhost:8000
```

**Quick look — open `index.html` directly.** Works in Chrome/Firefox; some browsers (e.g. Safari) restrict `localStorage` on `file://`, so data may not persist. Serving locally avoids this.

To deploy for real, drop the folder on any static host (Netlify, GitHub Pages, S3, your existing static setup).

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
├── dashboard.html      Receipts / invoices / GST overview, filterable by date
├── index.html          Billing — generate RV / Tax Invoice (live A4 preview)
├── customers.html      Manage students & clients (search + per-customer ledger)
├── project.html        Project documents hub (quotation / proposal / SoW / agreement)
├── quotation.html      Quotation generator (line items, GST, validity)
├── proposal.html       Proposal generator (summary, approach, timeline, investment)
├── scope.html          Scope of Work generator (objectives, in/out scope, milestones)
├── agreement.html      Service Agreement generator (clauses + dual signatures)
├── services.html       Manage services, SAC codes, GST rates
├── documents.html      Register of every issued document + CSV export
├── settings.html       Business profile, centres, data backup
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
