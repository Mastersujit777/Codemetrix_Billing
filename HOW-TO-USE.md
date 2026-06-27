# How to use the database-sync automation

This project is **not** on a server. The app and its data are shared by a small
team through **Git**. Only **one person uses it at a time** — you "pass the baton"
by pushing the database after your turn so the next person can pull it.

Two double-click files in the project folder do all the work for you:

| File | When to run it | What it does |
|------|----------------|--------------|
| **`pull-load.bat`**        | **Before** you start working | Pulls the latest code + data from Git and loads it into your local database |
| **`save-commit-push.bat`** | **After** you finish working  | Saves your database, commits it (with the date & time), and pushes it to Git |

The shared database lives in the repo as a single file, `db/snapshot.sql`.

---

## ⭐ The golden rules (read this first)

1. **Always run `pull-load.bat` before you start.** Otherwise you'll work on old data.
2. **Always run `save-commit-push.bat` when you finish.** Otherwise your work isn't shared.
3. **Only one person works at a time.** Don't start until the previous person says
   they've pushed (e.g. a quick WhatsApp: *"pushed — you're up"*).

> ⚠️ If two people work at the same time, Git **cannot merge** two database
> snapshots, and one person's work will be lost. The turn-taking rule above is
> what keeps everyone's data safe.

---

## One-time setup (each computer, done once)

1. Install **PostgreSQL 17** (everyone must use the **same major version, 17**).
2. Install **Git**.
3. Get the project folder with `git clone <repo-url>` (or copy it).
4. Create a `.env` file in the project folder with your local database details:
   ```
   DB_NAME=codemetrix_billing
   DB_USER=postgres
   DB_PASSWORD=your-local-postgres-password
   DB_HOST=localhost
   DB_PORT=5432
   ```
5. Set up the app (one time): create the virtual environment and install
   dependencies — see the main `README.md` ("Running it" section).

You do **not** need to create the database by hand — `pull-load.bat` creates it
for you the first time and loads the shared data.

---

## Your daily routine

### 1. Start your turn
Double-click **`pull-load.bat`**.

It will:
- `git pull` the latest code and `db/snapshot.sql`
- load that snapshot into your local database (this **replaces** your local data)
- apply any new database updates (migrations)

When it says **"you may start working"**, open the app as usual
(`python manage.py runserver`, then http://127.0.0.1:8000) and do your work.

### 2. Finish your turn
Close the app, then double-click **`save-commit-push.bat`**.

It will:
- save your current database into `db/snapshot.sql`
- commit it with a message like `db snapshot: 2026-06-27 13:08:01`
  (the date & time make the latest data commit easy to find)
- `git push` it so the next person can pull

When it says **"Snapshot pushed — the next person can pull"**, tell the team
you're done.

---

## Frequently asked

**Do I lose my work if I run `pull-load.bat`?**
That file **overwrites** your local database with the shared one from Git, so only
run it at the **start** of your turn (before you've changed anything). Never run it
after you've done work you haven't pushed.

**It says "No snapshot changes to commit."**
That just means your database is identical to the last push — nothing to share.
It's harmless; the file still pushes any other pending changes.

**Where is the data actually stored?**
In your local PostgreSQL, and as a text file `db/snapshot.sql` inside the project.
That file is the thing that travels between people through Git.

**Are the login accounts shared too?**
Yes. The snapshot includes the user logins, so everyone shares the same accounts.

**A window flashed and closed / I saw a red error.**
The `.bat` files pause at the end so you can read messages. If something failed
(e.g. "git pull" couldn't connect, or PostgreSQL isn't running), fix that and run
the file again. If you're stuck, send the message text to whoever set this up.

---

## Quick reference

```
START of your turn   ->  double-click  pull-load.bat
   ... use the app ...
END of your turn     ->  double-click  save-commit-push.bat
```

That's the whole workflow. Keep the order, take turns, and the data stays in sync.
