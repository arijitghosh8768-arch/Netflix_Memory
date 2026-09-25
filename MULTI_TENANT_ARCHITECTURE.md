# MULTI-TENANT ARCHITECTURE (Future V2/V3)

This document outlines the architectural blueprint for evolving **OUR STORY** from a single-couple static website into a multi-tenant SaaS platform where multiple couples can have their own personalized memory websites.

**IMPORTANT:** This document represents the *Future Implementation Phase*. The current application remains a V1 static site.

---

## 1. Multi-Tenant Architecture & Unique URLs
The future platform will serve multiple couples from a single frontend deployment. 
* **Unique URL System:** Each couple receives a unique slug (e.g., `/c/john-and-jane` or a custom subdomain `john-jane.ourstory.com`).
* **Runtime Resolution:** The frontend routing layer will extract the slug, query the API for the corresponding couple's data, and render the assigned template.
* **Architecture:** Single Codebase → Dynamic Routing → API Data Hydration → Client/Server Render.

## 2. Admin Panel Architecture
A dedicated secure admin portal (`/admin`) for the business owners to manage the platform.
* **Capabilities:** Create new couple profiles, upload media to private storage, map media to templates, manage orders, and toggle publishing states.
* **Separation:** The admin panel will be a protected route tree or a completely separate Vite/Next.js application, completely inaccessible to unauthenticated users.

## 3. Database & Data Models
The future relational database (e.g., PostgreSQL via Supabase) will conceptually include:

* **Couples (Tenants):** `id`, `slug`, `name_1`, `name_2`, `start_date`, `status` (draft/published).
* **Templates:** `id`, `name`, `configuration_schema`.
* **Couple_Templates:** `couple_id`, `template_id`, `custom_config` (JSON).
* **Media_Assets:** `id`, `couple_id`, `storage_key`, `type` (video/image/audio).
* **Orders:** `id`, `couple_id`, `customer_email`, `payment_status`, `amount`.

## 4. Template System & Versioning
The current cinematic UI will become "Template A". 
* **Abstraction:** UI components will accept data strictly via props matching a generic `TemplateData` interface rather than hardcoded `config.ts` imports.
* **Versioning:** Templates will be strictly versioned (e.g., `v1.0.0`). Changes to a template will not inadvertently break previously published couple websites.

## 5. Media & Storage Architecture
* **Isolation:** Media for each couple will be stored in isolated directories in a private object storage bucket (e.g., `private/couples/{couple_id}/`).
* **Delivery:** Media is never public. The API will generate short-lived signed URLs scoped only to the authenticated or authorized viewer of that specific couple's page.

## 6. Authentication & Authorization Boundaries
* **Admin Authentication:** Strict email/password or SSO for platform administrators to access the dashboard.
* **Viewer Authorization:** Couple pages (`/c/:slug`) can be publicly accessible (if the couple chooses) or protected by a unique Passcode / Magic Link specifically tied to that `couple_id`.
* **Customer Portal (Future):** Couples may eventually get their own login to upload additional media or pay invoices, utilizing Row-Level Security (RLS) to restrict them to their own `couple_id`.

## 7. Publishing & Preview Workflow
* **Draft State:** Newly created couple pages remain in a `draft` state.
* **Preview Workflow:** Admins can view drafts via a secure preview route (e.g., `/preview/:slug`) bypassing standard visibility checks.
* **Publishing:** Only when `status = 'published'` will the public routing layer allow access to the slug.

## 8. Future Payment Integration (Orders)
To monetize the platform:
* **Gateway:** Stripe / Razorpay API integration.
* **Flow:** Customer requests a site → Admin generates an invoice/checkout link → Payment Webhook updates `Orders.payment_status` → Auto-publishes or notifies Admin.
* **Scope:** All API keys and webhooks will be strictly handled server-side.

## 9. Security Model & Scaling Considerations
* **Secrets:** No payment keys or database credentials will ever exist in the Vite client bundle.
* **Scaling:** Because the frontend is a stateless template engine, scaling is achieved via CDN caching for the frontend and autoscaling the backend API (or utilizing a managed BaaS like Supabase).
* **Security Rules:** Database queries must always filter by `couple_id` enforcing tenant isolation at the database layer.

---
*Note: All implementations described in this document are FUTURE implementations. V1 remains fully intact and separated from these concepts.*
