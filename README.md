# QuickHire — Full-Stack Job Hiring Platform

A modern job board platform connecting **employers** and **job seekers**. Employers can post jobs, manage applications and track analytics. Job seekers can browse listings, filter by category/company/location, and apply directly.

---

## 🔗 Live URLs

| Service  | URL |
|----------|-----|
| **Frontend** | https://quick-hire-frontend-59f2.vercel.app/ |
| **Backend API** | https://quick-hire-backend-d7o6.onrender.com |
| **Health check** | https://quick-hire-backend-d7o6.onrender.com/health |
| **Dashboard** | https://quick-hire-frontend-59f2.vercel.app/dashboard |

> **⚠️ Note on backend cold starts:** The backend is hosted on Render's free tier, which spins down after inactivity. The frontend automatically pings `/health` on first load to wake it up. Expect a ~30–60 s delay on the very first request after a period of inactivity.

---

## 📁 Project Structure

```
quick-hire-task/
├── frontend/        # Next.js 16 app (Vercel)
└── backend/         # Express + Prisma + PostgreSQL (Render)
```

---

## 🖥️ Frontend

### Tech Stack

| Tool | Purpose |
|------|---------|
| **Next.js 16** (App Router) | Framework |
| **React 19** | UI library |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | UI components |
| **Tiptap** | Rich text editor (job descriptions) |
| **React Hook Form + Zod** | Form validation |
| **Axios** | HTTP client |
| **sonner** | Toast notifications |
| **ClashDisplay** | Primary font (local, `/public/fonts/`) |
| **lucide-react** | Icons |

### Key Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, featured jobs, latest jobs, categories, CTA |
| `/jobs` | Public job listing with sidebar filters (type, location, category, company, keyword) |
| `/jobs?category_id=X` | Pre-filtered by category (banner + "View all" button) |
| `/jobs?company_id=X` | Pre-filtered by company |
| `/companies` | Browse companies with load-more pagination |
| `/login` | Demo login → redirects to `/dashboard` |
| `/register` | Demo register → redirects to `/dashboard` |
| `/dashboard` | Overview analytics (jobs, applications, pipeline, top jobs, recent applications) |
| `/dashboard/jobs` | Manage jobs (create, edit, delete, filter) |
| `/dashboard/applications` | Manage all applications |
| `/dashboard/categories` | Manage job categories |
| `/dashboard/companies` | Manage companies |
| `/dashboard/locations` | Manage locations |
| `/dashboard/users` | Manage users |
| `/dashboard/profile` | Profile settings |

> **Demo auth note:** A full login/authentication system is not implemented yet. To access dashboard pages, either go to `/login` and click the **Login** button, or navigate directly to `/dashboard`.

### Environment Variables (Frontend)

Create `frontend/.env.development`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3005/api
NEXT_PUBLIC_ASSET_URL=http://localhost:3005
```

For production (Vercel):

```env
NEXT_PUBLIC_API_URL=https://quick-hire-backend-d7o6.onrender.com/api
NEXT_PUBLIC_ASSET_URL=https://quick-hire-backend-d7o6.onrender.com
```

### Running Locally

```bash
cd frontend
npm install
npm run dev        # starts on http://localhost:3004
```

### Build

```bash
npm run build
npm start
```

---

## ⚙️ Backend

### Tech Stack

| Tool | Purpose |
|------|---------|
| **Express 5** | HTTP framework |
| **TypeScript** | Type safety |
| **Prisma 7** | ORM (multi-file schema) |
| **PostgreSQL** (Neon) | Database |
| **Zod** | Request validation |
| **Multer** | File uploads (resumes, logos) |
| **CORS** | Cross-origin config |

### Data Models

```
User          — EMPLOYER / ADMIN roles
Job           — title, description, type, salary, status, tags, category, company, location
Company       — name, industry, size, logo, employer (nullable, multiple companies per employer)
Category      — name, logo, is_featured
Location      — name
Application   — applicant info, resume PDF, cover letter, status (APPLIED → SHORTLISTED → HIRED/REJECTED)
```

### API Modules & Routes

#### Auth (dev mode)
Auth is simulated — all protected routes use the first user in the DB as the authenticated user (JWT commented out for demo purposes).

#### Jobs `/api/job`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | Public | List jobs (paginated, filterable) |
| GET | `/:id` | Public | Get job by ID |
| GET | `/slug/:jobId` | Public | Get job by slug |
| GET | `/with-count` | 🔒 | Jobs with application count |
| GET | `/analytics` | 🔒 | Dashboard analytics |
| POST | `/` | 🔒 | Create job |
| PATCH | `/:id` | 🔒 | Update job |
| DELETE | `/:id` | 🔒 | Soft delete |

#### Applications `/api/application`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | 🔒 | All applications |
| GET | `/job/:jobId` | 🔒 | Applications for a job |
| GET | `/:id` | 🔒 | Single application |
| POST | `/` | Public | Submit application (with resume upload) |
| PATCH | `/:id/status` | 🔒 | Update status |
| DELETE | `/:id` | 🔒 | Soft delete |

#### Companies `/api/company`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | Public | List companies |
| GET | `/dropdown` | Public | Dropdown options |
| GET | `/me` | 🔒 | My companies |
| GET | `/:id` | Public | Single company |
| POST | `/` | 🔒 | Create |
| PATCH | `/:id` | 🔒 | Update |
| DELETE | `/:id` | 🔒 | Soft delete |

#### Categories `/api/category`
| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/` | Public | List (with job counts) |
| GET | `/dropdown` | Public | Dropdown |
| GET | `/featured` | Public | Featured categories |
| POST | `/` | 🔒 | Create |
| PATCH | `/:id` | 🔒 | Update |
| DELETE | `/:id` | 🔒 | Delete |

#### Other modules
- `/api/location` — CRUD for locations
- `/api/user` — CRUD for users, `GET /me` for profile
- `/api/upload` — logo and resume uploads (served from `/uploads/`)

### Environment Variables (Backend)

Create `backend/.env`:

```env
DATABASE_URL="postgresql://user:password@host/db?sslmode=require"
PORT=3005
ALLOW_ORIGIN=http://localhost:3004
```

For production:

```env
DATABASE_URL="<your neon connection string>"
PORT=3005
ALLOW_ORIGIN=https://quick-hire-frontend-59f2.vercel.app
```

### Database Setup

```bash
cd backend
npm install

# Run all migrations
npx prisma migrate deploy

# Regenerate Prisma client
npx prisma generate

# (Optional) Open Prisma Studio
npx prisma studio
```

### Running Locally

```bash
npm run dev        # nodemon, starts on http://localhost:3005
```

### Build & Start (Production)

```bash
npm run build      # tsc → dist/
npm start          # node dist/src/index.js
```


---

## 🚀 Deployment

### Frontend → Vercel
1. Connect GitHub repo, set root to `frontend/`
2. Add env vars (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_ASSET_URL`)
3. Deploy

### Backend → Render
1. Connect GitHub repo, set root to `backend/`
2. Build command: `npm install && npx prisma generate && npm run build`
3. Start command: `npm start`
4. Add env vars (`DATABASE_URL`, `PORT`, `ALLOW_ORIGIN`)

> **Free tier sleep:** Render free instances sleep after 15 minutes of inactivity. The frontend pings `/health` on load to wake the backend before any user interactions.

---

## 📦 Features Summary

- ✅ Public job listing with multi-filter sidebar (keyword, job type, work mode, location, category)
- ✅ URL-driven filtering (`?category_id=`, `?company_id=`) with banner + "View all" clear
- ✅ Featured jobs, latest jobs, and featured categories on home page
- ✅ Companies browse page with load-more pagination
- ✅ Job application submission (resume PDF upload, cover letter)
- ✅ Dashboard analytics (job stats, application pipeline, top jobs, recent applications)
- ✅ Full CRUD for jobs, applications, companies, categories, locations, users
- ✅ Rich text editor for job descriptions (Tiptap)
- ✅ File uploads for logos and resumes
- ✅ Responsive design with mobile sidebar navigation
- ✅ ClashDisplay custom font throughout
- ✅ Soft deletes on all major entities
