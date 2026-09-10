# B1touch Artistry (B1 Glam Studio) 💄✨

> Lagos' premier destination for luxury makeup artistry, bridal beauty, and dark skin tone expertise.

[![Vercel Deployment](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com)
[![Cloudflare Workers](https://img.shields.io/badge/Backend-Cloudflare%20Workers-f38020?logo=cloudflare)](https://workers.cloudflare.com)
[![Cloudflare D1](https://img.shields.io/badge/Database-Cloudflare%20D1-f38020?logo=cloudflare)](https://developers.cloudflare.com/d1/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Bundler-Vite%205-646CFF?logo=vite)](https://vitejs.dev)

---

## 🌟 Overview & Architecture

B1touch Artistry is engineered with an enterprise-grade, edge-native architecture designed for high availability, low latency, and zero cold-start overhead:

- **Frontend**: React 18, Vite 5, Tailwind CSS, shadcn/ui, Framer Motion, deployed to **Vercel** (`vercel.json`).
- **Backend**: Edge REST API powered by **Cloudflare Workers** (`worker/src/index.ts`).
- **Relational Storage**: **Cloudflare D1** SQLite database (`worker/src/db/schema.sql`).
- **Media & Assets**: **Cloudflare R2** object storage bucket with WebP image pipeline.
- **Edge Caching & Session Store**: **Cloudflare KV** for high-frequency settings, rate-limiting, and stats caching.
- **Client Offline Fallback**: Dual-layer API client (`src/lib/api.ts`) that functions seamlessly both connected to Cloudflare Workers and in standalone/offline demo environments.

---

## 🏛️ System Architecture

```
                                ┌─────────────────────────────────────────┐
                                │          User / Mobile Browser          │
                                └────────────────────┬────────────────────┘
                                                     │
                         ┌───────────────────────────┴───────────────────────────┐
                         ▼                                                       ▼
        ┌────────────────────────────────┐                     ┌──────────────────────────────────┐
        │        Vercel Edge CDN         │                     │        Cloudflare Workers        │
        │   (React SPA + SEO Headers)    │                     │     (REST API / Auth / CORS)     │
        └────────────────────────────────┘                     └────────────────┬─────────────────┘
                                                                                │
                                            ┌───────────────────────────────────┼───────────────────────────────────┐
                                            ▼                                   ▼                                   ▼
                             ┌───────────────────────────────┐ ┌─────────────────────────────────┐ ┌─────────────────────────────────┐
                             │         Cloudflare D1         │ │          Cloudflare R2          │ │          Cloudflare KV          │
                             │  (Relational Database Engine) │ │    (Media & Portfolio Storage)  │ │      (Cache & Rate Limiting)    │
                             └───────────────────────────────┘ └─────────────────────────────────┘ └─────────────────────────────────┘
```

---

## 🔑 Key Features

### 1. Client Experience & Booking Engine
- **Interactive Multi-Step Booking**: Service selection, location type (Studio Ajah vs. Home Glam), date/time pickers, dynamic pricing calculation, and customer notes.
- **Instant Booking Reference**: Automatically generates formatted reference codes (e.g. `B1-2026-9A8B`).
- **WhatsApp Bridge**: Deep-links client booking requests directly to the studio's WhatsApp hotline with pre-filled consultation details.
- **Live Booking Tracker (`/booking/lookup`)**: Clients can look up their appointment status, location directions, and pricing anytime.
- **Dynamic Portfolio & Lightbox (`/portfolio`)**: Category filters, full-screen touch-enabled lightbox with zoom controls and responsive image grid.
- **Beauty Editorial Blog (`/blog`)**: Searchable articles, category tags, reading time, and interactive reader comments.
- **Verified Testimonials (`/testimonials`)**: Public review submissions with star ratings and moderation controls.
- **Newsletter Subscription**: Instant newsletter subscription with duplicate prevention and validation.

### 2. Comprehensive Admin Portal (`/admin`)
- **Protected Staff Authentication**: Web Crypto PBKDF2 password hashing + HMAC-SHA256 JWT tokens.
- **Live Metrics Dashboard**: Quick KPIs on revenue, appointment volume, pending reviews, and subscriber growth.
- **Appointment Manager (`/admin/bookings`)**: Status transitions (`pending`, `confirmed`, `completed`, `cancelled`), price overrides, and internal staff notes.
- **Inquiry Inbox (`/admin/inquiries`)**: Split-view inbox for customer contact submissions with direct email and WhatsApp response triggers.
- **Review Moderation (`/admin/reviews`)**: Approve, reject, feature, or delete client testimonials.
- **Editorial Manager (`/admin/blog`)**: Create, publish, unpublish, and manage beauty articles.
- **Subscriber Directory (`/admin/subscribers`)**: Manage email newsletter subscriber lists.
- **Studio Settings (`/admin/settings`)**: Studio hours, contact numbers, address, and live system status.

---

## 🗄️ Database Schema (Cloudflare D1)

The relational schema is configured in `worker/src/db/schema.sql` and includes:

1. **`users`**: Staff accounts, roles (`admin`, `staff`), PBKDF2 password hashes and salts.
2. **`bookings`**: Reference codes, client contact, service, date, time, location, price, status, and staff notes.
3. **`inquiries`**: Contact form submissions, subject, message, and read/unread status.
4. **`testimonials`**: Customer reviews, star rating (1-5), event type, approval status, and featured flag.
5. **`blog_posts`**: Editorial articles, slugs, excerpts, markdown content, categories, and view counts.
6. **`blog_comments`**: Reader comments linked to blog posts with moderation status.
7. **`newsletter_subscribers`**: Email directory with subscription sources and active flags.
8. **`activity_logs`**: Audit trail for staff logins, booking modifications, and content updates.
9. **`site_settings`**: Key-value runtime configuration store.

---

## 🚀 Deployment Guide

### A. Deploy Backend to Cloudflare Workers

1. **Install Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Authenticate with Cloudflare**:
   ```bash
   wrangler login
   ```

3. **Create Cloudflare Resources**:
   ```bash
   # Create D1 Database
   wrangler d1 create b1_glam_db

   # Create R2 Media Bucket
   wrangler r2 bucket create b1-glam-media

   # Create KV Namespace
   wrangler kv:namespace create CACHE_KV
   ```

4. **Update `wrangler.toml`** with the output IDs from the steps above:
   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "b1_glam_db"
   database_id = "<YOUR_D1_DATABASE_ID>"
   ```

5. **Run Database Migrations & Initial Seed**:
   ```bash
   wrangler d1 execute b1_glam_db --file=./worker/src/db/schema.sql
   wrangler d1 execute b1_glam_db --file=./worker/src/db/seed.sql
   ```

6. **Set Worker Secrets**:
   ```bash
   wrangler secret put JWT_SECRET
   ```

7. **Deploy the Worker**:
   ```bash
   wrangler deploy
   ```

---

### B. Deploy Frontend to Vercel

1. **Push your code to GitHub / Git repository**.
2. **Import the repository in the Vercel Dashboard**.
3. **Set Environment Variables in Vercel**:
   - `VITE_API_URL`: Your deployed Worker URL (e.g. `https://b1-glam-studio-api.workers.dev`)
4. **Build Configuration**:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Click **Deploy**. The `vercel.json` file handles all SPA routing rewrites and security headers automatically.

---

## 🧪 Testing & Verification

Run the full suite of unit tests, TypeScript compiler checks, and code linter:

```bash
# Run Vitest unit tests (Crypto, JWT, Bookings, Blog, Testimonials)
npm test

# Verify Frontend TypeScript
npm run typecheck

# Verify Worker TypeScript
npm run typecheck:worker

# Run ESLint
npm run lint

# Compile production bundle
npm run build
```

---

## 🛡️ Default Staff Credentials (Initial Seed)

- **Admin Portal**: `/admin/login`
- **Email**: `admin@b1touchartistry.com`
- **Password**: `Admin@B1Touch2026!`

*(Remember to update the password immediately upon first production deployment in `/admin/settings`)*

---

## 📞 Studio Contact & Support

- **Studio Address**: Addo Road, Ajah, Lagos, Nigeria
- **WhatsApp Hotline**: [+234 806 165 1126](https://wa.me/2348061651126)
- **Email**: `info@b1touchartistry.com`
- **Website**: [b1touchartistry.com](https://b1touchartistry.com)
