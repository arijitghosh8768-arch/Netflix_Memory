# OUR STORY — Private Memory Security Architecture

This document defines the security architecture and threat model for evolving **OUR STORY** from a public static client-side application (V1) into a secure, private memory platform (V2).

## 1. Current Security Model (V1)
* **Architecture:** React + Vite + Static public assets + Client-side routing.
* **Authentication:** None. Profile selection is a UI mechanism, not security.
* **Storage:** Media is stored in the `/public` directory (`/videos`, `/images`, `/audio`).
* **Protection:** Zero. Anyone with the URL (e.g., `https://domain.com/videos/story.mp4`) can access the media.

## 2. Current Limitations
The current application provides **no real protection** for personal media. Obfuscating filenames, hiding the UI, disabling right-clicks, or adding JavaScript-based password checks on the frontend do not constitute security. If the browser can request a file from the server without an authorization token, the file is public.

## 3. Threat Model
### Threat A: Direct Media URL Access
* **Risk:** An attacker discovers a direct media link (e.g., `/videos/story.mp4`).
* **V1 Reality:** The file is fully exposed.
* **V2 Mitigation:** Private storage + authorized access + short-lived signed URLs.

### Threat B: Frontend Source Inspection
* **Risk:** Users inspect JS bundles, HTML, or `VITE_*` environment variables to extract secrets.
* **V2 Mitigation:** Never place database passwords, private API keys, or storage secrets in `VITE_*` variables or React source code.

### Threat C: Stolen Authentication Session
* **Risk:** A session token is hijacked via XSS or network sniffing.
* **V2 Mitigation:** Enforce HTTPS, use secure/HttpOnly cookies (if applicable), implement token expiration, and provide robust logout/invalidation mechanisms.

### Threat D: Unauthorized API Request
* **Risk:** An attacker bypasses the frontend and queries the backend API directly.
* **V2 Mitigation:** The API must verify authorization server-side for every protected request. Frontend route guards, `localStorage`, and hidden UI elements are fundamentally untrusted.

### Threat E: Signed URL Leakage
* **Risk:** An authorized user's generated media link is intercepted or shared.
* **V2 Mitigation:** Media URLs must be short-lived (e.g., expire in 15-60 minutes) and scoped explicitly to the requested asset without exposing underlying permanent bucket credentials.

## 4. Future Private Architecture (V2)
The V2 architecture will use the minimal viable stack to guarantee privacy without over-engineering (no microservices, RBAC bloat, etc.):
**React/Vite Frontend** → **Authentication Layer** → **Application API Layer** → **Authorization Check** → **Private Object Storage** → **Short-Lived Signed URL**

### Authentication vs Authorization
* **Authentication:** *Who are you?* (e.g., logging in via a secure provider).
* **Authorization:** *Are you allowed to access this memory?* (e.g., an authorized user is granted access to the memories on the platform).

## 5. Storage Requirements
* Private object storage buckets must be used.
* Buckets must have **Public Access Prevented**.
* Existing media files will be migrated out of the Git repository (`/public`) into isolated cloud buckets (e.g., `private/memories/`, `private/images/`).

## 6. Signed URL Requirements
When an authorized user requests a memory:
1. The API authenticates the user.
2. The API authorizes the specific memory request.
3. The server generates a short-lived signed URL using secure backend credentials.
4. The server returns the URL to the browser, allowing temporary access to stream the media.

*Note: Once media is legally delivered to the browser, preventing screen-recording or network downloading is fundamentally impossible. The goal is preventing unauthorized access, not impossible copying.*

## 7. Secret-Management Rules
* **Client-side:** Variables prefixed with `VITE_` are public.
* **Server-side:** `PRIVATE_SECRET`, `STORAGE_SECRET`, `AUTH_SECRET`, and database passwords must remain in server-side environment variables.
* Passwords must be verified server-side. No plain-text passwords should ever exist in `config.ts`, frontend `.env`, `localStorage`, or React state.

## 8. API Security Requirements
Conceptual endpoints (e.g., `POST /api/auth/login`, `GET /api/media/:id/url`) must implement:
* Authentication & Authorization
* Input Validation
* Rate Limiting
* Safe Error Messages (no stack traces)
* CORS Configuration
* Abuse Prevention

## 9. Migration Plan
* **Phase A:** Security requirements & planning (Current Step).
* **Phase B:** Choose authentication provider.
* **Phase C:** Choose private storage provider.
* **Phase D:** Create API/server layer.
* **Phase E:** Move media from `public/` to private storage.
* **Phase F:** Implement authorization logic.
* **Phase G:** Implement signed URLs.
* **Phase H:** Update React media loading to use the new endpoints.
* **Phase I:** Execute Security Testing.
* **Phase J:** Production migration.

## 10. Security Testing Plan
Before V2 launch, the following test constraints must pass:
* **Unauthenticated User:** Cannot access private media.
* **Authenticated, Unauthorized User:** Cannot access restricted memory.
* **Expired Signed URL:** Cannot retrieve media.
* **Logged-Out User:** Cannot continue using protected session tokens.
* **Direct Private Storage URL:** Should completely reject access, exposing no public object.
