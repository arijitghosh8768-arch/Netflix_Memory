# OUR STORY — V2 Private Backend Architecture

This document evaluates and selects the backend architecture to transition **OUR STORY** from a public static client-side application (V1) to a secure, private memory platform (V2).

## 1. Project requirements
* Private memories, videos, images, and audio.
* Authorized viewers only.
* Authentication and Authorization.
* Media served via short-lived signed URLs.
* The existing cinematic frontend (MovieCard, VideoPlayer, etc.) must remain reusable via an adapter/service layer.

## 2. Current V1 architecture
* React + TypeScript + Vite.
* Static public assets (`/public`).
* Client-side routing.
* Zero backend/authentication.

## 3. Option A: Supabase
* **Stack:** Vite + Supabase (Managed PostgreSQL, Auth, Storage, Realtime).
* **Responsibilities:** Authentication, PostgreSQL Database, Private Object Storage, Row Level Security (RLS) for Authorization, and Signed URL generation via Storage API.

## 4. Option B: Firebase
* **Stack:** Vite + Firebase (Firestore, Auth, Cloud Storage).
* **Responsibilities:** Authentication, NoSQL Firestore, Private Cloud Storage, Firebase Security Rules for Authorization, and Signed URL generation via Cloud Functions/Admin SDK.

## 5. Option C: Custom API (e.g., Node.js / PostgreSQL / AWS S3)
* **Stack:** Vite + Custom Server (Express/Nest) + Managed PostgreSQL + AWS S3 (or equivalent).
* **Responsibilities:** Custom authentication/authorization logic, full database control, private S3 buckets, manual AWS SDK signed URL generation.

## 6. Trade-off comparison
* **Authentication support:** All three options provide robust auth. Options A and B provide out-of-the-box managed auth, whereas Option C requires building or wiring a provider (e.g., Auth0/Clerk).
* **Private storage & Signed URLs:** All support private storage and signed URLs. Option A (Supabase) and C (S3) use standard S3-compatible APIs. Firebase uses Google Cloud Storage.
* **Database support:** Supabase offers relational SQL (Postgres), which maps well to users/memories/rules. Firebase is NoSQL document-based. Option C offers total DB freedom.
* **Deployment & Operational complexity:** Options A and B are Backend-as-a-Service (BaaS) and have very low operational overhead. Option C has high operational complexity (managing APIs, servers, scaling).
* **Cost model:** Options A and B have generous free tiers suitable for personal projects. Option C incurs immediate costs for VMs and managed databases.
* **Vendor dependence:** Option B is tightly coupled to Google's proprietary ecosystem. Option A is based on open-source Postgres and can be self-hosted if needed. Option C has zero vendor lock-in but high maintenance.
* **Developer experience:** Options A and B offer unified SDKs for React.

## 7. Selected architecture
**Supabase (Recommended)**
*Why:* Supabase neatly solves all V2 requirements (Auth, Postgres DB, Private Storage, Signed URLs) within a single ecosystem, offers a generous free tier for personal projects, and avoids the proprietary NoSQL vendor lock-in of Firebase by providing standard PostgreSQL. It allows us to easily enforce authorization via Row Level Security (RLS) directly alongside the data. *(Note: This decision can be pivoted before implementation if required).*

## 8. Authentication model
* **Security Identity vs UI Experience:** Profile selection (`PERSON 1`, `OUR STORY`) remains a visual UI experience. True security identity is represented by the Authenticated User session (e.g., an email/password or OAuth login). Profile selection is NOT authentication.
* **Routing:** `/home` and `/watch` will be protected routes. However, frontend protection is just UX; the actual security is enforced by the backend denying API/media requests.

## 9. Authorization model
Access to a memory requires more than just being logged in. The backend will verify if the Authenticated User's ID is explicitly permitted to view the requested Memory ID.

## 10. Storage model
Media moves from `/public` to private storage buckets (e.g., `private-memories`). The buckets strictly block public read access.

## 11. Media delivery model
1. User opens a memory.
2. Frontend requests authorized media via API/SDK.
3. Backend verifies the session (Authentication).
4. Backend verifies access rules (Authorization).
5. Backend generates a short-lived signed URL for the asset.
6. Frontend receives the temporary URL and loads the Video/Image/Audio.
*Note: The frontend NEVER receives storage master keys or private signing keys.*

## 12. Data model
Conceptual minimal relational model:
* `users`: Authentication identities (id, email).
* `memories`: Core memory metadata (id, title, description, date).
* `timeline_events`: Data for the timeline (id, memory_id, date, content).
* `media_assets`: Media references (id, memory_id, type, storage_key, mime_type).
* `access_rules`: Authorization maps linking `users` to `memories` (user_id, memory_id, role).

## 13. Deployment model
* **Frontend:** Vercel (Static hosting for Vite bundle).
* **Backend/Database/Storage:** Managed Backend (e.g., Supabase Cloud).

## 14. Migration plan
1. **Phase A:** Security requirements & architecture (Complete).
2. **Phase B & C:** Provision Backend (Auth, Database, Private Storage).
3. **Phase D & E:** Move media from `public/` to private storage.
4. **Phase F & G:** Implement authorization and Signed URL generation.
5. **Phase H:** Update React components to use an adapter (e.g., `mediaService.ts`).
6. **Phase I & J:** Migrate one memory -> Test -> Migrate all -> Remove public assets.

## 15. Security requirements
* **Vite Environment Variables:** `VITE_*` variables are exposed to the browser. Genuine secrets (`DATABASE_PASSWORD`, `STORAGE_SECRET`) must remain strictly server-side.
* **Fallbacks:** The UI must gracefully handle "Not authenticated", "Unauthorized", "Signed URL expired", and "Media unavailable" states.

## 16. Open decisions
* Exact authentication method (Email/Password, Magic Link, or OAuth).
* Finalization of the database schema migrations.
