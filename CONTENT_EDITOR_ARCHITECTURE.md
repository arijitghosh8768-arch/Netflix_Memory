# CONTENT EDITOR ARCHITECTURE

This document outlines the foundation of the Couple Content Editor and Publishing Workflow.

## Editor Structure
The editor at `/admin/couples/:id` functions as a comprehensive, tabbed workspace allowing admins to manage:
- Basic Information (Names, Slug, Dates)
- Hero Content (Title, Description, Media)
- Profiles
- Memories
- Timeline
- Audio & Final Message
- Template Selection
- Publishing & Status

## Couple Content Model
The `Couple` model acts as the root tenant record. It now tracks configuration settings (counter, final messages) and references associated models (`Profile`, `Memory`, `TimelineEvent`). All records enforce tenant isolation via `coupleId`.

## Media References
Instead of hardcoding static URLs, components reference assets via `mediaId` (e.g., `heroMediaId`, `backgroundAudioMediaId`). The UI fetches these mappings to dynamically display assets from `mediaService.ts`.

## Draft State & Preview
By default, newly created websites are in a `DRAFT` state. The public routing layer (`/c/:slug`) returns a "Coming Soon" screen for unauthorized visitors. Admins logged in via `authService.getCurrentAdmin()` bypass this check and see a red "Admin Preview Mode" banner.

## Publishing & Unpublishing
Publishing requires strict validation (Names, Slug, Hero Media, Template selection). Once validated, the status updates to `PUBLISHED` making it accessible publicly. Unpublishing reverts the status to `DRAFT`. Archiving sets the status to `ARCHIVED`, hiding the content from the public but preserving the data for admins.

## Supabase Persistence & Development Fallback
Currently, `coupleService.ts` and `contentService.ts` leverage `localStorage` for development persistence. When integrated with Supabase, these services will act as clients to the PostgREST API, enabling full row-level security (RLS) enforcement on all mutations.

## Tenant Isolation
The editor ensures `contentService` queries and mutations are isolated by `coupleId`. In the future cloud architecture, database rules will guarantee that one admin cannot accidentally modify or associate media from a different couple.

## Public Route Behavior
The V1 cinematic templates (Hero, Home, Timeline, etc.) consume the `CoupleContext`. If the status is not `PUBLISHED`, non-admins are blocked at the router layer (`CoupleWebsite.tsx`).


## STEP 25 - CONTENT MUTATIONS

All mutators for Profiles, Memories, and Timeline Events have been fully mapped to Supabase upsert and delete operations, completing the async editor migration.


## STEP 26 — PRODUCTION ADMIN UX + CONTENT EDITOR HARDENING

Extracted inline prompt() mutators into proper structured React components (ProfileForm, MemoryForm, TimelineForm, MediaPicker). Added dirty state tracking and proper save/publish UI feedback.
