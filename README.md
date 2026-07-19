# Radha Homes Properties — Full MERN Stack

MongoDB + Express + React + Node.js. Company info, Owner details, Team members and
Properties are all managed from the **Admin Panel** and stored in **MongoDB Atlas** —
edit karte hi turant website par live dikhta hai, kisi bhi device/browser se.

## Folder Structure
```
radha-mern/
  server/   -> Express + MongoDB API
  client/   -> React (Vite) frontend
```

## What's in the Admin Panel
- **Dashboard** — quick stats (properties, categories, team, inquiries)
- **Properties** — add / edit / delete, multi-photo upload straight to Cloudinary
- **Property Categories** — manage the list of property types shown across the site
- **Team Management** — add/edit/delete team members, upload photo, set display order,
  activate/deactivate (only Active members show on the client site)
- **Company Settings** — company name, logo, about text, address, phone, email,
  WhatsApp, Facebook/Instagram/YouTube links, office timing, Google Maps link, and a
  dynamic **Owner** section (photo, name, designation, phone, email, description)
- **Inquiries** — leads submitted through the client Contact form
- **Users** — manage who can log in to this Admin Panel

## 1) Backend Setup

```bash
cd server
npm install
```

`.env` file already MongoDB URI ke saath ready hai (aapne jo diya tha). Ek baar check
kar lein:
- `MONGO_URI` — aapka Atlas connection string
- `JWT_SECRET` — deploy se pehle isko change kar dein, koi lamba random string daal dein
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — pehla admin account banane ke liye (sirf seed ke time use hota hai)
- `CLOUDINARY_URL` — property/logo/team/owner photo uploads ke liye. Cloudinary dashboard →
  apni account ke "API environment variable" wale box se poori line copy karke yahan
  paste kar dein (format: `cloudinary://<api_key>:<api_secret>@<cloud_name>`).

**MongoDB Atlas mein apna server IP whitelist karna na bhoolein**: Atlas dashboard →
Network Access → Add IP Address (ya "Allow Access from Anywhere" for testing).

Database mein starting properties, categories, team members, settings aur admin user
daalne ke liye:
```bash
npm run seed
```
Ye ek baar chalayein. Terminal mein admin email/password print hoga — usi se login karein.
Seed sirf **empty** collections ko fill karta hai, so it's safe to re-run without
overwriting your admin edits.

Server start karein:
```bash
npm run dev
```
API chalega: `http://localhost:5000/api`

## 2) Frontend Setup

```bash
cd client
npm install
npm run dev
```
Site khulegi: `http://localhost:5173`

Admin panel: `http://localhost:5173/admin/login`

## API Endpoints (reference)
| Method | Route | Auth | Kaam |
|---|---|---|---|
| POST | /api/auth/login | — | Admin login, JWT token milta hai |
| GET | /api/auth/admins | Admin | Admin panel users list |
| POST | /api/auth/admins | Admin | Naya admin user add |
| DELETE | /api/auth/admins/:id | Admin | Admin user remove |
| GET | /api/properties | Public | Published properties (optional `?type=Villa`) |
| GET | /api/properties/all | Admin | All properties incl. unpublished/drafts |
| GET | /api/properties/:id | Public | Single property (published only) |
| POST/PUT/DELETE | /api/properties(/:id) | Admin | Property manage |
| POST | /api/properties/:id/duplicate | Admin | Duplicate a property (starts unpublished) |
| GET | /api/categories | Public/Admin | Property categories (optional `?active=true`) |
| POST/PUT/DELETE | /api/categories(/:id) | Admin | Category manage |
| GET | /api/team | Public | Active team members only |
| GET | /api/team/all | Admin | All team members |
| GET | /api/team/:id | Public | Single team member (detail page) |
| POST/PUT/PATCH/DELETE | /api/team(/:id) | Admin | Team member manage / toggle status |
| GET | /api/settings | Public | Company info (name, logo, favicon, social, etc.) |
| PUT | /api/settings | Admin | Settings update |
| DELETE | /api/settings/owner-photo | Admin | Remove owner photo (legacy Settings-based field) |
| GET | /api/owner | Public | Dynamic "About Owner" profile (only if active) |
| GET/PUT | /api/admin/owner | Admin | View/update the Owner Profile |
| POST | /api/admin/owner/upload-photo | Admin | Upload/replace owner photo (JPG/PNG/WEBP, max 5MB) |
| DELETE | /api/admin/owner/photo | Admin | Remove owner photo |
| GET | /api/faqs | Public | Active FAQs |
| GET | /api/faqs/all | Admin | All FAQs |
| POST/PUT/DELETE | /api/faqs(/:id) | Admin | FAQ manage |
| GET | /api/testimonials | Public | Active testimonials |
| GET | /api/testimonials/all | Admin | All testimonials |
| POST/PUT/DELETE | /api/testimonials(/:id) | Admin | Testimonial manage |
| GET | /api/home-content | Public | Hero slides, counters, partners |
| PUT | /api/home-content | Admin | Update homepage content |
| GET | /api/blogs | Public | Published blog posts |
| GET | /api/blogs/all | Admin | All blog posts (incl. unpublished) |
| GET | /api/blogs/:slugOrId | Public | Single blog post |
| POST/PUT/DELETE | /api/blogs(/:id) | Admin | Blog manage |
| POST | /api/inquiries | Public | Contact form + Property "Enquire Now" form submit here |
| GET/PUT/DELETE | /api/inquiries(/:id) | Admin | View/update/delete leads |
| GET | /api/upload/signature | Admin | Signed Cloudinary upload permission |

## Premium Property Detail Page (`/property/:id`)
Every property card links to a full detail page (gallery, overview specs,
amenities, furnishing, nearby places, price breakdown with an EMI calculator,
documents, video, agent card, similar properties, and a mobile sticky action
bar). All of it is driven by ~50 optional fields on the `Property` model —
existing properties keep working with the old fields; new fields just render
when an admin fills them in via **Properties > Advanced Details**.

## Everything Else Is Admin-Managed
Company Settings (incl. favicon, LinkedIn/Twitter), a dedicated Owner Profile
page (photo upload with drag-and-drop, auto-replaces the old image), Home
Page Content (hero slider, stat counters, partner logos), Blogs, FAQs, and
Testimonials are all editable from the Admin Panel sidebar and reflect
instantly on the client site — nothing is hardcoded. `/owner` and `/company`
are dedicated standalone pages for the owner profile and company info.

## Deploy on Vercel

Vercel is best suited for the **frontend**; the backend also deploys fine as a
Vercel Function (zero-config, since `server.js` exports the Express app).
Deploy them as **two separate Vercel projects** from the same repo.

### A) Backend (`server/`)
1. Push this whole repo to GitHub.
2. On Vercel → **Add New Project** → import the repo → set **Root Directory**
   to `server`.
3. Framework preset: "Other" (Vercel auto-detects the Express app since
   `server.js` exports `app`). No `vercel.json` needed here.
4. Add these **Environment Variables** in the Vercel project settings
   (copy values from your local `server/.env`):
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_URL`
   - `CLIENT_ORIGIN` — set this to your **frontend's** Vercel URL once you
     have it (comma-separate if you also want to allow `http://localhost:5173`
     during testing)
5. Deploy. Note the resulting URL, e.g. `https://radha-api.vercel.app`.
   Test it: `https://radha-api.vercel.app/api/health` should return
   `{"status":"ok"}`.
6. `npm run seed` only needs to be run **once**, from your local machine
   (it uses the same `MONGO_URI`, so it seeds the same Atlas database the
   deployed backend reads from) — no need to run it on Vercel.

### B) Frontend (`client/`)
1. On Vercel → **Add New Project** → same repo → set **Root Directory** to
   `client`. Framework preset: Vite (auto-detected).
2. Add environment variable:
   - `VITE_API_URL` = `https://radha-api.vercel.app/api` (your backend URL
     from step A, with `/api` at the end)
3. Deploy. A `client/vercel.json` is already included so client-side routes
   like `/admin/login` work correctly on refresh.
4. Once you know the frontend's final URL, go back to the **backend**
   project's env vars and update `CLIENT_ORIGIN` to match it exactly, then
   redeploy the backend (Vercel → Deployments → Redeploy).

### Notes specific to Vercel
- All photo uploads (properties, team, logo, owner photo) go **directly
  from the browser to Cloudinary** (not through the backend), so Vercel's
  4.5MB function payload limit doesn't affect uploads.
- MongoDB connections are reused across warm invocations where possible,
  but cold starts will open a fresh connection — this is normal for
  serverless and fine at small/medium traffic.

## Security Notes
- `.env` file kabhi bhi public GitHub repo mein commit na karein — password aur DB
  credentials expose ho jayenge.
- Deploy se pehle `JWT_SECRET` aur `ADMIN_PASSWORD` dono change kar lein.
- Agar aapka Cloudinary API secret kabhi kisi screenshot/chat mein share hua ho, use
  Cloudinary dashboard → Settings → Security se **regenerate** kar dein aur `.env` mein
  naya `CLOUDINARY_URL` update kar dein.
